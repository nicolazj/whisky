import { NewTask } from '@renderer/screens/new-task'
import { createLazyFileRoute } from '@tanstack/react-router'
export const Route = createLazyFileRoute('/')({
  component: Index
})



function Index() {

  return (
   <NewTask/>
  )
}
