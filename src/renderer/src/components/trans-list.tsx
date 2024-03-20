import { useFetchTasks } from '@renderer/query'
import { ScrollArea } from './scroll-area'
import { cn } from '@renderer/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { TransProgress } from './trans-progress'

export function TranscriptionList() {
  let { data: tasks = [] } = useFetchTasks()
  // tasks=[]
 
  return (
    <ScrollArea className=" ">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {tasks.map((item) => (
          <Link
            disabled={item.status !== 'done'}
            to={`/transcriptions/$id`}
            params={{
              id: item.id
            }}
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent '
            )}
          >
            <div className="flex w-full flex-col gap-1">
              <div className={cn('ml-auto text-xs text-accent')}>
                {formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true
                })}
              </div>
              <div className="font-semibold line-clamp-1">{item.name}</div>
              {/* <div className="text-xs font-medium line-clamp-1">{item.name}</div> */}
            </div>
            {
              item.status==='done'?<div className="line-clamp-1 text-xs text-muted-foreground ">
              {/* {item.path.substring(0, 300)} */}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium veritatis
              perferendis beatae obcaecati, ducimus ut. Provident commodi voluptatum dolores, ex
              facilis eum atque, alias cumque vel dicta odit similique magnam!
            </div>:<TransProgress id={item.id} />
            }
            
          </Link>
        ))}
      </div>
    </ScrollArea>
  )
}
