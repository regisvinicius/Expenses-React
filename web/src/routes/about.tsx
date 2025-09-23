import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { Info, Star, DollarSign, BarChart3, Palette, Smartphone, Zap, Wrench, Sparkles } from 'lucide-react';
import React from 'react';
import '../styles/shared.css';

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: React.memo(function About() {
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
              <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Info style={{ width: '2rem', height: '2rem' }} />
                About ExpenseTracker
              </h1>
              <p className="page-description">
                A modern, beautiful expense tracking application built with React, TanStack Router, and Bun.
              </p>
            </div>
            
            <div className="page-content">
              <div style={{ textAlign: 'left', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star style={{ width: '1.3rem', height: '1.3rem' }} />
                  Features
                </h3>
                <ul style={{ marginBottom: '2rem', listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign style={{ width: '1rem', height: '1rem' }} />
                    Track your daily expenses
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 style={{ width: '1rem', height: '1rem' }} />
                    View expense analytics and totals
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Palette style={{ width: '1rem', height: '1rem' }} />
                    Beautiful glassmorphism UI design
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Smartphone style={{ width: '1rem', height: '1rem' }} />
                    Fully responsive across all devices
                  </li>
                  <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap style={{ width: '1rem', height: '1rem' }} />
                    Fast and modern with Bun runtime
                  </li>
                </ul>
                
                <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench style={{ width: '1.3rem', height: '1.3rem' }} />
                  Built With
                </h3>
                <ul style={{ marginBottom: '2rem', listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>React 19 with TypeScript</li>
                  <li style={{ marginBottom: '0.5rem' }}>TanStack Router for navigation</li>
                  <li style={{ marginBottom: '0.5rem' }}>TanStack Query for data fetching</li>
                  <li style={{ marginBottom: '0.5rem' }}>Hono for the backend API</li>
                  <li style={{ marginBottom: '0.5rem' }}>Bun for fast development and runtime</li>
                  <li style={{ marginBottom: '0.5rem' }}>Tailwind CSS for styling</li>
                </ul>
                
                <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Sparkles style={{ width: '1.1rem', height: '1.1rem' }} />
                  Start managing your finances with style!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }),
});