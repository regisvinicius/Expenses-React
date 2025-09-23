import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { rootRoute } from './__root';
import { DollarSign, Plus, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import React, { useMemo, useCallback } from 'react';
import './index.css';

async function getTotal() {
  return api.getExpensesTotal();
}

const Index = React.memo(function Index() {
  const navigate = useNavigate();

  // Memoize navigation handlers to prevent re-renders
  const handleCreateExpense = useCallback(() => {
    navigate({ to: '/create-expense' });
  }, [navigate]);

  const handleViewExpenses = useCallback(() => {
    navigate({ to: '/expenses' });
  }, [navigate]);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: dataTotal,
  } = useQuery({
    queryKey: ["total"],
    queryFn: () => getTotal(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  if (isPendingTotal) {
    return (
      <div className="index-container">
        <div className="content-wrapper">
          <Card className="expense-card">
            <CardContent style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
              <p className="text-white text-lg">Loading expenses...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }


  if (errorTotal) {
    return (
      <div className="index-container">
        <div className="content-wrapper">
          <Card className="expense-card">
            <CardContent style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-400" />
              <p className="text-white text-lg mb-2">Failed to load expenses</p>
              <p className="text-white/70 text-sm">{errorTotal.message}</p>
              <Button 
                onClick={handleRetry} 
                className="btn-primary mt-4"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem auto 0 auto' }}
              >
                <Plus style={{ width: '1rem', height: '1rem' }} />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="index-container">
      {/* Floating particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      
      <div className="content-wrapper">
        <Card className="expense-card">
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign style={{ width: '1.5rem', height: '1.5rem' }} />
              Expenses Dashboard
            </CardTitle>
            <CardDescription style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 style={{ width: '1rem', height: '1rem' }} />
              Total Expenses:{" "}
              <span className="total-amount">${dataTotal.total.toFixed(2)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <Button 
                onClick={handleCreateExpense}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus style={{ width: '1rem', height: '1rem' }} />
                Add New Expense
              </Button>
              <Button 
                onClick={handleViewExpenses}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <BarChart3 style={{ width: '1rem', height: '1rem' }} />
                View All Expenses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export { Index };

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});