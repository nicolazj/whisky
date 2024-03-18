import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { ipcMain } from 'electron'
import { Task } from '../../shared/api'
import log from '../logger'
import { transcrptions } from '../../shared/schema'
import { getDB } from './db'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'
import { eq, desc } from 'drizzle-orm'

const logger = log.scope('crud')

// This will run migrations on the database, skipping the ones already applied

export class CRUD {
  private db: BetterSQLite3Database
  constructor() {
    this.db = getDB().db
  }

  public async init() {
    await this.migration()
    this.registerIpcHandlers()
  }

  private async migration() {
    await migrate(this.db, { migrationsFolder: path.resolve(__dirname, './migrations') })
  }

  public async addTask(task: Task) {
    await this.db.insert(transcrptions).values(
      task.type === 'file'
        ? task.files.map((f) => ({
            path: f.path,
            name: f.name,
            type: task.type
          }))
        : [
            {
              path: task.link,
              type: task.type
            }
          ]
    )
  }

  public async getTasks() {
    return this.db.select().from(transcrptions).all()
  }
  public async pickTask() {
    let items = await this.db
      .select()
      .from(transcrptions)
      .where(eq(transcrptions.status, 'init'))
      .orderBy(desc(transcrptions.createdAt))
      .limit(1)

    return items.length > 0 ? items[0] : undefined
  }
  public async resetTasks() {
    await this.db
      .update(transcrptions)
      .set({
        status: 'init'
      })
      .where(eq(transcrptions.status, 'processing'))
  }
  public async updateTask(id: string, status: string) {
    return this.db.update(transcrptions).set({ status: status }).where(eq(transcrptions.id, id))
  }
  private registerIpcHandlers() {
    ipcMain.handle('getTasks', async () => {
      return this.getTasks()
    })
  }
}

export const crud = new CRUD()
