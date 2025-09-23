import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import './navbar.css';
import { AuthProvider, useAuth } from '../lib/auth';
import { LoginPrompt } from '../components/LoginPrompt';
import { DollarSign, Home, Info, BarChart3, Plus, User, LogOut, Loader2 } from 'lucide-react';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';


function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <DollarSign className="nav-icon" style={{ width: '2rem', height: '2rem' }} />
          <span className="nav-title">ExpenseTracker</span>
        </Link>
        <div className="nav-links">
                {isLoading ? (
                  <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 style={{ width: '1rem', height: '1rem' }} className="animate-spin" />
                    Loading...
                  </span>
                ) : user ? (
            <>
              <Link to="/" className="nav-link">
                <Home className="nav-link-icon" style={{ width: '1.1rem', height: '1.1rem' }} />
                Home
              </Link>
              <Link to="/about" className="nav-link">
                <Info className="nav-link-icon" style={{ width: '1.1rem', height: '1.1rem' }} />
                About
              </Link>
              <Link to="/expenses" className="nav-link">
                <BarChart3 className="nav-link-icon" style={{ width: '1.1rem', height: '1.1rem' }} />
                Expenses
              </Link>
              <Link to="/create-expense" className="nav-link">
                <Plus className="nav-link-icon" style={{ width: '1.1rem', height: '1.1rem', alignItems: 'center' }} />
                Add Expense
              </Link>
              <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="nav-link" style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User style={{ width: '1rem', height: '1rem' }} />
                  {user.name}
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
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
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
                  <LogOut style={{ width: '1rem', height: '1rem' }} />
                  Logout
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
              <Loader2 style={{ width: '2rem', height: '2rem', marginBottom: '1rem' }} className="animate-spin mx-auto" />
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