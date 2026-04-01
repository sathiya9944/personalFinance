'use client';

import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { deleteTransaction } from '../services/api';
import { useState, useCallback } from 'react';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    createdAt: string;
}

interface RecentTransactionsTableProps {
    transactions: Transaction[];
    onRefresh?: () => void;
}

function formatAmount(amount: number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-IN');
}

export default function RecentTransactionsTable({
    transactions: initialTransactions,
    onRefresh,
}: RecentTransactionsTableProps) {
    const [transactions, setTransactions] = useState(initialTransactions);
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = useCallback(
        async (id: number) => {
            if (
                confirm('Are you sure you want to delete this transaction?')
            ) {
                try {
                    setDeleting(id);
                    await deleteTransaction(id);
                    setTransactions((prev) =>
                        prev.filter((txn) => txn.id !== id)
                    );
                    onRefresh?.();
                } catch (error) {
                    console.error('Error deleting transaction:', error);
                    alert('Failed to delete transaction');
                } finally {
                    setDeleting(null);
                }
            }
        },
        [onRefresh]
    );

    const isEmpty = !transactions || transactions.length === 0;

    return isEmpty ? (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Recent Transactions
            </h3>
            <div className="text-center py-12 text-gray-500">
                No transactions yet. Add one to get started!
            </div>
        </div>
    ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    📋 Recent Transactions
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((txn) => (
                            <tr
                                key={txn.id}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                    {txn.title}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        {txn.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold">
                                    <div className="flex items-center gap-2">
                                        {txn.type === 'income' ? (
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-rose-500" />
                                        )}
                                        <span
                                            className={
                                                txn.type === 'income'
                                                    ? 'text-emerald-600'
                                                    : 'text-rose-600'
                                            }
                                        >
                                            {formatAmount(txn.amount)}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {formatDate(txn.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleDelete(txn.id)}
                                        disabled={deleting === txn.id}
                                        className="text-rose-600 hover:text-rose-900 transition disabled:text-gray-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
