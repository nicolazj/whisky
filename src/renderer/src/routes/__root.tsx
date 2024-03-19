import { Separator } from '@radix-ui/react-separator'
import { Nav } from '@renderer/components/nav'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/resizable'
import { cn } from '@renderer/lib/utils'
import { useFetchTasks } from '@renderer/query'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AudioLines, Bot, ListOrdered, Settings } from 'lucide-react'
import React from 'react'
export const Route = createRootRoute({
  component: () => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const { data: task } = useFetchTasks()
    return (
      <>
        <header className="h-8 min-h-8 w-full drag border-b"></header>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="h-full  items-stretch">
            <ResizablePanel
              maxSize={24}
              minSize={20}
              collapsedSize={4}
              className={cn(
                isCollapsed && 'min-w-[50px] ',
                'flex flex-col py-2 transition-all duration-300 ease-in-out'
              )}
              collapsible
              onCollapse={() => {
                setIsCollapsed(true)
              }}
              onExpand={() => {
                setIsCollapsed(false)
              }}
            >
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    to: '/',
                    title: 'Home',
                    //   label: '128',
                    icon: AudioLines,
                  },
                  {
                    to: '/transcriptions',
                    title: 'Transcriptions',
                    label: task?.length?.toString() ?? '',
                    icon: ListOrdered,
                  },
                  {
                    to: '/chat',
                    title: 'Chat',
                    icon: Bot,
                  }
                ]}
              />

              <Separator className="flex-1" />
              <Nav
                isCollapsed={false}
                links={[
                  {
                    to: '/settings',
                    title: 'Settings',
                    icon: Settings,
                  }
                ]}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <Outlet />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </>
    )
  }
})
