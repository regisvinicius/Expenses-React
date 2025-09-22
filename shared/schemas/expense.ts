import { z } from 'zod';

export const expenseBaseSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  amount: z.number().min(1, { message: 'Amount must be at least 1' }).positive({ message: 'Amount must be positive' }),
  date: z.string({ message: 'must be a valid date' }),
  id: z.number().int().positive(),
  userId: z.string(),
});

export const expenseCreateSchema = expenseBaseSchema.omit({ id: true, userId: true });

export const expenseUpdateSchema = expenseBaseSchema.omit({ id: true, userId: true });

export type Expense = z.infer<typeof expenseBaseSchema>;
export type CreateExpense = z.infer<typeof expenseCreateSchema>;
export type UpdateExpense = z.infer<typeof expenseUpdateSchema>;
