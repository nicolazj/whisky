import { drizzle } from 'drizzle-orm/better-sqlite3'
import { createRequire } from 'module'
import { setting } from '../settings'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

export const connection = new Database(setting.dbPath())
export const db = drizzle(connection)
