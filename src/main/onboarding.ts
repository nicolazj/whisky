import { WHISPER_MODELS_OPTIONS } from '../shared/constants'
import { downloader } from './download'
import { setting } from './settings'

class Onboarding {
  async init() {
    let model = setting.whisperModel()
    if (!model) {
      setting.setSync('onboarded', false)
      await downloader.downloadWhisperModel(WHISPER_MODELS_OPTIONS[0].name)
      setting.setSync('onboarded', true)
    }
  }
}

export const onboarding = new Onboarding()
