import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { Expense } from "../../api/routes/expenses";
import "./index.css";

async function getTotal() {
  const response = await api.expenses.total.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch total");
  }
  const data = await response.json();
  return data;
}

async function getExpenses() {
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  const data = await response.json();
  return data;
}

export function App() {
  const {
    isPending: isPendingExpenses,
    error: errorExpenses,
    data: dataExpenses,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(),
  });

  const {
    isPending: isPendingTotal,
    error: errorTotal,
    data: dataTotal,
  } = useQuery({
    queryKey: ["total"],
    queryFn: () => getTotal(),
  });

  if (isPendingExpenses || isPendingTotal) {
    return <div>Loading...</div>;
  }

  if (errorExpenses) {
    return <div>Error: {errorExpenses.message}</div>;
  }

  if (errorTotal) {
    return <div>Error: {errorTotal.message}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>💰 Expenses Dashboard</CardTitle>
          <CardDescription>
            Total Expenses:{" "}
            <span className="font-bold text-green-400">${dataTotal.total.toFixed(2)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">➕ Add New Expense</Button>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {dataExpenses?.expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No expenses yet. Add your first expense!
            </p>
          ) : (
            <div className="space-y-2">
              {dataExpenses?.expenses.map((expense: Expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between items-center p-3 bg-muted rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{expense.title}</h3>
                    <p className="text-sm text-muted-foreground">ID: {expense.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">${expense.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
