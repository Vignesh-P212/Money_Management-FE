import { DollarSign, TrendingUp, TrendingDown, Activity, Wallet, PiggyBank } from 'lucide-react';









const iconMap = {
  networth: DollarSign,
  assets: TrendingUp,
  liabilities: TrendingDown,
  cashflow: Activity,
  savings: PiggyBank,
  health: Wallet
};

const colorMap = {
  networth: 'text-primary',
  assets: 'text-success',
  liabilities: 'text-destructive',
  cashflow: 'text-info',
  savings: 'text-warning',
  health: 'text-primary'
};

const bgMap = {
  networth: 'bg-primary/10',
  assets: 'bg-success/10',
  liabilities: 'bg-destructive/10',
  cashflow: 'bg-info/10',
  savings: 'bg-warning/10',
  health: 'bg-primary/10'
};

const StatCard = ({ title, value, subtitle, icon, trend }) => {
  const Icon = iconMap[icon];

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${bgMap[icon]}`}>
          <Icon className={`w-4 h-4 ${colorMap[icon]}`} />
        </div>
        {trend &&
        <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        }
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>);

};

export default StatCard;