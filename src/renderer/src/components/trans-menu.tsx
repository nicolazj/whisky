import { Ellipsis } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './dropdown-menu'

export function TransMenu({ id }: { id: string }) {
  let deleteTrans = (id) => {
    window.api.deleteTransById(id)
  }
  let reTrans = (id) => {
    window.api.reTransById(id)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => reTrans(id)}>Re-transcribe</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={() => deleteTrans(id)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
