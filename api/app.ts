import { Hono } from "hono";
import { logger } from "hono/logger";
import expensesRoutes from "./routes/expenses";

const app = new Hono();

app.use(logger());

app.get("/", (c) => c.json({ message: "Hono!" }));

app.route("/api/expenses", expensesRoutes);

export default app;
