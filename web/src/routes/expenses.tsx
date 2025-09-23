import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Expense } from "../../../api/db/schema";
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  const {
    isPending: isPendingExpenses,
    error: errorExpenses,
    data: dataExpenses,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(),
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: number) => api.deleteExpense(expenseId),
    onSuccess: (result) => {
      // Invalidate and refetch expenses and total
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["total"] });
      
      // Show success banner
      setBannerMessage(`✅ Expense deleted successfully`);
      setShowBanner(true);
      
      // Auto-hide banner after 3 seconds
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    },
    onError: (error: Error) => {
      alert(`❌ Failed to delete expense: ${error.message}`);
    },
  });

  const handleDeleteExpense = (expenseId: number, expenseTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${expenseTitle}"?`)) {
      deleteExpenseMutation.mutate(expenseId);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    // Navigate to edit page with expense data
    navigate({ 
      to: '/create-expense', 
      search: { 
        edit: true, 
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        date: expense.date
      }
    });
  };


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
      {/* Success Banner */}
      {showBanner && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideInDown 0.3s ease-out',
          maxWidth: '90vw',
          textAlign: 'center'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>
            ✅
          </div>
          {bannerMessage}
        </div>
      )}

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
                  <div key={expense.id} className="expense-card">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 className="expense-title">
                          {expense.title}
                        </h3>
                        <div className="expense-date">
                          📅 {new Date(expense.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div style={{ 
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.8rem',
                          marginTop: '0.25rem'
                        }}>
                          ID: {expense.id}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <p className="expense-amount">
                          ${expense.amount}
                        </p>
                        <div className="expense-actions">
                          <Button
                            className="action-button edit"
                            onClick={() => handleEditExpense(expense)}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            className="action-button delete"
                            onClick={() => handleDeleteExpense(expense.id, expense.title)}
                            disabled={deleteExpenseMutation.isPending}
                            style={{ display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}