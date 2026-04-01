'use client';

import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';
import { Trash2, TrendingDown, TrendingUp, Inbox } from 'lucide-react';

export default function TransactionList() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getTransactions();
            setData(res.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading && data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-2">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-sm">Loading transactions...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-4">
                <div className="p-4 bg-gray-50 rounded-full">
                    <Inbox className="w-8 h-8 text-gray-300" />
                </div>
                <div className="text-center">
                    <p className="text-gray-600 font-medium">No transactions yet</p>
                    <p className="text-sm text-gray-400">Start by adding your first record above.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((t) => (
                <div
                    key={t.id}
                    className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${
                            t.type === 'income' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                            {t.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        </div>
                        
                        <div>
                            <p className="font-semibold text-gray-800">{t.title}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wider">
                                    {t.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className={`font-bold text-lg ${
                            t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                            {t.type === 'income' ? '+' : '-'} ₹{Math.abs(t.amount).toLocaleString()}
                        </p>
                        
                        <button
                            onClick={async () => {
                                if (confirm('Are you sure you want to delete this transaction?')) {
                                    await deleteTransaction(t.id);
                                    fetchData();
                                }
                            }}
                            className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete transaction"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}