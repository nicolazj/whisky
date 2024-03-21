import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@renderer/components/dialog'
import { Progress } from '@renderer/components/progress'
import { useFetchSetting } from '@renderer/query'
import { useEffect, useState } from 'react'
import { WHISPER_MODELS_OPTIONS } from '../../../shared/constants'

export function Onboarding() {
  let { data: onboarded, isFetched } = useFetchSetting('onboarded')
  let show = isFetched && !onboarded
  let [progress, setProgress] = useState(0)

  useEffect(() => {
    return window.electron.ipcRenderer.on(
      `download-whisper-model-progress-${WHISPER_MODELS_OPTIONS[0].name}`,
      (_event, progress: number) => {
        setProgress(progress)
      }
    )
  }, [])

  return (
    <Dialog open={show}>
      <DialogContent closeButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Welcome to Whisky</DialogTitle>
          <DialogDescription>
            Sit tight and relax, we are downloading essential files for this wounderful tool to
            work.
          </DialogDescription>
        </DialogHeader>
        <Progress value={progress} className="my-4" />
      </DialogContent>
    </Dialog>
  )
}
