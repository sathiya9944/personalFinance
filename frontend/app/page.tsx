'use client';
import { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Wallet, PlusCircle, List } from 'lucide-react';

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => setRefresh((p) => p + 1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            MyWallet
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your expenses, income, and budgets with ease
          </p>
        </header>

        {/* Form Section */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>
            </div>
            <TransactionForm refresh={handleRefresh} />
          </div>
        </section>

        {/* List Section */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <List className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
            </div>
            <TransactionList key={refresh} />
          </div>
        </section>
      </div>
    </main>
  );
}