import AppLayout from '@/components/AppLayout';
import { mockInsights, mockTransactions } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, TrendingDown, Shield, PiggyBank, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const fmt = (n: number) => `$${n.toLocaleString()}`;

const Insights = () => {
  const data = mockInsights;

  const getDebtRating = () => {
    if (data.debtToIncomeRatio < 36) return { label: 'Healthy', color: 'text-success', icon: CheckCircle2 };
    if (data.debtToIncomeRatio < 50) return { label: 'Moderate', color: 'text-warning', icon: AlertTriangle };
    return { label: 'High Risk', color: 'text-destructive', icon: AlertTriangle };
  };

  const getEmergencyRating = () => {
    if (data.emergencyFundCoverage >= 6) return { label: 'Excellent', color: 'text-success' };
    if (data.emergencyFundCoverage >= 3) return { label: 'Adequate', color: 'text-warning' };
    return { label: 'Insufficient', color: 'text-destructive' };
  };

  const debt = getDebtRating();
  const emergency = getEmergencyRating();
  const DebtIcon = debt.icon;

  // Spending by category
  const catMap: Record<string, number> = {};
  mockTransactions.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const spendingData = Object.entries(catMap).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount);

  const metrics = [
    {
      title: 'Debt-to-Income Ratio',
      value: `${data.debtToIncomeRatio}%`,
      description: 'Total debt relative to annual income',
      rating: debt.label,
      ratingColor: debt.color,
      icon: TrendingDown,
      progress: Math.min(100, data.debtToIncomeRatio),
    },
    {
      title: 'Emergency Fund Coverage',
      value: `${data.emergencyFundCoverage} months`,
      description: 'How long your liquid assets cover expenses',
      rating: emergency.label,
      ratingColor: emergency.color,
      icon: Shield,
      progress: Math.min(100, (data.emergencyFundCoverage / 6) * 100),
    },
    {
      title: 'Savings Rate',
      value: `${data.savingsRate}%`,
      description: 'Percentage of income saved this month',
      rating: data.savingsRate >= 20 ? 'On Track' : 'Below Target',
      ratingColor: data.savingsRate >= 20 ? 'text-success' : 'text-warning',
      icon: PiggyBank,
      progress: Math.min(100, (data.savingsRate / 50) * 100),
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Insights</h1>
        <p className="text-sm text-muted-foreground">Deep analysis of your financial health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {metrics.map(m => (
          <div key={m.title} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <m.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{m.title}</span>
            </div>
            <p className="text-2xl font-display font-bold mb-1">{m.value}</p>
            <p className="text-xs text-muted-foreground mb-3">{m.description}</p>
            <Progress value={m.progress} className="h-2 mb-2" />
            <span className={`text-xs font-medium ${m.ratingColor}`}>{m.rating}</span>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-sm font-medium mb-4">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={spendingData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
            <XAxis type="number" fontSize={12} tickFormatter={v => `$${v}`} />
            <YAxis type="category" dataKey="name" fontSize={12} width={110} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Bar dataKey="amount" fill="hsl(210,80%,55%)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
};

export default Insights;
