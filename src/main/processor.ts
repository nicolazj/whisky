import path from 'path'
import { TranscriptionSelectType } from '../shared/schema'
import { ffmpeg } from './ffmpeg'
import { setting } from './settings'
import { whisper } from './whisper'
import fs from 'fs-extra'

export type Processor = (
  trans: TranscriptionSelectType,
  onProgress: (progress: number) => void
) => void

export const processor: Processor = async (trans, onProgress) => {
  let wavPath = path.resolve(setting.libraryPath(), `${trans.id}.wav`)
  if (!fs.existsSync(wavPath)) {
    await ffmpeg.convertToWav(trans.path, wavPath)
  }
  await whisper.transcribe(wavPath, { onProgress })
}
