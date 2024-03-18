import path from 'path'
import { TranscriptionSelectType } from '../../shared/schema'
import { ffmpeg } from '../ffmpeg'
import settings from '../settings'
import { whisper } from '../whisper'

export type Processor = (
  trans: TranscriptionSelectType,
  onProgress: (progress: number) => void
) => void

export const processor: Processor = async (trans, onProgress) => {
  let wavPath = await ffmpeg.convertToWav(
    trans.path,
    path.resolve(settings.libraryPath(), `${trans.id}.wav`)
  )
  console.log({ wavPath })
  await whisper.transcribe(wavPath, { onProgress })
}
