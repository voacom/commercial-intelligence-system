import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').default('member'),
  companyId: uuid('company_id'),
  createdAt: timestamp('created_at').defaultNow(),
  passwordHash: text('password_hash').notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
