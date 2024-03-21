import { ipcMain } from 'electron'
import { download } from 'electron-dl'
import { WHISPER_MODELS_OPTIONS } from '../shared/constants'
import { setting } from './settings'
import { WindowManage, wm } from './window'
import { createHash } from 'crypto'
import fs from 'fs-extra'
import path from 'path'

function hashFile(path: string) {
  const algo = 'sha1'
  return new Promise((resolve, reject) => {
    const hash = createHash(algo)
    const stream = fs.createReadStream(path)
    stream.on('error', reject)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
  })
}

class Downloader {
  constructor(private wm: WindowManage) {}
  async init() {
    this.registerIpcHandlers()
  }

  private registerIpcHandlers() {
    ipcMain.handle('download-whisper-model', async (event, name: string) => {
      let model = WHISPER_MODELS_OPTIONS.find((op) => op.name === name)!
      let win = this.wm.getWin()
      try {
        await download(win!, model.url, {
          showBadge: true,
          overwrite: true,
          filename: model.name,
          directory: setting.whisperModelPath(),
          onProgress: (p) => {
            event.sender.send(`download-whisper-model-progress-${model.name}`, p.percent * 100)
          }
        })
        const hash = await hashFile(path.join(setting.whisperModelPath(), model.name))
        if (hash === model.sha) {
          event.sender.send(`download-whisper-model-succeeded-${model.name}`)
        } else throw 'sha not matched'
      } catch (err) {
        event.sender.send(`download-whisper-model-failed-${model.name}`)
      } finally {
        event.sender.send('query-client-revalidate', ['models'])
      }
    })
  }
}

export const downloader = new Downloader(wm)
