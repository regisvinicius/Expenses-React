import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import './navbar.css';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


export const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <span className="nav-icon">💰</span>
              <span className="nav-title">ExpenseTracker</span>
            </div>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                <span className="nav-link-icon">🏠</span>
                Home
              </Link>
              <Link to="/about" className="nav-link">
                <span className="nav-link-icon">ℹ️</span>
                About
              </Link>
              <Link to="/expenses" className="nav-link">
                <span className="nav-link-icon">📊</span>
                Expenses
              </Link>
              <Link to="/create-expense" className="nav-link">
                <span className="nav-link-icon">➕</span>
                Add Expense
              </Link>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
        {/* <TanStackRouterDevtools /> */}
      </>
    );
  },
});