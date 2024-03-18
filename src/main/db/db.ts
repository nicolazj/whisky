import { drizzle } from 'drizzle-orm/better-sqlite3'
import { createRequire } from 'module'
import { DATABASE_NAME } from '../constants'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')

export const getDB = () => {
  const connection = new Database(DATABASE_NAME)
  const db = drizzle(connection)
  return {db,connection}
}
