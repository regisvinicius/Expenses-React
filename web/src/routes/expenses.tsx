import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Expense } from "../../../api/db/schema";
import '../styles/shared.css';

export const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/expenses',
  component: Expenses,
  },
);


async function getExpenses() {
  return api.getExpenses();
}

export function Expenses() {
  const {
    isPending: isPendingExpenses,
    error: errorExpenses,
    data: dataExpenses,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(),
  });


  if (isPendingExpenses) {
    return (
      <div className="page-container">
        <div className="page-background"></div>
        <div className="page-background-shapes"></div>
        <div className="page-content-wrapper">
          <div className="page-card">
            <div className="page-header">
              <h1 className="page-title">📊 Loading Expenses...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorExpenses) {
    return (
      <div className="page-container">
        <div className="page-background"></div>
        <div className="page-background-shapes"></div>
        <div className="page-content-wrapper">
          <div className="page-card">
            <div className="page-header">
              <h1 className="page-title">❌ Error</h1>
              <p className="page-description">Failed to load expenses: {errorExpenses.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="page-title">📊 Your Expenses</h1>
            <p className="page-description">
              Track and manage your daily expenses
            </p>
          </div>
          
          <div className="page-content">
            {dataExpenses?.expenses.length === 0 ? (
              <Card style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <CardContent style={{ padding: '2rem' }}>
                  <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>
                    No expenses yet. Add your first expense!
                  </p>
                  <Button className="primary-button">
                    ➕ Add First Expense
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {dataExpenses?.expenses.map((expense: Expense) => (
                  <Card
                    key={expense.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <CardContent style={{ padding: '1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <CardTitle style={{ 
                            color: 'white', 
                            fontSize: '1.2rem',
                            marginBottom: '0.5rem'
                          }}>
                            {expense.title}
                          </CardTitle>
                          <CardDescription style={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '0.25rem'
                          }}>
                            📅 {new Date(expense.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </CardDescription>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ 
                            fontWeight: '700', 
                            fontSize: '1.5rem',
                            margin: 0,
                            background: 'linear-gradient(45deg, #00ff88, #00d4ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}>
                            ${expense.amount}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}