import { ipcRenderer } from 'electron'
import { TranscriptionSelectType } from '../shared/schema'
import { Task } from '../shared/api'
import { WhisperOutputType } from '../shared/whisper.types'
import { WHISPER_MODELS_OPTIONS } from '../main/constants'


type Model = typeof WHISPER_MODELS_OPTIONS[number] & {downloaded:boolean}
export const api = {
  addTask(task: Task) {
    return ipcRenderer.invoke('add-task', task)
  },
  getTasks(): Promise<TranscriptionSelectType[]> {
    return ipcRenderer.invoke('get-tasks')
  },
  getTranscriptionById(id: string): Promise<TranscriptionSelectType|undefined> {
    return ipcRenderer.invoke('get-transcription-by-id', id)
  },
  getTransJSONById(id: string):Promise<WhisperOutputType>{
    return ipcRenderer.invoke('get-transjson-by-id', id)
  },
  getLibraryPath(){
    return ipcRenderer.invoke('get-library-path')
  },
  getWhisperModels():Promise<Model[]>{
    return ipcRenderer.invoke('get-whisper-models')
  }
}

export type API = typeof api
