import { useAuth } from '../lib/auth';

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
            <h1 className="page-title">🔐 Authentication Required</h1>
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
                🚀 Login with Kinde
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
                <li style={{ marginBottom: '0.5rem' }}>📊 View your expenses</li>
                <li style={{ marginBottom: '0.5rem' }}>➕ Create new expenses</li>
                <li style={{ marginBottom: '0.5rem' }}>📈 Track spending patterns</li>
                <li style={{ marginBottom: '0.5rem' }}>💾 Save your data securely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
