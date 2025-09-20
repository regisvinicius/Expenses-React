import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import expensesRoutes from "./routes/expenses";

const app = new Hono();

app.use(logger());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ["Content-Type"],
}));

app.get("/", (c) => c.json({ message: "Hono!" }));

app.route("/api/expenses", expensesRoutes);

export default app;
