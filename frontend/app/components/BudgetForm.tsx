'use client';

import { useState } from 'react';

interface BudgetFormProps {
    onAddBudget: (data: any) => void;
}

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

export default function BudgetForm({ onAddBudget }: BudgetFormProps) {
    const [formData, setFormData] = useState({
        category: 'Food',
        limit: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const limit = parseFloat(formData.limit);
        if (!formData.category || !formData.limit || isNaN(limit) || limit <= 0) {
            alert('Please fill all fields and ensure budget limit is a positive number');
            return;
        }

        setLoading(true);
        try {
            await onAddBudget({
                category: formData.category,
                limit: parseFloat(formData.limit),
            });
            setFormData({ category: 'Food', limit: '' });
            alert('Budget added successfully!');
        } catch (error) {
            console.error('Error adding budget:', error);
            alert('Failed to add budget');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ➕ Add New Budget
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50 appearance-none"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Budget Limit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Limit (₹)
                        </label>
                        <input
                            type="number"
                            name="limit"
                            value={formData.limit}
                            onChange={handleChange}
                            placeholder="5000"
                            step="0.01"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-700 bg-gray-50/50 appearance-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Adding...' : 'Add Budget'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
