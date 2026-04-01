'use client';

import { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';
import { Trash2, TrendingDown, TrendingUp, Inbox, Edit2 } from 'lucide-react';
import EditTransactionModal from './EditTransactionModal';

export default function TransactionList() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleEditClick = (transaction: any) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleEditComplete = () => {
        fetchData();
        setEditingTransaction(null);
    };

    const handleDeleteClick = async (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
                fetchData();
            } catch (error) {
                console.error('Failed to delete transaction:', error);
            }
        }
    };

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
        <>
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

                        <div className="flex items-center gap-3">
                            <p className={`font-bold text-lg ${
                                t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                {t.type === 'income' ? '+' : '-'} ₹{Math.abs(t.amount).toLocaleString()}
                            </p>
                            
                            <button
                                onClick={() => handleEditClick(t)}
                                className="p-2 rounded-lg"
                                title="Edit transaction"
                            >
                                <Edit2 className="w-4 h-4 text-blue-500" />
                            </button>

                            <button
                                onClick={() => handleDeleteClick(t.id)}
                                className="p-2 rounded-lg"
                                title="Delete transaction"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            <EditTransactionModal
                isOpen={isModalOpen}
                transaction={editingTransaction}
                onClose={() => setIsModalOpen(false)}
                onEditComplete={handleEditComplete}
            />
        </>
    );
}