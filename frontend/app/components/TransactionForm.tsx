'use client';

import { useState } from 'react';
import { addTransaction } from '../services/api';
import { Plus, IndianRupee, Tag, Type } from 'lucide-react';

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

export default function TransactionForm({ refresh }: any) {
    const [form, setForm] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.amount || !form.category) return;

        setLoading(true);
        try {
            await addTransaction({
                ...form,
                amount: Number(form.amount),
            });
            setForm({ title: '', amount: '', type: 'expense', category: '' });
            refresh();
        } catch (error) {
            console.error('Failed to add transaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1 ml-1";

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
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg active:scale-[0.98]"
            >
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        <span>Add Transaction</span>
                    </>
                )}
            </button>
        </form>
    );
}