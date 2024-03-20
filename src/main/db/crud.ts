import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { ipcMain } from 'electron'
import { Task } from '../../shared/api'
import log from '../logger'
import { transcrptions } from '../../shared/schema'
import { db } from './db'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'
import fs from 'fs-extra'
import { eq, desc } from 'drizzle-orm'
import { readFile } from 'fs/promises'
import { setting } from '../settings'
import { WhisperOutputType } from '../../shared/whisper.types'
import { WHISPER_MODELS_OPTIONS } from '../constants'

const logger = log.scope('crud')

// This will run migrations on the database, skipping the ones already applied

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
    let b = await readFile(path.resolve(setting.libraryPath(), `${id}.json`), 'utf-8')
    let json = JSON.parse(b) as WhisperOutputType
    return json
  }
  public async getWhisperModels() {
    return await Promise.all(
      WHISPER_MODELS_OPTIONS.map(async (o) => {
        return { ...o, downloaded: fs.existsSync(path.join(setting.whisperModelPath(), o.name)) }
      })
    )
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
    ipcMain.handle('get-whisper-models', (_event) => {
      return this.getWhisperModels()
    })
  }
}

export const crud = new CRUD(db)
