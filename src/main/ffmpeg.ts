import ffmpegPath from 'ffmpeg-static'
import ffprobePath from '@andrkrn/ffprobe-static'
import Ffmpeg from 'fluent-ffmpeg'
import log from './logger'
import path from 'path'
import fs from 'fs-extra'

/*
 * ffmpeg and ffprobe bin file will be in /app.asar.unpacked instead of /app.asar
 * the /samples folder is also in /app.asar.unpacked
 */
Ffmpeg.setFfmpegPath(ffmpegPath!.replace('app.asar', 'app.asar.unpacked'))
Ffmpeg.setFfprobePath(ffprobePath!.replace('app.asar', 'app.asar.unpacked'))

const logger = log.scope('ffmpeg')
export  class FfmpegWrapper {
  convertToWav(input: string, output: string, options: string[] = []): Promise<string> {
    const ffmpeg = Ffmpeg()
    return new Promise((resolve, reject) => {
      ffmpeg
        .input(input)
        .outputOptions('-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', ...options)
        .on('start', (commandLine) => {
          logger.debug(`Trying to convert ${input} to ${output}`)
          logger.info('Spawned FFmpeg with command: ' + commandLine)
          fs.ensureDirSync(path.dirname(output))
        })
        .on('end', (stdout, stderr) => {
          if (stdout) {
            logger.debug(stdout)
          }

          if (stderr) {
            logger.info(stderr)
          }

          if (fs.existsSync(output)) {
            resolve(output)
          } else {
            reject(new Error('FFmpeg command failed'))
          }
        })
        .on('error', (err: Error) => {
          logger.error(err)
          reject(err)
        })
        .save(output)
    })
  }
}


export const ffmpeg = new FfmpegWrapper()