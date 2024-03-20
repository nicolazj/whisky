import { download } from 'electron-dl'
import fs from 'fs'
import { setting } from './settings'
import { WHISPER_MODELS_OPTIONS } from './constants'
import path from 'path'
import { BrowserWindow, ipcMain } from 'electron'
class Downloader {
  async init(win: BrowserWindow) {
    this.registerIpcHandlers(win)

    this.downloadDefaultModel(win)
  }
  async downloadDefaultModel(win) {
    let model = WHISPER_MODELS_OPTIONS[0]
    let defaultModelPath = path.join(setting.whisperModelPath(), model.name)
    if (fs.existsSync(defaultModelPath)) return
    await download(win, model.url, {
      showBadge: true,
      filename: model.name,
      directory: setting.whisperModelPath()
    })
  }
  private registerIpcHandlers(win) {
    ipcMain.handle('download-whisper-model', async (event, name: string) => {
      let model = WHISPER_MODELS_OPTIONS.find((op) => op.name === name)!
      await download(win, model.url, {
        showBadge: true,
        filename: model.name,
        directory: setting.whisperModelPath()
      })
      event.sender.send('query-client-revalidate', ['models'])

    })
  }
}

export const downloader = new Downloader()
