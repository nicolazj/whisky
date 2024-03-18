import { sqliteTable, text ,integer } from 'drizzle-orm/sqlite-core'
import { createId } from './createId'
import { sql } from 'drizzle-orm'

export const tasks = sqliteTable('tasks', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$default(() => `t_${createId()}`),
  path: text('path').notNull(),
  name: text('name'),
  type: text('type'),
  size: integer('type'),
  status: text('status').default('init'),
  createdAt: text('timestamp')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
})

export type TaskSelectType = typeof tasks.$inferSelect;