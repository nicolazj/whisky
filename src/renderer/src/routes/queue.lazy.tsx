import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/queue')({
  component: Queue,
})

function Queue() {
  return <div className="p-2">Hello from queue!</div>
}