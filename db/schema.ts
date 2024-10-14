import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";


export const users = sqliteTable('users', {
    id: integer('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull()
});

export const customers = sqliteTable('customers', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    imageUrl: text('image_url').notNull()
});

export const invoices = sqliteTable('invoices', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'no action', onUpdate: 'no action' }),
    amount: integer('amount').notNull(),
    status: text('status', { enum: ["paid", "pending"] }).notNull(),
    date: text('date').notNull()
});

export const revenue = sqliteTable('revenue', {
    month: text('month').notNull().unique(),
    revenue: integer('revenue').notNull()
});

export type User = typeof users.$inferSelect // return type when queried
export type InsertUser = typeof users.$inferInsert // insert type