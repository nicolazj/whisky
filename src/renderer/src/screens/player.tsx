import { ScrollArea } from '@renderer/components/scroll-area'
import React, { useEffect, useRef } from 'react'
import { TranscriptionSelectType } from 'src/shared/schema'
import { WhisperOutputType } from 'src/shared/whisper.types'

interface Props {
  trans: TranscriptionSelectType
  json: WhisperOutputType
  library: string
}
export function Player({ trans, json, library }: Props) {
  let ref = useRef<HTMLAudioElement>(null)
  let div = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let url = `whisky://${library}/${trans.id}.wav`

    fetch(url)
      .then((re) => re.blob())
      .then((blob) => {
        let a = ref.current
        if (a) {
          a.src = URL.createObjectURL(blob)
        }
      })
  }, [trans.id])
  let onTimeUpdate: React.ReactEventHandler<HTMLAudioElement> = (e) => {
    let a = ref.current
    if (!a) return
    let currentTime = a.currentTime * 1000
    let d = div.current
    if (!d) return
    let spans = d.querySelectorAll('span')
    for (let i = 0; i < spans.length; i++) {
      let from = parseInt(spans[i].dataset.from ?? '0')
      let to = parseInt(spans[i].dataset.to ?? ' 0')
      if (currentTime > from && currentTime < to) {
        spans[i].classList.remove('decoration-transparent')
        spans[i].classList.add('decoration-yellow-500')
        spans[i].scrollIntoView({
          block:'center',behavior:'smooth'
        })
      } else {
        spans[i].classList.add('decoration-transparent')
        spans[i].classList.remove('decoration-yellow-500')
      }
    }
  }

  return (
    <>
      <ScrollArea className='flex-1'>
        <div ref={div} className=''>
          {json.transcription.map((t, i) => {
            return (
              <React.Fragment key={i}>
                <span
                  data-from={t.offsets.from}
                  data-to={t.offsets.to}
                  className="text-[32px] decoration-8 underline decoration-transparent skip-ink"
                >
                  {t.text}
                </span>
                {t.text[t.text.length - 1] === '.' ? <div className="m-8" /> : null}
              </React.Fragment>
            )
          })}
        </div>
      </ScrollArea>
      <div className="mt-4">
        {/* <audio src="whisky:///Users/lj/Documents/WhiskyLibrary/jfk.wav" controls/> */}
        <audio controls className="w-full" ref={ref} onTimeUpdate={onTimeUpdate}>
          {/* <source src={`whisky://${library}/${trans.id}.wav`} type="audio/wav" /> */}
        </audio>
      </div>
    </>
  )
}
