import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import { useQuery } from '@tanstack/react-query';
import { getInsights } from '@/services/insightService';
import { getAssets } from '@/services/assetService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from
  'recharts';

const CHART_COLORS = [
  'hsl(160, 60%, 38%)',
  'hsl(210, 80%, 55%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 60%, 55%)',
  'hsl(0, 72%, 51%)',
  'hsl(180, 50%, 45%)'];


const fmt = (n) => `$${n?.toLocaleString() || 0}`;

const Dashboard = () => {
  const { data: insightsData, isLoading: insightsLoading } = useQuery({ queryKey: ['insights'], queryFn: getInsights });
  const { data: assets = [], isLoading: assetsLoading } = useQuery({ queryKey: ['assets'], queryFn: getAssets });

  if (insightsLoading || assetsLoading) return <AppLayout><div className="p-8">Loading dashboard...</div></AppLayout>;

  const data = insightsData || { snapshots: [], savingsRate: 0, emergencyFundCoverage: 0, debtToIncomeRatio: 0, netWorth: 0, totalAssets: 0, totalLiabilities: 0, monthlyIncome: 0, monthlyExpense: 0 };

  const healthScore = Math.min(100, Math.round(
    (data.savingsRate > 20 ? 25 : data.savingsRate * 1.25) + (
      data.emergencyFundCoverage >= 6 ? 25 : data.emergencyFundCoverage / 6 * 25) + (
      data.debtToIncomeRatio < 36 ? 25 : Math.max(0, 25 - (data.debtToIncomeRatio - 36))) + (
      data.netWorth > 0 ? 25 : 0)
  ));

  const netWorthData = data.snapshots?.map((s) => ({
    name: `${s.month}/${s.year.toString().slice(2)}`,
    value: s.netWorth
  })) || [];

  // Income vs Expense
  const income = data.monthlyIncome || 0;
  const expense = data.monthlyExpense || 0;
  const cashflowData = [{ name: 'Income', value: income }, { name: 'Expense', value: expense }];

  // Asset allocation
  const allocationMap = {};
  assets.forEach((a) => { allocationMap[a.type] = (allocationMap[a.type] || 0) + a.value; });
  const allocationData = Object.entries(allocationMap).map(([name, value]) => ({ name, value }));

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your financial overview at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard title="Net Worth" value={fmt(data.netWorth)} icon="networth" trend="up" />
        <StatCard title="Total Assets" value={fmt(data.totalAssets)} icon="assets" trend="up" />
        <StatCard title="Total Liabilities" value={fmt(data.totalLiabilities)} icon="liabilities" trend="down" />
        <StatCard title="Monthly Cashflow" value={fmt(income - expense)} icon="cashflow" subtitle={`${fmt(income)} in · ${fmt(expense)} out`} />
        <StatCard title="Savings Rate" value={`${data.savingsRate}%`} icon="savings" trend="up" />
        <StatCard title="Financial Health" value={`${healthScore}/100`} icon="health" trend={healthScore > 70 ? 'up' : 'neutral'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Net Worth Trend */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-medium mb-4">Net Worth Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={netWorthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Line type="monotone" dataKey="value" stroke="hsl(160,60%,38%)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expense */}
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
          <h3 className="text-sm font-medium mb-4">Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {cashflowData.map((_, i) =>
                  <Cell key={i} fill={i === 0 ? 'hsl(160,60%,38%)' : 'hsl(0,72%,51%)'} />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-medium mb-4">Asset Allocation</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {allocationData.map((_, i) =>
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                )}
              </Pie>
              <Tooltip formatter={(v) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3">
            {allocationData.map((item, i) =>
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-sm capitalize">{item.name}</span>
                <span className="text-xs text-muted-foreground">{fmt(item.value)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>);

};

export default Dashboard;