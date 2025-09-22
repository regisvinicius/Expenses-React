import { createRoute, useNavigate } from '@tanstack/react-router';
import { rootRoute } from './__root';
import '../styles/shared.css';

import { useForm } from '@tanstack/react-form';
import { api } from '@/lib/api';

export const createExpenseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-expense',
  component: CreateExpense
});



function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    },
    onSubmit: async ({ value }) => {
      const response = await api.expenses.$post({ json: value});
      if(!response.ok) {
        console.error('Failed to create expense');
        return;
      }
      navigate({ to: '/expenses' });
    },
  });

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
                    onChange: ({ value }) =>
                      !value ? 'Title is required' : undefined,
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
                    onChange: ({ value }) =>
                      !value || value <= 0 ? 'Amount must be greater than 0' : undefined,
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
                    onChange: ({ value }) =>
                      !value ? 'Date is required' : undefined,
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
                      <input
                        id={field.name}
                        name={field.name}
                        type="date"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
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
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting ? '💾 Saving...' : '💾 Save Expense'}
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