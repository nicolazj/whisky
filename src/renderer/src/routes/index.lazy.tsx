import { createLazyFileRoute } from '@tanstack/react-router'
import { FileAudio, Mic, Podcast, Import } from 'lucide-react'
import { ClipboardEventHandler } from 'react'
export const Route = createLazyFileRoute('/')({
  component: Index
})

let data = [
  {
    title: 'Open files...',
    icon: FileAudio
  },
  {
    title: 'New Recording',
    icon: Mic
  },
  {
    title: 'Transcribe Podcasts',
    icon: Podcast
  }
]

function Index() {
  let onPaste: ClipboardEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    let paste = event.clipboardData?.getData('text')
    console.log(paste)
  }
  return (
    <div className="p-4 ">
      <div
        className="hover:bg-accent w-full h-[200px] border-dashed border mb-8 rounded-lg items-center justify-center flex flex-col gap-2"
        onPaste={onPaste}
      >
        <Import />
        <p className="text-lg">Drop files here</p>
        <p className="text-sm">or paste any youtube, podcast links</p>
      </div>

      <div className=" grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
        {data.map((d) => {
          return (
            <div
              key={d.title}
              className="rounded-lg hover:bg-accent transition-all border p-4  h-[128px] flex  flex-col items-center  justify-center gap-2"
            >
              <d.icon className="" />
              <p className="text-xs ">{d.title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
