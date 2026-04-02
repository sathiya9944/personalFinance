'use client';

import { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../services/api';
import { Plus, IndianRupee, Tag, Type, X, AlertCircle } from 'lucide-react';
import { showToast } from './ui/Toast';

const CATEGORIES = [
    'Entertainment',
    'Food',
    'Health',
    'Transportation',
    'Salary',
    'Shopping',
    'Utilities',
    'Other',
];

const MAX_AMOUNT = 100000;
const MIN_AMOUNT = 0.01;

// Regex for English alphabets, spaces, hyphens, and apostrophes
const TITLE_REGEX = /^[a-zA-Z\s\-']+$/;
// Regex for English alphabets, spaces, and hyphens
const CATEGORY_REGEX = /^[a-zA-Z\s\-]+$/;

interface TransactionFormProps {
    refresh: () => void;
    editingTransaction?: any;
    onEditComplete?: () => void;
}

interface ValidationErrors {
    amount?: string;
    title?: string;
    category?: string;
}

export default function TransactionForm({ refresh, editingTransaction, onEditComplete }: TransactionFormProps) {
    const [form, setForm] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [apiError, setApiError] = useState<string>('');

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
        setErrors({});
        setApiError('');
    }, [editingTransaction]);

    // Validation function
    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // Validate title
        if (!form.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (!TITLE_REGEX.test(form.title)) {
            newErrors.title = 'Title must contain only English alphabets, spaces, hyphens, and apostrophes';
        }

        // Validate category
        if (!form.category) {
            newErrors.category = 'Category is required';
        } else if (!CATEGORY_REGEX.test(form.category)) {
            newErrors.category = 'Category must contain only English alphabets, spaces, and hyphens';
        }

        // Validate amount
        if (!form.amount) {
            newErrors.amount = 'Amount is required';
        } else {
            const amount = Number(form.amount);

            if (isNaN(amount)) {
                newErrors.amount = 'Amount must be a valid number';
            } else if (amount <= 0) {
                newErrors.amount = 'Amount must be a positive number';
            } else if (amount > MAX_AMOUNT) {
                newErrors.amount = `Amount cannot exceed ₹${MAX_AMOUNT.toLocaleString()}`;
            } else if (amount < MIN_AMOUNT) {
                newErrors.amount = `Minimum amount is ₹${MIN_AMOUNT}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Run validation
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setApiError('');

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
                const response = await addTransaction(data);

                if (response?.data?.budgetExceeded) {
                    showToast(`Budget limit exceeded for ${response.data.category}! Limit: ₹${response.data.limit}, Total: ₹${response.data.total}`, 'warning');
                }
            }

            setForm({ title: '', amount: '', type: 'expense', category: '' });
            setErrors({});
            refresh();
            onEditComplete?.();
        } catch (error: any) {
            console.error('Failed to save transaction:', error);

            // Handle backend validation errors
            if (error.response?.data?.message) {
                setApiError(error.response.data.message);
            } else {
                setApiError('Failed to save transaction. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1 ml-1";

    const isEditing = !!editingTransaction;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Error Alert */}
            {apiError && (
                <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{apiError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className={labelClasses}>Transaction Title</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            placeholder="e.g. Grocery Shopping"
                            value={form.title}
                            className={`${inputClasses} ${errors.title ? 'border-red-400 bg-red-50/30' : ''}`}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>
                    {errors.title && (
                        <p className="text-sm text-red-600 ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.title}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Amount</label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={MAX_AMOUNT}
                            placeholder="0.00"
                            value={form.amount}
                            className={`${inputClasses} ${errors.amount ? 'border-red-400 bg-red-50/30' : ''}`}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                        />
                    </div>
                    {errors.amount && (
                        <p className="text-sm text-red-600 ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.amount}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className={labelClasses}>Category</label>
                    <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={form.category}
                            className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50 appearance-none ${errors.category ? 'border-red-400 bg-red-50/30' : ''}`}
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
                    {errors.category && (
                        <p className="text-sm text-red-600 ml-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.category}
                        </p>
                    )}
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
                className={`w-full flex items-center justify-center gap-2 ${isEditing
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