import { useEffect, useState } from 'react'
import { Progress } from './progress'

export function TransProgress({ id }: { id: string }) {
  let [value, setValue] = useState(0)
  useEffect(() => {
    return window.electron.ipcRenderer.on(
      `transcribe-progress-${id}`,
      (_event, progress: number) => {
        setValue(progress)
      }
    )
  }, [])

  return <Progress value={value}></Progress>
}
