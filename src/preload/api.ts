import { ipcRenderer } from 'electron'
import { TranscriptionSelectType } from '../shared/schema'
import { TransTask } from '../shared/api.types'
import { WhisperOutputType } from '../shared/whisper.types'
import { WHISPER_MODELS_OPTIONS } from '../shared/constants'

export type Model = (typeof WHISPER_MODELS_OPTIONS)[number] & {
  downloaded: boolean
  active: boolean
}
export const api = {
  addTask(task: TransTask) {
    return ipcRenderer.invoke('add-task', task)
  },
  getTasks(): Promise<TranscriptionSelectType[]> {
    return ipcRenderer.invoke('get-tasks')
  },
  getTranscriptionById(id: string): Promise<TranscriptionSelectType | undefined> {
    return ipcRenderer.invoke('get-transcription-by-id', id)
  },
  getTransJSONById(id: string): Promise<WhisperOutputType> {
    return ipcRenderer.invoke('get-transjson-by-id', id)
  },
  deleteTransById(id: string) {
    return ipcRenderer.invoke('delete-trans-by-id', id)
  },
  reTransById(id: string) {
    return ipcRenderer.invoke('re-trans-by-id', id)
  },
  getLibraryPath() {
    return ipcRenderer.invoke('get-library-path')
  },
  getWhisperModels(): Promise<Model[]> {
    return ipcRenderer.invoke('get-whisper-models')
  },
  downloadWhisperModel(model: string) {
    return ipcRenderer.invoke('download-whisper-model', model)
  },

  getSetting(key: string) {
    return ipcRenderer.invoke('get-setting', key)
  },
  setSetting(key: string, value: any) {
    return ipcRenderer.invoke('set-setting', key, value)
  }
}

export type API = typeof api
