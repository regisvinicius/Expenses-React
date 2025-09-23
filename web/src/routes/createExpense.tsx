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
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const createExpenseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-expense',
  validateSearch: (search: Record<string, unknown>): EditExpenseSearchParams => {
    const result = editExpenseSearchSchema.safeParse({
      edit: search.edit === 'true' || search.edit === true,
      id: search.id ? Number(search.id) : undefined,
      title: search.title as string | undefined,
      amount: search.amount ? (typeof search.amount === 'string' ? parseFloat(search.amount) : Number(search.amount)) : undefined,
      date: search.date as string | undefined,
    });
    
    if (result.success) {
      return result.data;
    } else {
      return {
        edit: false,
        id: undefined,
        title: undefined,
        amount: undefined,
        date: undefined,
      };
    }
  },
  component: CreateExpense
});

function CreateExpense() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/create-expense' });
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
        message: `✅ Expense ${action} successfully!`,
        show: true,
        timestamp: Date.now()
      });
      
      // Auto-hide success banner and navigate after 3 seconds
      setTimeout(() => {
        queryClient.setQueryData(['success-message'], {
          message: '',
          show: false,
          timestamp: Date.now()
        });
        navigate({ to: '/expenses' });
      }, 3000);
    },
    onError: (error: Error) => {
      const action = isEditMode ? 'update' : 'create';
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
      try {
        // Validate the form data before submission
        const validatedData = expenseCreateSchema.parse(value);
        expenseMutation.mutate(validatedData);
      } catch (error: any) {
        if (error.errors && error.errors.length > 0) {
          console.error('Validation error:', error.errors[0].message);
        } else {
          console.error('Unexpected error:', error);
        }
      }
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
          {successMessage.message}
        </div>
      )}

      {/* Error Banner */}
      {errorMessage?.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
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
          {errorMessage.message}
        </div>
      )}

      {/* Cancel Confirmation Banner */}
      {showCancelConfirm && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideInDown 0.3s ease-out',
          maxWidth: '90vw',
          textAlign: 'center'
        }}>
          <span>⚠️ You have unsaved changes. Are you sure you want to leave?</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="sm"
              onClick={confirmCancel}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X style={{ width: '12px', height: '12px', marginRight: '4px' }} />
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
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Save style={{ width: '12px', height: '12px', marginRight: '4px' }} />
              Stay
            </Button>
          </div>
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
            <h1 className="page-title">
              {isEditMode ? '✏️ Edit Expense' : '➕ Add New Expense'}
            </h1>
            <p className="page-description">
              {isEditMode ? 'Update your expense details' : 'Fill in the details below to add a new expense'}
            </p>
          </div>
          
          <div className="page-content">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Title Field */}
                <form.Field
                  name="title"
                  validators={{
                    onChange: ({ value }) => !value ? 'Title is required' : undefined,
                  }}
                >
                  {(field) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor={field.name} style={{ color: 'white', fontWeight: '600' }}>
                        Title
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.2s ease'
                        }}
                        placeholder="Enter expense title..."
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span style={{ color: '#ef4444', fontSize: '14px' }}>
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Amount Field */}
                <form.Field
                  name="amount"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || value <= 0) return 'Amount must be greater than 0';
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor={field.name} style={{ color: 'white', fontWeight: '600' }}>
                        Amount
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.state.value || ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '16px',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.2s ease'
                        }}
                        placeholder="Enter amount..."
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span style={{ color: '#ef4444', fontSize: '14px' }}>
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Date Field */}
                <form.Field
                  name="date"
                  validators={{
                    onChange: ({ value }) => !value ? 'Date is required' : undefined,
                  }}
                >
                  {(field) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor={field.name} style={{ color: 'white', fontWeight: '600' }}>
                        Date
                      </label>
                      <Calendar
                        mode="single"
                        selected={field.state.value ? new Date(field.state.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            field.handleChange(date.toISOString().split('T')[0]);
                          }
                        }}
                        className="rounded-md border"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white'
                        }}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span style={{ color: '#ef4444', fontSize: '14px' }}>
                          {field.state.meta.errors[0]}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>

                {/* Submit Button */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={expenseMutation.isPending}
                  >
                    {expenseMutation.isPending ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Save style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                        Saving...
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Save style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                        {isEditMode ? 'Update Expense' : 'Save Expense'}
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancel}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <X style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Cancel
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}