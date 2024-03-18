import type { Config } from 'drizzle-kit';

export default {
  schema: './src/shared/schema.ts',
  out: './src/main/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'whisky_database.db',
  },
} satisfies Config;