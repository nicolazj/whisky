import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/chat')({
  component: Chat,
})

function Chat() {
  return <div className="p-2">Hello from chat!</div>
}