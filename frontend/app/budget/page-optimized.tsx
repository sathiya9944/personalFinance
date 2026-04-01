'use client';

import { useState, Suspense } from 'react';
import { getBudgetData } from '../services/server';
import BudgetForm from '../components/BudgetForm';
import BudgetProgress from '../components/BudgetProgress';
import PlannedVsActual from '../components/PlannedVsActual';

interface BudgetContentProps {
    month: number;
    year: number;
}

async function BudgetContent({ month, year }: BudgetContentProps) {
    const { budgets, transactions } = await getBudgetData(month, year);

    return (
        <>
            <BudgetForm
                onAddBudget={async (data) => {
                    // Form handles refresh internally
                }}
            />
            <BudgetProgress
                budgets={budgets}
                transactions={transactions}
                month={month}
                year={year}
            />
            <PlannedVsActual budgets={budgets} transactions={transactions} />
        </>
    );
}

function SkeletonLoader() {
    return <div className="bg-white rounded-lg shadow-md p-6 animate-pulse h-96"></div>;
}

export default function BudgetPage() {
    const [currentMonth, setCurrentMonth] = useState(
        new Date().getMonth() + 1
    );
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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

                {/* Dynamic Content with Suspense */}
                <Suspense fallback={<SkeletonLoader />}>
                    <BudgetContent month={currentMonth} year={currentYear} />
                </Suspense>
            </main>
        </div>
    );
}
