import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './routes/__root';

// Import route definitions
import { indexRoute } from './routes/index';
import { aboutRoute } from './routes/about';
import { expensesRoute } from './routes/expenses';
import { createExpenseRoute } from './routes/createExpense';

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  expensesRoute,
  createExpenseRoute,
]);

// Create the router
export const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
});
