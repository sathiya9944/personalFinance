import { calculateBalance, getSpendingTrend, getCategoryBreakdown } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchTransactions() {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return empty array during build or when API is unavailable
    return [];
  }
}

async function fetchBudgets(month?: number, year?: number) {
  try {
    const params = month && year ? `?month=${month}&year=${year}` : '';
    const response = await fetch(`${API_URL}/budgets${params}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) throw new Error('Failed to fetch budgets');
    return response.json();
  } catch (error) {
    console.error('Error fetching budgets:', error);
    // Return empty array during build or when API is unavailable
    return [];
  }
}

export async function getDashboardData() {
  const transactions = await fetchTransactions();

  const totalIncome = transactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  return {
    transactions,
    balance: calculateBalance(transactions),
    income: totalIncome,
    expenses: totalExpenses,
    spendingTrend: getSpendingTrend(transactions),
    categoryBreakdown: getCategoryBreakdown(transactions),
  };
}

export async function getBudgetData(month: number, year: number) {
  const [budgets, transactions] = await Promise.all([
    fetchBudgets(month, year),
    fetchTransactions(),
  ]);

  return { budgets, transactions };
}

export { fetchTransactions, fetchBudgets };
