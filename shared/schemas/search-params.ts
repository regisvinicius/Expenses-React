import { z } from 'zod';

// Search parameters schema for edit mode
export const editExpenseSearchSchema = z.object({
  edit: z.boolean().optional(),
  id: z.number().int().positive().optional(),
  title: z.string().min(3).optional(),
  amount: z.union([z.number().min(1).positive(), z.string()]).optional(),
  date: z.string().optional(),
});

// Type inference
export type EditExpenseSearchParams = z.infer<typeof editExpenseSearchSchema>;

// Valid edit mode schema (requires all fields when editing)
export const validEditSearchSchema = editExpenseSearchSchema.extend({
  edit: z.literal(true),
  id: z.number().int().positive(),
  title: z.string().min(3),
  amount: z.union([z.number().min(1).positive(), z.string()]),
  date: z.string(),
});

export type ValidEditExpenseSearchParams = z.infer<typeof validEditSearchSchema>;
