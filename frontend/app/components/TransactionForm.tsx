'use client';

import { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../services/api';
import { Plus, IndianRupee, Tag, Type, X } from 'lucide-react';

const CATEGORIES = [
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Health',
    'Shopping',
    'Education',
    'Other',
];

interface TransactionFormProps {
    refresh: () => void;
    editingTransaction?: any;
    onEditComplete?: () => void;
}

export default function TransactionForm({ refresh, editingTransaction, onEditComplete }: TransactionFormProps) {
    const [form, setForm] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
    });
    const [loading, setLoading] = useState(false);

    // Initialize form with editing transaction data
    useEffect(() => {
        if (editingTransaction) {
            setForm({
                title: editingTransaction.title,
                amount: editingTransaction.amount.toString(),
                type: editingTransaction.type,
                category: editingTransaction.category,
            });
        } else {
            setForm({ title: '', amount: '', type: 'expense', category: '' });
        }
    }, [editingTransaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.amount || !form.category) return;

        setLoading(true);
        try {
            const data = {
                ...form,
                amount: Number(form.amount),
            };

            if (editingTransaction) {
                // Update existing transaction
                await updateTransaction(editingTransaction.id, data);
            } else {
                // Create new transaction
                await addTransaction(data);
            }

            setForm({ title: '', amount: '', type: 'expense', category: '' });
            refresh();
            onEditComplete?.();
        } catch (error) {
            console.error('Failed to save transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1 ml-1";

    const isEditing = !!editingTransaction;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className={labelClasses}>Transaction Title</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            placeholder="e.g. Grocery Shopping"
                            value={form.title}
                            className={inputClasses}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Amount</label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            placeholder="0.00"
                            value={form.amount}
                            className={inputClasses}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Category</label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={form.category}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50 appearance-none"
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            required
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Type</label>
                    <div className="relative">
                        <select
                            value={form.type}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50 appearance-none"
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 ${
                    isEditing
                        ? 'bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400'
                        : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400'
                } text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]`}
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                    <>
                        {isEditing ? (
                            <>
                                <span>Update Transaction</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                <span>Add Transaction</span>
                            </>
                        )}
                    </>
                )}
            </button>
        </form>
    );
}