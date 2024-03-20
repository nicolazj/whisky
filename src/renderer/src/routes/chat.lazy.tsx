import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/chat')({
  component: Chat,
})

function Chat() {
  return <div className="p-4">Coming soon...</div>
}