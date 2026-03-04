import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { mockGoals } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, Target, Pencil } from 'lucide-react';

const fmt = (n: number) => `$${n.toLocaleString()}`;

const Goals = () => {
  const [goals, setGoals] = useState(mockGoals);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', targetAmount: '', currentAmount: '', deadline: '' });

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', targetAmount: '', currentAmount: '', deadline: '' });
    setDialogOpen(true);
  };

  const openEdit = (g: typeof goals[0]) => {
    setEditId(g._id);
    setForm({ title: g.title, targetAmount: String(g.targetAmount), currentAmount: String(g.currentAmount), deadline: g.deadline });
    setDialogOpen(true);
  };

  const saveGoal = () => {
    if (!form.title || !form.targetAmount || !form.deadline) return;
    const goalData = {
      title: form.title,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount) || 0,
      deadline: form.deadline,
    };
    if (editId) {
      setGoals(goals.map(g => g._id === editId ? { ...g, ...goalData } : g));
    } else {
      setGoals([...goals, { _id: Date.now().toString(), ...goalData }]);
    }
    setDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Goals</h1>
        <p className="text-sm text-muted-foreground">Track progress towards your financial goals</p>
      </div>

      <div className="flex justify-end mb-6">
        <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" /> New Goal</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Goal' : 'Create Goal'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1" /></div>
            <div><Label>Target Amount ($)</Label><Input type="number" value={form.targetAmount} onChange={e => setForm({...form, targetAmount: e.target.value})} className="mt-1" /></div>
            <div><Label>Current Amount ($)</Label><Input type="number" value={form.currentAmount} onChange={e => setForm({...form, currentAmount: e.target.value})} className="mt-1" /></div>
            <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="mt-1" /></div>
            <Button onClick={saveGoal} className="w-full">{editId ? 'Update Goal' : 'Create Goal'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
          const daysLeft = Math.max(0, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / 86400000));
          return (
            <div key={g._id} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10"><Target className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className="font-medium">{g.title}</p>
                    <p className="text-xs text-muted-foreground">{daysLeft} days remaining</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(g)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setGoals(goals.filter(x => x._id !== g._id))} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-sm text-muted-foreground">{fmt(g.currentAmount)} of {fmt(g.targetAmount)}</span>
                <span className="text-sm font-display font-semibold">{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Goals;
