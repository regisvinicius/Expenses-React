import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import '../styles/shared.css';

export const createExpenseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-expense',
  component: () => {
    return (
      <div className="page-container">
        {/* Background effects */}
        <div className="page-background"></div>
        <div className="page-background-shapes"></div>
        
        {/* Floating particles */}
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
              <h1 className="page-title">➕ Create New Expense</h1>
              <p className="page-description">
                Add a new expense to track your spending
              </p>
            </div>
            
            <div className="page-content">
              <form style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600' 
                  }}>
                    Expense Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Grocery Shopping"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ 
                    display: 'block', 
                    color: 'white', 
                    marginBottom: '0.5rem', 
                    fontWeight: '600' 
                  }}>
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button type="submit" className="primary-button">
                    💾 Save Expense
                  </button>
                  <button type="button" className="primary-button" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  },
});