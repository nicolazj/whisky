import { Input } from '@renderer/components/input'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/resizable'
import { TranscriptionList } from '@renderer/components/trans-list'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/transcriptions')({
  component: Transcriptions
})

function Transcriptions() {
  return (
    <ResizablePanelGroup direction="horizontal" className="">
      <ResizablePanel
        maxSize={24}
        minSize={20}
        className="min-w-[240px]  h-[calc(100vh-32px)] flex flex-col"
      >
        <div className=" bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8" />
            </div>
          </form>
        </div>
        
        <TranscriptionList />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel  className='h-[calc(100vh-32px)] '>
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
