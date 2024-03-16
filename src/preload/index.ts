import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import ffmpegPath from 'ffmpeg-static'
console.log(ffmpegPath)
import { API } from './types'

// Custom APIs for renderer
export const api: API = {
  ping: () => ipcRenderer.send('ping'),
  transcribe: (filepath: string) => {

    



    return ipcRenderer.invoke('transcribe', filepath)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
