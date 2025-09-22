import { cors } from "hono/cors";
import { Hono } from "hono";
import { logger } from "hono/logger";
import expensesRoutes from "./routes/expenses";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:5731"],
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type"],
  }),
);

app.use("*", serveStatic({ root: "../web/dist" }));
app.use("*", serveStatic({ root: "../web/dist/index.html" }));

const apiRoutes = app.basePath("/api").route("/expenses", expensesRoutes);

export default app;
export type ApiRoutes = typeof apiRoutes;
