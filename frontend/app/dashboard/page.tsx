import { Suspense } from 'react';
import { getDashboardData } from '../services/server';
import BalanceCards from '../components/BalanceCards';
import SpendingTrendChart from '../components/SpendingTrendChart';
import CategoryBreakdownChart from '../components/CategoryBreakdownChart';
import RecentTransactionsTable from '../components/RecentTransactionsTable';

function LoadingSpinner() {
    return (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    );
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Financial Dashboard
                </h1>

                {/* Balance Cards */}
                <BalanceCards
                    balance={data.balance}
                    income={data.income}
                    expenses={data.expenses}
                />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                    <SpendingTrendChart data={data.spendingTrend} />
                    <CategoryBreakdownChart data={data.categoryBreakdown} />
                </div>

                {/* Recent Transactions */}
                <Suspense fallback={<LoadingSpinner />}>
                    <RecentTransactionsTable
                        transactions={data.transactions.slice(0, 5)}
                    />
                </Suspense>
            </main>
        </div>
    );
}
