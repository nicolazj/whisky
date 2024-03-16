import { useEffect, useRef } from 'react'
import { Button } from './components/button'

export function Droper() {
  const ref = useRef<HTMLDivElement>(null)
  const dragover = (ev: DragEvent) => {
    // console.log('dragover', ev)
    ev.preventDefault()
  }
  const drop = (ev: DragEvent) => {
    ev.preventDefault()
    window.api.transcribe(ev.dataTransfer.files[0].path)
  }

  useEffect(() => {
    ref.current.addEventListener('dragover', dragover)
    ref.current.addEventListener('drop', drop)

    return () => {
      ref.current.removeEventListener('dragover', dragover)
      ref.current.removeEventListener('drop', drop)
    }
  }, [])

  return (
    <div className="flex-1 w-full min-h-full  p-4" ref={ref}>
      <div className="flex-1 min-h-full  border-dashed border-4  rounded flex flex-col justify-center items-center">
        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Drop your files here to transcribe
        </h4>

        <p className="leading-7 m-6 text-muted-foreground">Or</p>
        <label className="" htmlFor="file-upload">
          <Button asChild>
            <span className="">Browse for files</span>
          </Button>
          <input className="sr-only" id="file-upload" type="file" />
        </label>
      </div>
    </div>
  )
}
