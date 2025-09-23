import { useAuth } from '../lib/auth';
import { Lock, LogIn, BarChart3, Plus, TrendingUp, Save } from 'lucide-react';

export function LoginPrompt() {
  const { login } = useAuth();

  return (
    <div className="page-container">
      <div className="page-background"></div>
      <div className="page-background-shapes"></div>
      
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      <div className="page-content-wrapper">
        <div className="page-card">
          <div className="page-header">
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Lock style={{ width: '2rem', height: '2rem' }} />
              Authentication Required
            </h1>
            <p className="page-description">
              Please log in to access the expense tracker
            </p>
          </div>
          
          <div className="page-content" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                You need to be logged in to create and manage your expenses.
              </p>
              <button 
                type="button" 
                onClick={login}
                className="primary-button"
                style={{ 
                  fontSize: '1.2rem', 
                  padding: '1rem 2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogIn style={{ width: '1.2rem', height: '1.2rem' }} />
                Login
              </button>
            </div>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '1.5rem', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>Features Available After Login:</h3>
              <ul style={{ color: 'white', textAlign: 'left', listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 style={{ width: '1rem', height: '1rem' }} />
                  View your expenses
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus style={{ width: '1rem', height: '1rem' }} />
                  Create new expenses
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp style={{ width: '1rem', height: '1rem' }} />
                  Track spending patterns
                </li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save style={{ width: '1rem', height: '1rem' }} />
                  Save your data securely
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
