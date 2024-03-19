import { ipcRenderer } from 'electron'
import { TranscriptionSelectType } from '../shared/schema'
import { Task } from '../shared/api'
import { WhisperOutputType } from '../shared/whisper.types'

export const api = {
  addTask(task: Task) {
    return ipcRenderer.invoke('addTask', task)
  },
  getTasks(): Promise<TranscriptionSelectType[]> {
    return ipcRenderer.invoke('getTasks')
  },
  getTranscriptionById(id: string): Promise<TranscriptionSelectType|undefined> {
    return ipcRenderer.invoke('get-transcription-by-id', id)
  },
  getTransJSONById(id: string):Promise<WhisperOutputType>{
    return ipcRenderer.invoke('get-transjson-by-id', id)
  },
  getLibraryPath(){
    return ipcRenderer.invoke('get-library-path')
  }
}

export type API = typeof api
