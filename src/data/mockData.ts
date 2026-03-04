// Mock data for demo when backend is not running
export const mockInsights = {
  totalAssets: 285000,
  totalLiabilities: 142000,
  netWorth: 143000,
  monthlyIncome: 8500,
  monthlyExpense: 5200,
  savingsRate: 38.82,
  debtToIncomeRatio: 139.22,
  emergencyFundCoverage: 4.2,
  snapshots: [
    { month: 7, year: 2025, netWorth: 118000, totalAssets: 250000, totalLiabilities: 132000, savingsRate: 32 },
    { month: 8, year: 2025, netWorth: 122000, totalAssets: 258000, totalLiabilities: 136000, savingsRate: 34 },
    { month: 9, year: 2025, netWorth: 126000, totalAssets: 262000, totalLiabilities: 136000, savingsRate: 33 },
    { month: 10, year: 2025, netWorth: 130000, totalAssets: 268000, totalLiabilities: 138000, savingsRate: 35 },
    { month: 11, year: 2025, netWorth: 135000, totalAssets: 275000, totalLiabilities: 140000, savingsRate: 36 },
    { month: 12, year: 2025, netWorth: 138000, totalAssets: 280000, totalLiabilities: 142000, savingsRate: 37 },
    { month: 1, year: 2026, netWorth: 140000, totalAssets: 282000, totalLiabilities: 142000, savingsRate: 37.5 },
    { month: 2, year: 2026, netWorth: 143000, totalAssets: 285000, totalLiabilities: 142000, savingsRate: 38.82 },
  ],
};

export const mockAssets = [
  { _id: '1', name: 'Savings Account', type: 'bank', value: 22000 },
  { _id: '2', name: 'Stock Portfolio', type: 'stock', value: 85000 },
  { _id: '3', name: 'Primary Residence', type: 'realestate', value: 150000 },
  { _id: '4', name: 'Bitcoin', type: 'crypto', value: 18000 },
  { _id: '5', name: 'Gold Coins', type: 'gold', value: 5000 },
  { _id: '6', name: 'Cash', type: 'cash', value: 5000 },
];

export const mockLiabilities = [
  { _id: '1', name: 'Mortgage', type: 'loan', amount: 120000, interestRate: 3.5 },
  { _id: '2', name: 'Car Loan', type: 'emi', amount: 15000, interestRate: 5.2 },
  { _id: '3', name: 'Credit Card', type: 'creditcard', amount: 7000, interestRate: 18.9 },
];

export const mockTransactions = [
  { _id: '1', type: 'income', category: 'Salary', amount: 7000, date: '2026-03-01', recurring: true },
  { _id: '2', type: 'income', category: 'Freelance', amount: 1500, date: '2026-03-05', recurring: false },
  { _id: '3', type: 'expense', category: 'Rent', amount: 1800, date: '2026-03-01', recurring: true },
  { _id: '4', type: 'expense', category: 'Groceries', amount: 600, date: '2026-03-03', recurring: false },
  { _id: '5', type: 'expense', category: 'Utilities', amount: 250, date: '2026-03-05', recurring: true },
  { _id: '6', type: 'expense', category: 'Dining Out', amount: 350, date: '2026-03-08', recurring: false },
  { _id: '7', type: 'expense', category: 'Transportation', amount: 200, date: '2026-03-10', recurring: false },
  { _id: '8', type: 'expense', category: 'Entertainment', amount: 150, date: '2026-03-12', recurring: false },
  { _id: '9', type: 'expense', category: 'Insurance', amount: 400, date: '2026-03-01', recurring: true },
  { _id: '10', type: 'expense', category: 'Shopping', amount: 450, date: '2026-03-15', recurring: false },
];

export const mockGoals = [
  { _id: '1', title: 'Emergency Fund', targetAmount: 30000, currentAmount: 22000, deadline: '2026-12-31' },
  { _id: '2', title: 'Vacation Fund', targetAmount: 5000, currentAmount: 2300, deadline: '2026-08-01' },
  { _id: '3', title: 'New Car', targetAmount: 35000, currentAmount: 8500, deadline: '2027-06-01' },
  { _id: '4', title: 'Investment Portfolio', targetAmount: 100000, currentAmount: 85000, deadline: '2027-12-31' },
];
