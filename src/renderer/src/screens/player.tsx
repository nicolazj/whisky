import { Button } from '@renderer/components/button'
import { ScrollArea } from '@renderer/components/scroll-area'
import React, { useRef } from 'react'
import { TranscriptionSelectType } from 'src/shared/schema'
import { WhisperOutputType } from 'src/shared/whisper.types'

interface Props {
  trans: TranscriptionSelectType
  json: WhisperOutputType
  library:string
}
export function Player({ trans, json,library }: Props) {
  let ref = useRef<HTMLAudioElement>()
  console.log({library})
  let a = new Audio('')
  a.preload = 'auto'

  let url = `whisky://${library}/${trans.id}.wav`
  // let url ='enjoy://library/audios/fb2ac910ca359800811464ce681bc59a.wav'
  console.log('audio',`whisky://${library}/${trans.id}.wav`)
  return (
    <>
      <ScrollArea>
        {json.transcription.map((t, i) => {
          return (
            <React.Fragment key={i}>
              <span>{t.text}</span>
              {t.text[t.text.length - 1] === '.' ? <br /> : null}
            </React.Fragment>
          )
        })}
      </ScrollArea>
      <div>
        <Button onClick={async ()=>{
            let blob = await fetch(url).then(re=>re.blob())
         
            let a = ref.current
            a.src = URL.createObjectURL(blob)
            a.load()
            a.play()
        }}>click</Button>
        <p>
          {`whisky://${library}/${trans.id}.wav`}
        </p>
        {/* <audio src="whisky:///Users/lj/Documents/WhiskyLibrary/jfk.wav" controls/> */}
        <audio controls className='w-full' src={`whisky://${library}/${trans.id}.wav`} preload='meta' ref={ref}>
          {/* <source src={`whisky://${library}/${trans.id}.wav`} type="audio/wav" /> */}
        </audio>
      </div>
    </>
  )
}
