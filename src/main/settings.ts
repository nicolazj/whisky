import { app, ipcMain } from 'electron'
import settings from 'electron-settings'
import fs from 'fs-extra'
import path from 'path'
import { DATABASE_NAME, LIBRARY_PATH_SUFFIX } from './constants'

if (process.env.SETTINGS_PATH) {
  settings.configure({
    dir: process.env.SETTINGS_PATH,
    prettify: true
  })
}

const libraryPath = () => {
  const _library = settings.getSync('library')

  if (!_library || typeof _library !== 'string') {
    settings.setSync(
      'library',
      process.env.LIBRARY_PATH || path.join(app.getPath('documents'), LIBRARY_PATH_SUFFIX)
    )
  } else if (path.parse(_library).base !== LIBRARY_PATH_SUFFIX) {
    settings.setSync('library', path.join(_library, LIBRARY_PATH_SUFFIX))
  }

  const library = settings.getSync('library') as string
  fs.ensureDirSync(library)

  return library
}

const cachePath = () => {
  const tmpDir = path.join(libraryPath(), 'cache')
  fs.ensureDirSync(tmpDir)

  return tmpDir
}

const dbPath = () => {
  const dbName = app.isPackaged ? `${DATABASE_NAME}.sqlite` : `${DATABASE_NAME}_dev.sqlite`
  return path.join(userDataPath(), dbName)
}

const whisperConfig = (): WhisperConfigType => {
  const model = settings.getSync('whisper.model') as string

  let service = settings.getSync('whisper.service') as WhisperConfigType['service']

  if (!service) {
    settings.setSync('whisper.service', 'local')
    service = 'local'
  }

  return {
    service,
    availableModels: settings.getSync(
      'whisper.availableModels'
    ) as WhisperConfigType['availableModels'],
    modelsPath: settings.getSync('whisper.modelsPath') as string,
    model
  }
}

const userDataPath = () => {
  const userData = path.join(libraryPath(), settings.getSync('user.id')?.toString() ?? '')
  fs.ensureDirSync(userData)

  return userData
}
const setSync = (...args: Parameters<typeof settings.setSync>) => settings.setSync(...args)

ipcMain.handle('get-library-path',()=>libraryPath())

// @ts-ignore
export default {
  cachePath,
  libraryPath,
  userDataPath,
  dbPath,
  whisperConfig,
  setSync
}
