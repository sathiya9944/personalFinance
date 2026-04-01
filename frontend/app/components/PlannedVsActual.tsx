import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface PlannedVsActualProps {
    budgets: any[];
    transactions: any[];
}

export default function PlannedVsActual({
    budgets,
    transactions,
}: PlannedVsActualProps) {
    const getCurrentMonthTransactions = (category: string) => {
        const now = new Date();
        return transactions
            .filter((txn) => {
                const txnDate = new Date(txn.createdAt);
                return (
                    txn.type === 'expense' &&
                    txn.category === category &&
                    txnDate.getMonth() === now.getMonth() &&
                    txnDate.getFullYear() === now.getFullYear()
                );
            })
            .reduce((sum, txn) => sum + txn.amount, 0);
    };

    const data = budgets.map((budget) => ({
        category: budget.category,
        planned: budget.limit,
        actual: getCurrentMonthTransactions(budget.category),
    }));

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    📈 Planned vs Actual
                </h2>
                <div className="h-80 flex items-center justify-center text-gray-500">
                    No budget data available for comparison
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📈 Planned vs Actual
            </h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 100 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="category"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value: any) =>
                            new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                            }).format(value as number)
                        }
                    />
                    <Legend />
                    <Bar dataKey="planned" fill="#10b981" name="Planned Budget" />
                    <Bar dataKey="actual" fill="#f59e0b" name="Actual Spending" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
