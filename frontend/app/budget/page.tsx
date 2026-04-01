'use client';

import { useState, useEffect } from 'react';
import { getBudgets, getTransactions, addBudget } from '../services/api';
import BudgetForm from '../components/BudgetForm';
import BudgetProgress from '../components/BudgetProgress';
import PlannedVsActual from '../components/PlannedVsActual';

export default function BudgetPage() {
    const [budgets, setBudgets] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchBudgetData();
    }, [currentMonth, currentYear]);

    const fetchBudgetData = async () => {
        try {
            setLoading(true);
            const [budgetsRes, transactionsRes] = await Promise.all([
                getBudgets(currentMonth, currentYear),
                getTransactions(),
            ]);
            setBudgets(budgetsRes.data);
            setTransactions(transactionsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching budget data:', error);
            setLoading(false);
            alert('Failed to load budget data. Please try again.');
        }
    };

    const handleAddBudgetWithError = async (data: any) => {
        try {
            await handleAddBudget(data);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to add budget';
            alert(message);
        }
    };

    const handleAddBudget = async (data: any) => {
        try {
            await addBudget({
                ...data,
                month: currentMonth,
                year: currentYear,
            });
            fetchBudgetData();
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    💰 Budget Management
                </h1>

                {/* Month/Year Selector */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex gap-4 items-center">
                        <label className="text-gray-700 font-medium">
                            Select Month:
                        </label>
                        <select
                            value={currentMonth}
                            onChange={(e) =>
                                setCurrentMonth(parseInt(e.target.value))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2024, i).toLocaleString('en-US', {
                                        month: 'long',
                                    })}
                                </option>
                            ))}
                        </select>
                        <select
                            value={currentYear}
                            onChange={(e) =>
                                setCurrentYear(parseInt(e.target.value))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md"
                        >
                            {[...Array(5)].map((_, i) => {
                                const year = new Date().getFullYear() - 2 + i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                {/* Add Budget Form */}
                <BudgetForm onAddBudget={handleAddBudgetWithError} />

                {/* Budget Progress */}
                <BudgetProgress
                    budgets={budgets}
                    transactions={transactions}
                    month={currentMonth}
                    year={currentYear}
                />

                {/* Planned vs Actual */}
                <PlannedVsActual
                    budgets={budgets}
                    transactions={transactions}
                />
            </main>
        </div>
    );
}
