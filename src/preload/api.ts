import { ipcRenderer } from 'electron'
import { TranscriptionSelectType } from '../shared/schema'
import { Task } from '../shared/api'


export const api = {
  addTask(task:Task) {
    return ipcRenderer.invoke('addTask', task)
  },
  getTasks():Promise<TranscriptionSelectType[]> {
    return ipcRenderer.invoke('getTasks')
  }
}

export type API = typeof api;