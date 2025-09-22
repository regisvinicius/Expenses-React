import { Hono } from "hono";

const testRoutes = new Hono()
  .get("/", (c) => {
    return c.json({ message: "Test route working!", timestamp: new Date().toISOString() });
  })
  .get("/auth-check", (c) => {
    const authHeader = c.req.header("Authorization");
    return c.json({ 
      message: "Auth check", 
      hasAuthHeader: !!authHeader,
      authHeader: authHeader ? authHeader.substring(0, 20) + "..." : "none"
    });
  });

export default testRoutes;
