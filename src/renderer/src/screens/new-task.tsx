import { FileAudio, Import, Mic, Podcast } from 'lucide-react'
import { ClipboardEventHandler, DragEventHandler } from 'react'
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

export function NewTask() {
  let onPaste: ClipboardEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    let paste = event.clipboardData?.getData('text')
    console.log(paste)
  }

  let onDrop: DragEventHandler<HTMLDivElement> = (ev) => {
    console.log('ondrop')
    ev.preventDefault()
    if (!ev.dataTransfer) return
    if (!ev.dataTransfer.files) return
    console.log(ev.dataTransfer.files)
    window.api.addTask({
      type: 'file',
      files: [...ev.dataTransfer.files].map((f) => ({
        path: f.path,
        name: f.name,
        size: f.size,
        type: f.type
      }))
    })
  }

  let onDragOver: DragEventHandler<HTMLDivElement> = (ev) => {
    console.log('ondragover')
    ev.preventDefault()
  }
  return (
    <div className="p-4 ">
      <div
        className="hover:bg-accent w-full h-[200px] border-dashed border mb-8 rounded-lg items-center justify-center flex flex-col gap-2"
        onPaste={onPaste}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
