import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@renderer/components/resizable'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="h-8 w-full drag"></header>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel maxSize={20}>
          <nav className="flex flex-col p-4">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>{' '}
            <Link to="/about" className="[&.active]:font-bold">
              About
            </Link>
          </nav>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
})
