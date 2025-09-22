import { pgTable, serial, text, decimal, date, timestamp } from "drizzle-orm/pg-core";


import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, );

export const expenseInsertSchema = createInsertSchema(expenses);
export const expenseSelectSchema = createSelectSchema(expenses);

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
