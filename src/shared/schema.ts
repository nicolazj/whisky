import { sqliteTable, text ,integer} from 'drizzle-orm/sqlite-core'
import { createId } from './createId'

export const transcrptions = sqliteTable('transcrptions', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => `t_${createId()}`),
  path: text('path').notNull(),
  name: text('name'),
  type: text('type'),
  status: text('status').default('init'),
  createdAt: integer('timestamp')
    .notNull()
    .$defaultFn(()=>Date.now())
})

export type TranscriptionSelectType = typeof transcrptions.$inferSelect
