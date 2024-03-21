import { spawn } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import url from 'url'
import { PROCESS_TIMEOUT, WHISPER_MODELS_OPTIONS } from '../shared/constants'
import log from './logger'
import { setting } from './settings'
import { WhisperOutputType } from '../shared/whisper.types'
import { ipcMain } from 'electron'

const __filename = url.fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename).replace('app.asar', 'app.asar.unpacked')
const logger = log.scope('whisper')

export class Whisper {
  private binMain: string

  constructor() {
    this.binMain = path.join(__dirname, 'lib', 'whisper', 'main')
  }
  init() {
    this.registerIpcHandlers()
  }

  currentModel() {
    let config = setting.whisperConfig()
    return config.modelsPath
  }
  async transcribe(
    file?: string,
    options?: {
      force?: boolean
      extra?: string[]
      onProgress?: (progress: number) => void
    }
  ): Promise<Partial<WhisperOutputType>> {
    logger.debug('transcribing from local')

    const model = this.currentModel()

    const { force = true, extra = [], onProgress } = options || {}
    const filename = path.basename(file!, path.extname(file!))
    const tmpDir = setting.libraryPath()
    const outputFile = path.join(tmpDir, filename + '.json')

    logger.info(`Trying to transcribe ${file} to ${outputFile}`)
    if (fs.pathExistsSync(outputFile) && !force) {
      logger.info(`File ${outputFile} already exists`)
      return fs.readJson(outputFile)
    }

    const commandArguments: string[] = [
      '--file',
      file!,
      '--model',
      model!,
      '--output-json',
      '--output-txt',
      '--output-file',
      path.join(tmpDir, filename),
      '-pp',
      '--language',
      'auto',
      '--split-on-word',
      '--max-len',
      '1',
      ...extra
    ]

    logger.info(`Running command: ${this.binMain} ${commandArguments.join(' ')}`)

    const command = spawn(this.binMain, commandArguments, {
      timeout: PROCESS_TIMEOUT
    })

    return new Promise((resolve, reject) => {
      command.stdout.on('data', (data) => {
        logger.debug(`stdout: ${data}`)
      })

      command.stderr.on('data', (data) => {
        const output = data.toString()
        logger.info(`stderr: ${output}`)
        if (output.startsWith('whisper_print_progress_callback')) {
          const progress = parseInt(output.match(/\d+%/)?.[0] || '0')
          if (typeof progress === 'number' && onProgress) onProgress(progress)
        }
      })

      command.on('exit', (code) => {
        logger.info(`transcribe process exited with code ${code}`)
      })

      command.on('error', (err) => {
        logger.error('transcribe error', err.message)
        reject(err)
      })

      command.on('close', () => {
        if (fs.pathExistsSync(outputFile)) {
          resolve(fs.readJson(outputFile))
        } else {
          reject(new Error('Transcription failed'))
        }
      })
    })
  }

  public async getWhisperModels() {
    return WHISPER_MODELS_OPTIONS.map((o) => {
      return {
        ...o,
        downloaded: fs.existsSync(path.join(setting.whisperModelPath(), o.name)),
        active: setting.whisperModel() === o.name
      }
    })
  }

  private registerIpcHandlers() {
    ipcMain.handle('get-whisper-models', (_event) => {
      return this.getWhisperModels()
    })
  }
}
export const whisper = new Whisper()
