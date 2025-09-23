import { createRoute, useNavigate } from '@tanstack/react-router';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { rootRoute } from './__root';
import { DollarSign, Plus, BarChart3 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import './index.css';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

async function getTotal() {
  return api.getExpensesTotal();
}

export function Index() {
  const navigate = useNavigate();

  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: dataTotal,
  } = useQuery({
    queryKey: ["total"],
    queryFn: () => getTotal(),
  });

  if (isPendingTotal) {
    return <div>Loading...</div>;
  }


  if (errorTotal) {
    return <div>Error: {errorTotal.message}</div>;
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
                onClick={() => navigate({ to: '/create-expense' })}
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Plus style={{ width: '1rem', height: '1rem' }} />
                Add New Expense
              </Button>
              <Button 
                onClick={() => navigate({ to: '/expenses' })}
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
}