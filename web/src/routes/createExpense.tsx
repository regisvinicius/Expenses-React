import { createRoute, useNavigate } from '@tanstack/react-router';
import { rootRoute } from './__root';
import '../styles/shared.css';

import { useForm } from '@tanstack/react-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/lib/api';
import { expenseCreateSchema } from '../../../shared/schemas/expense';
import { Calendar } from '@/components/ui/calendar';

export const createExpenseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-expense',
  component: CreateExpense
});



function CreateExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  
  const createExpenseMutation = useMutation({
    mutationFn: (expenseData: any) => api.createExpense(expenseData),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["total"] });
      
      setBannerMessage(`✅ ${result.message} - ${result.expense.title} ($${result.expense.amount})`);
      setShowBanner(true);
      
      setTimeout(() => {
        setShowBanner(false);
        navigate({ to: '/expenses' });
      }, 3000);
    },
    onError: (error: Error) => {
      alert(`❌ Failed to create expense: ${error.message}`);
    },
  });
  
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    },
    validators: {
      onChange: ({ value }) => {
        try {
          expenseCreateSchema.parse(value);
          return undefined;
        } catch (error: any) {
          if (error.errors && error.errors.length > 0) {
            return error.errors[0].message;
          }
          return 'Validation error';
        }
      },
    },
    onSubmit: async ({ value }) => {
      createExpenseMutation.mutate(value);
    },
  });

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
            <h1 className="page-title">➕ Create New Expense</h1>
            <p className="page-description">
              Add a new expense to track your spending
            </p>
          </div>
          
          <div className="page-content">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <form.Field
                  name="title"
                  validators={{
                    onChange: expenseCreateSchema.shape.title,
                  }}
                >
                  {(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}
                      >
                        Expense Title
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
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
                      {field.state.meta.errors ? (
                        <em style={{ color: 'red' }}>{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <form.Field
                  name="amount"
                  validators={{
                    onChange: expenseCreateSchema.shape.amount,
                  }}
                >
                  {(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}
                      >
                        Amount ($)
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
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
                      {field.state.meta.errors ? (
                        <em style={{ color: 'red' }}>{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <form.Field
                  name="date"
                  validators={{
                    onChange: expenseCreateSchema.shape.date,
                  }}
                >
                  {(field) => (
                    <>
                      <label
                        htmlFor={field.name}
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}
                      >
                        Date
                      </label>
                      <Calendar 
                        mode="single"
                        selected={field.state.value ? new Date(field.state.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            field.handleChange(`${year}-${month}-${day}`);
                          } else {
                            field.handleChange('');
                          }
                        }}
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl"
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      />
                      {field.state.meta.errors ? (
                        <em style={{ color: 'red' }}>{field.state.meta.errors.join(', ')}</em>
                      ) : null}
                    </>
                  )}
                </form.Field>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={createExpenseMutation.isPending}
                >
                  {createExpenseMutation.isPending ? '💾 Saving...' : '💾 Save Expense'}
                </button>
                <button 
                  type="button" 
                  className="primary-button" 
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={() => form.reset()}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}