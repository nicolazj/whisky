import { Player } from '@renderer/screens/player'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/transcriptions/$id')({
  loader: async ({ params: { id } }) => {
    return {
      trans: await window.api.getTranscriptionById(id),
      json: await window.api.getTransJSONById(id),
  
      library: await window.api.getLibraryPath()
    }
  },
  component: Transcriptions
})

function Transcriptions() {
  const { trans, json,library } = Route.useLoaderData()
  return (
    <div className="flex flex-col  h-full p-4">
      {/* <div className="border-yellow-500 border-2 overflow-y-scroll">
        <div className="h-[2000px] border-blue-500 border-4"></div>
      </div> */}

      <Player  trans={trans} json={json} library={library}/>
    </div>
  )
}
