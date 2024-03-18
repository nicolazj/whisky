import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { getDB } from './db'
import path from 'path'
// This will run migrations on the database, skipping the ones already applied

export const runMigration = async () => {
  const { db, connection } = getDB()
  await migrate(db, { migrationsFolder: path.resolve(__dirname,'./migrations') })
  // Don't forget to close the connection, otherwise the script will hang

}
