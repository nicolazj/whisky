import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createId } from './createId'
import { sql } from 'drizzle-orm'

export const transcrptions = sqliteTable('transcrptions', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => `t_${createId()}`),
  path: text('path').notNull(),
  name: text('name'),
  type: text('type'),
  status: text('status').default('init'),
  createdAt: text('timestamp')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export type TranscriptionSelectType = typeof transcrptions.$inferSelect
