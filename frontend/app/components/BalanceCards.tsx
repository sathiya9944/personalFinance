interface BalanceCardsProps {
    balance: number;
    income: number;
    expenses: number;
}

export default function BalanceCards({
    balance,
    income,
    expenses,
}: BalanceCardsProps) {
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Balance */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Total Balance
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">
                            {formatAmount(balance)}
                        </h3>
                    </div>
                    <div className="text-4xl">💳</div>
                </div>
            </div>

            {/* Total Income */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Total Income
                        </p>
                        <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                            {formatAmount(income)}
                        </h3>
                    </div>
                    <div className="text-4xl">📈</div>
                </div>
            </div>

            {/* Total Expenses */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-500">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">
                            Total Expenses
                        </p>
                        <h3 className="text-3xl font-bold text-rose-600 mt-2">
                            {formatAmount(expenses)}
                        </h3>
                    </div>
                    <div className="text-4xl">📉</div>
                </div>
            </div>
        </div>
    );
}
