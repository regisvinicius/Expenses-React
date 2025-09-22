import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import '../styles/shared.css';

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
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
              <h1 className="page-title">ℹ️ About ExpenseTracker</h1>
              <p className="page-description">
                A modern, beautiful expense tracking application built with React, TanStack Router, and Bun.
              </p>
            </div>
            
            <div className="page-content">
              <div style={{ textAlign: 'left', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.3rem' }}>🌟 Features</h3>
                <ul style={{ marginBottom: '2rem' }}>
                  <li>💰 Track your daily expenses</li>
                  <li>📊 View expense analytics and totals</li>
                  <li>🎨 Beautiful glassmorphism UI design</li>
                  <li>📱 Fully responsive across all devices</li>
                  <li>⚡ Fast and modern with Bun runtime</li>
                </ul>
                
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.3rem' }}>🛠️ Built With</h3>
                <ul style={{ marginBottom: '2rem' }}>
                  <li>React 19 with TypeScript</li>
                  <li>TanStack Router for navigation</li>
                  <li>TanStack Query for data fetching</li>
                  <li>Hono for the backend API</li>
                  <li>Bun for fast development and runtime</li>
                  <li>Tailwind CSS for styling</li>
                </ul>
                
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Start managing your finances with style! 💫
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});