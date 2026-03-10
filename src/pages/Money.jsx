import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction, deleteTransaction } from '@/services/transactionService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const fmt = (n) => `$${n?.toLocaleString() || 0}`;
const categories = ['Salary', 'Freelance', 'Investment', 'Rent', 'Groceries', 'Utilities', 'Dining Out', 'Transportation', 'Entertainment', 'Insurance', 'Shopping', 'Healthcare', 'Other'];

const Money = () => {
  const queryClient = useQueryClient();
  const { data: transactions = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: getTransactions });

  const createTransactionMutation = useMutation({ mutationFn: createTransaction, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }) });
  const deleteTransactionMutation = useMutation({ mutationFn: deleteTransaction, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }) });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ type: 'income', category: 'Salary', amount: '', date: new Date().toISOString().slice(0, 10), recurring: false });

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = income > 0 ? ((income - expense) / income * 100).toFixed(1) : '0';

  const addTransaction = () => {
    if (!form.amount) return;
    createTransactionMutation.mutate({
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      recurring: form.recurring
    });
    setForm({ type: 'income', category: 'Salary', amount: '', date: new Date().toISOString().slice(0, 10), recurring: false });
    setDialogOpen(false);
  };

  if (isLoading) return <AppLayout><div className="p-8">Loading transactions...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Money</h1>
        <p className="text-sm text-muted-foreground">Track your income and expenses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-2xl font-display font-bold text-success">{fmt(income)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-display font-bold text-destructive">{fmt(expense)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Savings Rate</p>
          <p className="text-2xl font-display font-bold">{savingsRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold">Transactions</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div><Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Amount ($)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="mt-1" /></div>
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1" /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="recurring" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} className="rounded" />
                <Label htmlFor="recurring">Recurring</Label>
              </div>
              <Button onClick={addTransaction} className="w-full">Add Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {transactions.map((t) =>
            <div key={t._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors">
              <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {t.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-success" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{t.category}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              {t.recurring && <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />}
              <p className={`font-display font-semibold ${t.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </p>
              <button onClick={() => deleteTransactionMutation.mutate(t._id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>);

};

export default Money;