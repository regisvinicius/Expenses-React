import { createRoute } from '@tanstack/react-router';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { rootRoute } from './__root';
import './index.css';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
});

async function getTotal() {
  const response = await api.expenses.total.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch total");
  }
  const data = await response.json();
  return data;
}

export function Index() {

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
            <CardTitle>💰 Expenses Dashboard</CardTitle>
            <CardDescription>
              Total Expenses:{" "}
              <span className="total-amount">${dataTotal.total.toFixed(2)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="add-button w-full">➕ Add New Expense</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}