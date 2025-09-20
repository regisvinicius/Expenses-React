import app from "./app";

const port = process.env.PORT || 3000;

Bun.serve({
  port,
  fetch: (req) => {
    return app.fetch(req);
  },
});

console.log(`Server is running on http://localhost:${port}`);
