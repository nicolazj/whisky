import { app, ipcMain } from 'electron'
import settings from 'electron-settings'
import fs from 'fs-extra'
import path from 'path'
import { DATABASE_NAME, LIBRARY_PATH_SUFFIX, WHISPER_MODELS_OPTIONS } from '../shared/constants'

import { WhisperConfigType } from '../shared/whisper.types'
import log from './logger'

let logger = log.scope('setting')

class Setting {
  constructor() {}
  libraryPath() {
    let library = path.join(app.getPath('documents'), LIBRARY_PATH_SUFFIX)
    fs.ensureDirSync(library)
    return library
  }
  dbPath() {
    const dbName = app.isPackaged ? `${DATABASE_NAME}.db` : `${DATABASE_NAME}_dev.db`
    return path.join(this.libraryPath(), dbName)
  }
  whisperModelPath() {
    return path.join(this.libraryPath(), 'models')
  }

  whisperModel() {
    let model = settings.getSync('whisper.model') as string
    logger.log('model from settings', model)
    if (model && fs.existsSync(path.join(this.whisperModelPath(), model))) return model
    for (let i = 0; i < WHISPER_MODELS_OPTIONS.length; i++) {
      model = WHISPER_MODELS_OPTIONS[i].name
      if (fs.existsSync(path.join(this.whisperModelPath(), model))) {
        return model
      }
    }
  }

  whisperConfig(): WhisperConfigType {
    let model = this.whisperModel()!
    let service = (settings.getSync('whisper.service') ?? 'local') as WhisperConfigType['service']

    return {
      service,
      model: model,
      modelsPath: path.join(this.whisperModelPath(), model)
    }
  }

  setSync(...args: Parameters<typeof settings.setSync>) {
    return settings.setSync(...args)
  }

  init() {
    ipcMain.handle('get-library-path', () => this.libraryPath())
    ipcMain.handle('get-setting', (_event, key: string) => settings.getSync(key) ?? false)
    ipcMain.handle('set-setting', (event, key: string, value: any) => {
      settings.setSync(key, value)
      event.sender.send('query-client-revalidate', ['setting', key])
    })
  }
}

export const setting = new Setting()
