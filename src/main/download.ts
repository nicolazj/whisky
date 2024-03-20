import { download } from 'electron-dl'
import fs from 'fs'
import { setting } from './settings'
import { WHISPER_MODELS_OPTIONS } from './constants'
import path from 'path'
import { BrowserWindow } from 'electron'
class Downloader {
  async init(win: BrowserWindow) {
    let model = WHISPER_MODELS_OPTIONS[0]
    let defaultModelPath = path.join(setting.whisperModelPath(), model.name)
    if (fs.existsSync(defaultModelPath)) return
    await download(win, model.url, {
      showBadge: true,
      filename: model.name,
      directory: setting.whisperModelPath()
    })
  }
}

export const downloader = new Downloader()
