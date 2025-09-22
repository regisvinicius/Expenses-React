import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import './navbar.css';
import { AuthProvider, useAuth } from '../lib/auth';
import { LoginPrompt } from '../components/LoginPrompt';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="nav-icon">💰</span>
          <span className="nav-title">ExpenseTracker</span>
        </Link>
        <div className="nav-links">
          {isLoading ? (
            <span className="nav-link">Loading...</span>
          ) : user ? (
            <>
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
              <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="nav-link" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  👤 {user.name}
                </span>
                <button 
                  type="button" 
                  onClick={logout} 
                  className="nav-link" 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    border: '1px solid rgba(255, 255, 255, 0.3)', 
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function MainContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-content-wrapper">
          <div className="page-card">
            <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <main>
      <Outlet />
    </main>
  );
}

export const rootRoute = createRootRoute({
  component: () => {
    return (
      <AuthProvider>
        <Navbar />
        <MainContent />
        {/* <TanStackRouterDevtools /> */}
      </AuthProvider>
    );
  },
});