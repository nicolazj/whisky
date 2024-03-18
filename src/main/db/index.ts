import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { ipcMain } from 'electron'
import { Task } from '../../shared/api'
import log from '../logger'
import { tasks } from '../../shared/schema'
import { getDB } from './db'
const logger = log.scope('db')

class DB {
  private db: BetterSQLite3Database
  constructor() {
    this.db = getDB().db
  }

  private async addTask(task: Task) {
    logger.log('add task')

    let res = await this.db.insert(tasks).values(
      task.type === 'file'
        ? task.files.map((f) => ({
            path: f.path,
            name: f.name,
            size: f.size,
            type: f.type
          }))
        : [
            {
              path: task.link
            }
          ]
    )
    console.log(res)
  }
  private async getTasks() {
    return this.db.select().from(tasks).all()
  }
  registerIpcHandlers() {
    ipcMain.handle('addTask', async (event, task: Task) => {
      await this.addTask(task)
      event.sender.send('query-client-revalidate', ['tasks'])
    })
    ipcMain.handle('getTasks', async () => {
      return this.getTasks()
    })
  }
}

export const db = new DB()
