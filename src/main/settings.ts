import { app, ipcMain } from 'electron'
import settings from 'electron-settings'
import fs from 'fs-extra'
import path from 'path'
import { DATABASE_NAME, LIBRARY_PATH_SUFFIX, WHISPER_MODELS_OPTIONS } from './constants'

import { WhisperConfigType } from '../shared/whisper.types'

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
  }
}

export const setting = new Setting()
