import { jsonb, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

// declaring enum in database
export const licenseEnum = pgEnum('license', ['free', 'premium'])
export const apiStatusEnum = pgEnum('status', ['active', 'inactive'])

export type Share = typeof share.$inferSelect

export const share = pgTable('share', {
  id: varchar('id').primaryKey(),
  deleteId: varchar('delete_id').notNull(),
  model: varchar('model').notNull(),
  name: varchar('name'),
  list: jsonb('list'),
  createAt: timestamp('create_at').notNull().defaultNow(),
})
