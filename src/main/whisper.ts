import { spawn } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import url from 'url'
import { PROCESS_TIMEOUT, WHISPER_MODELS_OPTIONS } from './constants'
import log from './logger'
import settings from './settings'

const __filename = url.fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename).replace('app.asar', 'app.asar.unpacked')
const logger = log.scope('whisper')

export class Whisper {
  private binMain: string
  private bundledModelsDir: string
  public config: WhisperConfigType

  constructor() {
    this.bundledModelsDir = path.join(__dirname, 'lib', 'whisper', 'models')

    this.binMain = path.join(__dirname, 'lib', 'whisper', 'main')

    const models: Array<(typeof WHISPER_MODELS_OPTIONS)[number] & { savePath: string }> = []

    const bundledModels = fs.readdirSync(this.bundledModelsDir)
    for (const file of bundledModels) {
      const model = WHISPER_MODELS_OPTIONS.find((m) => m.name == file)
      if (!model) continue

      models.push({
        ...model,
        savePath: path.join(this.bundledModelsDir, file)
      })
    }

    const dir = path.join(settings.libraryPath(), 'whisper', 'models')
    fs.ensureDirSync(dir)
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const model = WHISPER_MODELS_OPTIONS.find((m) => m.name == file)
      if (!model) continue

      models.push({
        ...model,
        savePath: path.join(dir, file)
      })
    }
    settings.setSync('whisper.availableModels', models)
    settings.setSync('whisper.modelsPath', dir)
    this.config = settings.whisperConfig()
  }

  currentModel() {
    if (!this.config.availableModels) return

    let model: WhisperConfigType['availableModels'][0] | undefined
    if (this.config.model) {
      model = (this.config.availableModels || []).find((m) => m.name === this.config.model)
    }
    if (!model) {
      model = this.config.availableModels[0]
    }

    settings.setSync('whisper.model', model.name)
    return model.savePath
  }
  async transcribe(
    params: {
      file?: string
      blob?: {
        type: string
        arrayBuffer: ArrayBuffer
      }
    },
    options?: {
      force?: boolean
      extra?: string[]
      onProgress?: (progress: number) => void
    }
  ): Promise<Partial<WhisperOutputType>> {
    logger.debug('transcribing from local')

    const { blob } = params
    let { file } = params
    if (!file && !blob) {
      throw new Error('No file or blob provided')
    }

    const model = this.currentModel()

    if (blob) {
      const format = blob.type.split('/')[1]

      if (format !== 'wav') {
        throw new Error('Only wav format is supported')
      }

      file = path.join(settings.cachePath(), `${Date.now()}.${format}`)
      await fs.outputFile(file, Buffer.from(blob.arrayBuffer))
    }

    const { force = false, extra = [], onProgress } = options || {}
    const filename = path.basename(file!, path.extname(file!))
    const tmpDir = settings.cachePath()
    const outputFile = path.join(tmpDir, filename + '.json')

    logger.info(`Trying to transcribe ${file} to ${outputFile}`)
    if (fs.pathExistsSync(outputFile) && !force) {
      logger.info(`File ${outputFile} already exists`)
      return fs.readJson(outputFile)
    }
    console.log({model})

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
}
export const whisper = new Whisper()