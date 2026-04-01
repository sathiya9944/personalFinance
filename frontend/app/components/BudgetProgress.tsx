import { AlertCircle } from 'lucide-react';

interface BudgetProgressProps {
    budgets: any[];
    transactions: any[];
    month: number;
    year: number;
}

export default function BudgetProgress({
    budgets,
    transactions,
    month,
    year,
}: BudgetProgressProps) {
    const getCurrentMonthTransactions = (category: string) => {
        return transactions
            .filter((txn) => {
                const txnDate = new Date(txn.createdAt);
                return (
                    txn.type === 'expense' &&
                    txn.category === category &&
                    txnDate.getMonth() + 1 === month &&
                    txnDate.getFullYear() === year
                );
            })
            .reduce((sum, txn) => sum + txn.amount, 0);
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    if (!budgets || budgets.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📊 Budget Progress
                </h2>
                <div className="text-center py-12 text-gray-500">
                    No budgets set for this month. Create one to track your
                    spending!
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Budget Progress
            </h2>
            <div className="space-y-6">
                {budgets.map((budget) => {
                    if (!budget.limit || budget.limit <= 0) {
                        return null; // Skip invalid budgets
                    }
                    const spent = getCurrentMonthTransactions(budget.category);
                    const percentage = (spent / budget.limit) * 100;
                    const isOverBudget = spent > budget.limit;

                    return (
                        <div key={budget.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {budget.category}
                                </h3>
                                <div className="flex gap-4 text-right">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Spent
                                        </p>
                                        <p
                                            className={`text-lg font-bold ${
                                                isOverBudget
                                                    ? 'text-rose-600'
                                                    : 'text-gray-900'
                                            }`}
                                        >
                                            {formatAmount(spent)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Limit
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatAmount(budget.limit)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Remaining
                                        </p>
                                        <p
                                            className={`text-lg font-bold ${
                                                isOverBudget
                                                    ? 'text-rose-600'
                                                    : 'text-emerald-600'
                                            }`}
                                        >
                                            {formatAmount(
                                                Math.max(0, budget.limit - spent)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${
                                        percentage <= 75
                                            ? 'bg-emerald-500'
                                            : percentage <= 100
                                            ? 'bg-amber-500'
                                            : 'bg-rose-500'
                                    }`}
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                    }}
                                ></div>
                            </div>

                            {/* Status */}
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">
                                    {percentage.toFixed(1)}% spent
                                </span>
                                {isOverBudget && (
                                    <div className="flex items-center gap-1 text-rose-600 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>
                                            Over budget by{' '}
                                            {formatAmount(spent - budget.limit)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
