import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "./index.css";
import { useEffect, useState } from "react";
import { Expense } from "../../api/routes/expenses";

export function App() {
  const [total, setTotal] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/expenses");
        const data = await response.json();
        
       setExpenses(data.expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/expenses/total");
        const data = await response.json();
        
        if (data.total !== undefined) {
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchTotalData();
  }, [expenses]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            💰 Expenses Dashboard
          </CardTitle>
          <CardDescription>
            Total Expenses: <span className="font-bold text-green-400">${total.toFixed(2)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            ➕ Add New Expense
          </Button>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses yet. Add your first expense!</p>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense: any) => (
                <div key={expense.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
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
