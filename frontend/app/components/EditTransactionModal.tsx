'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import TransactionForm from './TransactionForm';

interface EditTransactionModalProps {
    isOpen: boolean;
    transaction: any;
    onClose: () => void;
    onEditComplete: () => void;
}

export default function EditTransactionModal({
    isOpen,
    transaction,
    onClose,
    onEditComplete,
}: EditTransactionModalProps) {
    const handleEditComplete = () => {
        onEditComplete();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                        <h2 className="text-xl font-bold text-gray-800">Edit Transaction</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <TransactionForm
                            refresh={handleEditComplete}
                            editingTransaction={transaction}
                            onEditComplete={handleEditComplete}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
