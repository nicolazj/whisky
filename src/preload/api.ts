import { ipcRenderer } from 'electron'
import { TaskSelectType } from '../shared/schema'
import { Task } from '../shared/api'


export const api = {
 

  ping() {
    ipcRenderer.send('ping')
  },

  registerQueryClient(callback: any) {},

  transcribe(filepath: string) {
    return ipcRenderer.invoke('transcribe', filepath)
  },
  addTask(task:Task) {
    return ipcRenderer.invoke('addTask', task)
  },
  getTasks():Promise<TaskSelectType[]> {
    console.log("calling getTasks")
    return ipcRenderer.invoke('getTasks')
  }
}

export type API = typeof api;