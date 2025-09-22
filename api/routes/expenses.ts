import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const expenseBaseSchema = z.object({
  title: z.string().min(3),
  amount: z.number().min(1).positive(),
  id: z.number().int().positive(),
});

const expensePostSchema = expenseBaseSchema.omit({ id: true });

export type Expense = z.infer<typeof expenseBaseSchema>;

let fakeExpenses: Expense[] = [
  { id: 1, title: "Expense 1", amount: 100 },
  { id: 2, title: "Expense 2", amount: 200 },
  { id: 3, title: "Expense 3", amount: 300 },
];

const expensesRoutes = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .get("/total", (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0);
    console.log(total);
    return c.json({ total });
  })
  .get("/:id", zValidator("param", z.object({ id: z.number() })), (c) => {
    const { id } = c.req.valid("param");
    const expense = fakeExpenses.find((e) => e.id === Number(id));
    if (!expense) {
      return c.notFound();
    }
    return c.json({ expense });
  })
  .post("/", zValidator("json", expensePostSchema), (c) => {
    const expense = c.req.valid("json");
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
    return c.json({ expenses: fakeExpenses, message: "Expense created" });
  })
  .put("/:id", zValidator("json", expenseBaseSchema), (c) => {
    const expense = c.req.valid("json");
    const expenseDB = fakeExpenses.find((e) => e.id === Number(expense.id));
    if (!expenseDB) {
      return c.json({ message: "Expense not found" }, 404);
    }
    fakeExpenses.splice(fakeExpenses.indexOf(expenseDB), 1);
    fakeExpenses.push({ ...expenseDB, ...expense });
    fakeExpenses = fakeExpenses.map((e) =>
      e.id === Number(expense.id) ? { ...e, ...expense } : e,
    );

    return c.json({ expense, message: "Expense updated" });
  })
  .delete("/:id", zValidator("param", z.object({ id: z.number() })), (c) => {
    const { id } = c.req.valid("param");
    const expenseToDelete = fakeExpenses.find((e) => e.id !== Number(id));
    if (!expenseToDelete) {
      return c.notFound();
    }
    fakeExpenses.splice(fakeExpenses.indexOf(expenseToDelete), 1);
    return c.json({ expenses: fakeExpenses, message: "Expense deleted" });
  });

export default expensesRoutes;
