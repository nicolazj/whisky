import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transcriptions/')({
  component: Transcriptions
})

function Transcriptions() {
  return (
    <div className="flex flex-row  h-full items-center justify-center">
        Select a transcription to start
    </div>
  )
}
