import { zValidator } from "@hono/zod-validator";
import { Hono, MiddlewareHandler } from "hono";
import { z } from "zod";
import { eq, sum, and } from "drizzle-orm";
import db from "../db";
import { expenses as expensesTable, expenseInsertSchema ,expenseSelectSchema } from "../db/schema";
import { expenseBaseSchema, expenseCreateSchema, type Expense } from "../../shared/schemas/expense";

// Define the user type and extend Hono's context
interface User {
  id: string;
  email: string;
  name: string;
}

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
}

// Using shared schemas from ../shared/schemas/expense.ts

// Authentication middleware using Hono's built-in approach
const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Authorization header missing or invalid" }, 401);
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    // Decode the JWT token to get user information
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return c.json({ message: "Invalid token format" }, 401);
    }

    // Decode the payload (middle part of JWT)
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Verify token is not expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return c.json({ message: "Token expired" }, 401);
    }

    // Extract user information from the payload
    const user = {
      id: payload.sub || payload.id,
      email: payload.email,
      name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim() || payload.email
    };

    if (!user.id) {
      return c.json({ message: "User ID not found in token" }, 401);
    }

    // Set user in context for use in route handlers
    c.set("user", user);
    await next();
  } catch (error) {
    return c.json({ message: "Invalid or expired token" }, 401);
  }
};

const expensesRoutes = new Hono()
  .use("*", authMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");
    const userExpenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id));
    return c.json({ expenses: userExpenses });
  })
  .get("/total", async (c) => {
    const user = c.get("user");
    const result = await db.select({ total: sum(expensesTable.amount) }).from(expensesTable).where(eq(expensesTable.userId, user.id));
    const total = parseFloat(result[0]?.total || "0");
    return c.json({ total });
  })
  .get("/:id", zValidator("param", z.object({ id: z.string().transform(Number) })), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");
    
    const expense = await db.select().from(expensesTable).where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)));
    if (!expense[0]) {
      return c.notFound();
    }
    return c.json({ expense: expense[0] });
  })
    .post("/", zValidator("json", expenseCreateSchema), async (c) => {
    const user = c.get("user");
    const expense = c.req.valid("json");
    const validatedExpense = expenseInsertSchema.parse({
      title: expense.title,
      amount: expense.amount.toString(),
      date: expense.date || new Date().toISOString().split('T')[0],
      userId: user.id,
    });
    const newExpense = await db.insert(expensesTable).values(validatedExpense).returning();
    return c.json({ expense: newExpense[0], message: "Expense created" });
  })
    .put("/:id", zValidator("param", z.object({ id: z.string().transform(Number) })), zValidator("json", expenseCreateSchema), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");
    const expenseData = c.req.valid("json");
    const validatedExpense = expenseInsertSchema.parse({
      title: expenseData.title,
      amount: expenseData.amount.toString(),
      date: expenseData.date || new Date().toISOString().split('T')[0],
      userId: user.id,
    });
    const updatedExpense = await db.update(expensesTable)
      .set({
        title: validatedExpense.title,
        amount: validatedExpense.amount.toString(),
        date: validatedExpense.date || new Date().toISOString().split('T')[0],
        updatedAt: new Date(),
      })
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .returning();

    if (!updatedExpense[0]) {
      return c.json({ message: "Expense not found" }, 404);
    }

    return c.json({ expense: updatedExpense[0], message: "Expense updated" });
  })
  .delete("/:id", zValidator("param", z.object({ id: z.string().transform(Number) })), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user");
    
    const deletedExpense = await db.delete(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .returning();

    if (!deletedExpense[0]) {
      return c.notFound();
    }

    const userExpenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id));
    return c.json({ expenses: userExpenses, message: "Expense deleted" });
  });

export default expensesRoutes;
