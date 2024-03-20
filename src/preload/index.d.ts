import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from './api'
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}


declare module 'electron' {
  interface IpcRenderer {
   invoke(eventName: "event1" | "event2", ...args: any[]): Promise<any>;
 }
}