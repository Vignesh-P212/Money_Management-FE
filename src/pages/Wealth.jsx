import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssets, createAsset, deleteAsset } from '@/services/assetService';
import { getLiabilities, createLiability, deleteLiability } from '@/services/liabilityService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Building2, Banknote, BarChart3, Bitcoin, Gem, Wallet, CreditCard, Car, CircleDollarSign } from 'lucide-react';

const assetIcons = { cash: Wallet, bank: Banknote, stock: BarChart3, realestate: Building2, crypto: Bitcoin, gold: Gem };
const liabilityIcons = { loan: CircleDollarSign, creditcard: CreditCard, emi: Car };
const fmt = (n) => `$${n?.toLocaleString() || 0}`;

const Wealth = () => {
  const queryClient = useQueryClient();
  const { data: assets = [], isLoading: assetsLoading } = useQuery({ queryKey: ['assets'], queryFn: getAssets });
  const { data: liabilities = [], isLoading: liabilitiesLoading } = useQuery({ queryKey: ['liabilities'], queryFn: getLiabilities });

  const createAssetMutation = useMutation({ mutationFn: createAsset, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }) });
  const deleteAssetMutation = useMutation({ mutationFn: deleteAsset, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] }) });
  const createLiabilityMutation = useMutation({ mutationFn: createLiability, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }) });
  const deleteLiabilityMutation = useMutation({ mutationFn: deleteLiability, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['liabilities'] }) });

  const [assetOpen, setAssetOpen] = useState(false);
  const [liabilityOpen, setLiabilityOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({ name: '', type: 'bank', value: '' });
  const [newLiability, setNewLiability] = useState({ name: '', type: 'loan', amount: '', interestRate: '' });

  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);

  const addAsset = () => {
    if (!newAsset.name || !newAsset.value) return;
    createAssetMutation.mutate({ name: newAsset.name, type: newAsset.type, value: Number(newAsset.value) });
    setNewAsset({ name: '', type: 'bank', value: '' });
    setAssetOpen(false);
  };

  const addLiability = () => {
    if (!newLiability.name || !newLiability.amount) return;
    createLiabilityMutation.mutate({ name: newLiability.name, type: newLiability.type, amount: Number(newLiability.amount), interestRate: Number(newLiability.interestRate) || 0 });
    setNewLiability({ name: '', type: 'loan', amount: '', interestRate: '' });
    setLiabilityOpen(false);
  };

  if (assetsLoading || liabilitiesLoading) return <AppLayout><div className="p-8">Loading...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Wealth</h1>
        <p className="text-sm text-muted-foreground">Manage your assets and liabilities</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Assets</p>
          <p className="text-2xl font-display font-bold text-success">{fmt(totalAssets)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Total Liabilities</p>
          <p className="text-2xl font-display font-bold text-destructive">{fmt(totalLiabilities)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground">Net Worth</p>
          <p className="text-2xl font-display font-bold">{fmt(totalAssets - totalLiabilities)}</p>
        </div>
      </div>

      {/* Assets */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Assets</h2>
          <Dialog open={assetOpen} onOpenChange={setAssetOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Asset</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Asset</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Name</Label><Input value={newAsset.name} onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })} className="mt-1" /></div>
                <div><Label>Type</Label>
                  <Select value={newAsset.type} onValueChange={(v) => setNewAsset({ ...newAsset, type: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{['cash', 'bank', 'stock', 'realestate', 'crypto', 'gold'].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Value ($)</Label><Input type="number" value={newAsset.value} onChange={(e) => setNewAsset({ ...newAsset, value: e.target.value })} className="mt-1" /></div>
                <Button onClick={addAsset} className="w-full">Add Asset</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {assets.map((a) => {
            const Icon = assetIcons[a.type] || Wallet;
            return (
              <div key={a._id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-success/10"><Icon className="w-4 h-4 text-success" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{a.type}</p>
                </div>
                <p className="font-display font-semibold">{fmt(a.value)}</p>
                <button onClick={() => deleteAssetMutation.mutate(a._id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>);

          })}
        </div>
      </div>

      {/* Liabilities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold">Liabilities</h2>
          <Dialog open={liabilityOpen} onOpenChange={setLiabilityOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add Liability</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Liability</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div><Label>Name</Label><Input value={newLiability.name} onChange={(e) => setNewLiability({ ...newLiability, name: e.target.value })} className="mt-1" /></div>
                <div><Label>Type</Label>
                  <Select value={newLiability.type} onValueChange={(v) => setNewLiability({ ...newLiability, type: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{['loan', 'creditcard', 'emi'].map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Amount ($)</Label><Input type="number" value={newLiability.amount} onChange={(e) => setNewLiability({ ...newLiability, amount: e.target.value })} className="mt-1" /></div>
                <div><Label>Interest Rate (%)</Label><Input type="number" value={newLiability.interestRate} onChange={(e) => setNewLiability({ ...newLiability, interestRate: e.target.value })} className="mt-1" /></div>
                <Button onClick={addLiability} className="w-full">Add Liability</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {liabilities.map((l) => {
            const Icon = liabilityIcons[l.type] || CreditCard;
            return (
              <div key={l._id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-destructive/10"><Icon className="w-4 h-4 text-destructive" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{l.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{l.type} · {l.interestRate}% APR</p>
                </div>
                <p className="font-display font-semibold text-destructive">{fmt(l.amount)}</p>
                <button onClick={() => deleteLiabilityMutation.mutate(l._id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>);

          })}
        </div>
      </div>
    </AppLayout>);

};

export default Wealth;