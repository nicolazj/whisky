import { ScrollArea } from '@renderer/components/scroll-area'
import { Table, TableBody, TableCell, TableRow } from '@renderer/components/table'
import { useFetchWhisperModel } from '@renderer/query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Download } from 'lucide-react'
export const Route = createLazyFileRoute('/settings')({
  component: Settings
})

function WhisperSettings() {
  let { data = [] } = useFetchWhisperModel()
  let downloaded = data.filter((d) => d.downloaded)
  let undownloaded = data.filter((d) => !d.downloaded)
  return (
    <div className="w-[400px]">
      <h1 className="text-xl mb-4">Whisper settings</h1>
      <h2 className="text-lg mb-2">Download models</h2>

      <Table className="">
        <TableBody>
          {downloaded.map((model) => {
            return (
              <TableRow key={model.name}>
                <TableCell>
                  <div className="text-sm font-bold">{model.type}</div>
                  <div className="text-xs opacity-50">{model.desc}</div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <h2 className="text-lg mb-2">Available models</h2>
      <Table className="">
        <TableBody>
          {undownloaded.map((model) => {
            return (
              <TableRow key={model.name}>
                <TableCell>
                  <div className="text-sm font-bold">{model.type}</div>
                  <div className="text-xs opacity-50">
                    {model.desc} ({model.size})
                  </div>
                </TableCell>
                <TableCell>
                  <Download className="w-4" />
                </TableCell>
              </TableRow>
            )
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
