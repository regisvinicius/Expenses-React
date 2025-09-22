import { createRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { rootRoute } from './__root';
import '../styles/shared.css';

import { useForm } from '@tanstack/react-form';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { expenseCreateSchema } from '../../../shared/schemas/expense';
import { editExpenseSearchSchema, validEditSearchSchema, type EditExpenseSearchParams } from '../../../shared/schemas/search-params';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

export const createExpenseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-expense',
  validateSearch: (search: Record<string, unknown>): EditExpenseSearchParams => {
    // Validate and transform search parameters using Zod
    const result = editExpenseSearchSchema.safeParse({
      edit: search.edit === 'true' || search.edit === true,
      id: search.id ? Number(search.id) : undefined,
      title: search.title as string | undefined,
      amount: search.amount ? Number(search.amount) : undefined,
      date: search.date as string | undefined,
    });

    if (result.success) {
      return result.data;
    } else {
      // Return safe defaults if validation fails
      console.warn('Invalid search parameters:', result.error);
      return {};
    }
  },
  component: CreateExpense
});



function CreateExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/create-expense' });
  // Using TanStack Query for state management instead of useState
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  // Using TanStack Query for success/error message state
  const { data: successMessage } = useQuery({
    queryKey: ['success-message'],
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { data: errorMessage } = useQuery({
    queryKey: ['error-message'],
    queryFn: () => null,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  
  const editModeValidation = validEditSearchSchema.safeParse(search);
  const isEditMode = editModeValidation.success;
  const expenseId = isEditMode ? editModeValidation.data.id : undefined;
  
  useEffect(() => {
    if (search.edit && !isEditMode) {
      navigate({ to: '/expenses' });
    }
  }, [search.edit, isEditMode, navigate]);

  const handleCancel = () => {
    if (form.state.isDirty) {
      setShowCancelConfirm(true);
    } else {
      navigate({ to: '/expenses' });
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    navigate({ to: '/expenses' });
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };
  
  const expenseMutation = useMutation({
    mutationFn: (expenseData: any) => {
      if (isEditMode && expenseId) {
        return api.updateExpense(expenseId, expenseData);
      } else {
        return api.createExpense(expenseData);
      }
    },
    onSuccess: (result) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["total"] });
      
      // Set success data in query cache for UI to consume
      const action = isEditMode ? 'updated' : 'created';
      queryClient.setQueryData(['success-message'], {
        message: `✅ Expense ${action} successfully - ${result.expense.title} ($${result.expense.amount})`,
        show: true,
        timestamp: Date.now()
      });
      
      // Navigate after a delay
      setTimeout(() => {
        queryClient.setQueryData(['success-message'], { show: false });
        navigate({ to: '/expenses' });
      }, 3000);
    },
    onError: (error: Error) => {
      const action = isEditMode ? 'update' : 'create';
      // Set error in query cache
      queryClient.setQueryData(['error-message'], {
        message: `❌ Failed to ${action} expense: ${error.message}`,
        show: true,
        timestamp: Date.now()
      });
    },
  });
  
  const form = useForm({
    defaultValues: {
      title: isEditMode ? editModeValidation.data.title : '',
      amount: isEditMode ? (typeof editModeValidation.data.amount === 'string' ? parseFloat(editModeValidation.data.amount) : editModeValidation.data.amount) : 0,
      date: isEditMode ? editModeValidation.data.date : new Date().toISOString().split('T')[0],
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
      expenseMutation.mutate(value);
    },
  });

  return (
    <div className="page-container">
      {/* Success Banner */}
      {successMessage?.show && (
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
          {successMessage?.message}
        </div>
      )}

      {/* Cancel Confirmation Banner */}
      {showCancelConfirm && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(217, 119, 6, 0.3)',
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
            ⚠️
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
              You have unsaved changes!
            </p>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
              Are you sure you want to leave without saving?
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: '12px' }}>
            <Button
              size="sm"
              onClick={confirmCancel}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem'
              }}
            >
              Leave
            </Button>
            <Button
              size="sm"
              onClick={cancelCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem'
              }}
            >
              Stay
            </Button>
          </div>
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
            <h1 className="page-title">{isEditMode ? '✏️ Edit Expense' : '➕ Create New Expense'}</h1>
            <p className="page-description">
              {isEditMode ? 'Update your expense details' : 'Add a new expense to track your spending'}
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
                  disabled={expenseMutation.isPending}
                >
                  {expenseMutation.isPending ? '💾 Saving...' : (isEditMode ? '💾 Update Expense' : '💾 Save Expense')}
                </button>
                <button 
                  type="button" 
                  className="primary-button" 
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  onClick={handleCancel}
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