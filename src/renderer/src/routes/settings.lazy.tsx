import { Checkbox } from '@renderer/components/checkbox'
import { Progress } from '@renderer/components/progress'
import { ScrollArea } from '@renderer/components/scroll-area'
import { Table, TableBody, TableCell, TableRow } from '@renderer/components/table'
import { useFetchWhisperModel } from '@renderer/query'
import { useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { check } from 'drizzle-orm/mysql-core'
import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
export const Route = createLazyFileRoute('/settings')({
  component: Settings
})

function ModelDownloadItem({ model }: any) {
  let [downloading, setDownloading] = useState(false)
  let [progress, setProgress] = useState(0)
  let client = useQueryClient()

  let download = (name: string) => {
    setDownloading(true)
    window.api.downloadWhisperModel(name)
  }
  useEffect(() => {
    return window.electron.ipcRenderer.on(
      `download-whisper-model-progress-${model.name}`,
      (_event, progress: number) => {
        setProgress(progress)
      }
    )
  }, [])
  let onCheckedChange = async (name: string) => {
    await window.api.setSetting('whisper.model', name)
    client.invalidateQueries({
      queryKey: ['models']
    })
  }
  return (
    <TableRow key={model.name}>
      <TableCell>
        <div className="text-sm font-bold flex gap-2 items-center">
          {model.type}
          {model.active ? (
            <span className="text-[10px] rounded bg-foreground/30 block px-1"> ACTIVE</span>
          ) : null}
        </div>
        <div className="text-xs opacity-50">
          {model.desc} ({model.size})
        </div>
      </TableCell>
      <TableCell className="">
        <div className="w-full flex justify-end">
          {model.downloaded ? (
            <Checkbox
              checked={model.active}
              className="mr-2"
              onCheckedChange={() => {
                onCheckedChange(model.name)
              }}
            />
          ) : downloading ? (
            <Progress value={progress} className="w-[100px]" />
          ) : (
            <Download className="w-4" onClick={() => download(model.name)} />
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

function WhisperSettings() {
  let { data: models = [] } = useFetchWhisperModel()
  return (
    <div className="w-[500px]">
      <h1 className="text-xl mb-4">Whisper settings</h1>
      <h2 className="text-lg mb-2">Models</h2>

      <Table className="">
        <TableBody>
          {models.map((model) => {
            return <ModelDownloadItem key={model.name} model={model} />
          })}
        </TableBody>
      </Table>
    </div>
  )
}
function Settings() {
  return (
    <div className="p-4 h-[calc(100vh-32px)] flex flex-col">
      <ScrollArea>
        <WhisperSettings />
      </ScrollArea>
    </div>
  )
}
