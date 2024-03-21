import { desc, eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { ipcMain } from 'electron'
import fs from 'fs-extra'
import path from 'path'
import { TransTask } from '../../shared/api.types'
import { transcrptions } from '../../shared/schema'
import { WhisperOutputType } from '../../shared/whisper.types'
import log from '../logger'
import { setting } from '../settings'
import { db } from './db'

const logger = log.scope('crud')


export class CRUD {
  constructor(private db: BetterSQLite3Database) {}

  public async init() {
    await this.migration()
    this.registerIpcHandlers()
  }

  private async migration() {
    logger.log('migration started...')
    migrate(this.db, { migrationsFolder: path.resolve(__dirname, './migrations') })
  }

  public async addTask(task: TransTask) {
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
    return await this.db.select().from(transcrptions).orderBy(desc(transcrptions.createdAt)).all()
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

  public async getTranscriptionById(id: string) {
    let items = await this.db.select().from(transcrptions).where(eq(transcrptions.id, id)).limit(1)
    return items.length > 0 ? items[0] : undefined
  }
  public async getTransJSONById(id: string) {
    let b = await fs.readFile(path.resolve(setting.libraryPath(), `${id}.json`), 'utf-8')
    let json = JSON.parse(b) as WhisperOutputType
    return json
  }
  public async deleteTransById(id: string) {
   await this.db.delete(transcrptions).where(eq(transcrptions.id, id))
   
  }

  private registerIpcHandlers() {
    ipcMain.handle('get-tasks', async () => {
      return this.getTasks()
    })
    ipcMain.handle('get-transcription-by-id', (_event, id: string) => {
      return this.getTranscriptionById(id)
    })
    ipcMain.handle('get-transjson-by-id', (_event, id: string) => {
      return this.getTransJSONById(id)
    })
    ipcMain.handle('delete-trans-by-id', async (event, id: string) => {
      await this.deleteTransById(id)
      event.sender.send('query-client-revalidate', ['tasks'])
    })
  
  }
}

export const crud = new CRUD(db)
