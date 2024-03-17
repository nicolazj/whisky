import { Separator } from '@radix-ui/react-separator'
import { Nav } from '@renderer/components/nav'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from '@renderer/components/resizable'
import { cn } from '@renderer/lib/utils'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { AudioLines, Bot, ListOrdered, Settings } from 'lucide-react'
import React from 'react'
export const Route = createRootRoute({
  component: () => {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    return (
      <>
        <header className="h-8 w-full drag border-b"></header>
        <div className="flex-1">
          <ResizablePanelGroup direction="horizontal" className="h-full  items-stretch">
            <ResizablePanel
              maxSize={20}
              minSize={15}
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
                    title: 'Transcriptions',
                    //   label: '128',
                    icon: AudioLines,
                    variant: 'default'
                  },
                  {
                    to: '/settings',
                    title: 'Queue',
                    label: '9',
                    icon: ListOrdered,
                    variant: 'ghost'
                  },
                  {
                    to: '/chat',
                    title: 'Chat',
                    icon: Bot,
                    variant: 'ghost'
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
                    variant: 'ghost'
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
