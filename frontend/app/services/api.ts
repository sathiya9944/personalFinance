import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001',
});

// Transaction endpoints
export const getTransactions = () => API.get('/transactions');
export const addTransaction = (data: any) => API.post('/transactions', data);
export const deleteTransaction = (id: number) =>
    API.delete(`/transactions/${id}`);

// Budget endpoints
export const getBudgets = (month?: number, year?: number) => {
    const params = new URLSearchParams();
    if (month !== undefined && month !== null) params.append('month', month.toString());
    if (year !== undefined && year !== null) params.append('year', year.toString());
    const queryString = params.toString();
    return API.get(`/budgets${queryString ? '?' + queryString : ''}`);
};
export const addBudget = (data: any) => API.post('/budgets', data);
export const updateBudget = (id: number, data: any) =>
    API.patch(`/budgets/${id}`, data);
export const deleteBudget = (id: number) =>
    API.delete(`/budgets/${id}`);
export const getBudgetByCategory = (category: string, month: number, year: number) =>
    API.get(`/budgets/category/${category}?month=${month}&year=${year}`);

// Dashboard helpers
export const calculateBalance = (transactions: any[]) => {
    return transactions.reduce((acc, txn) => {
        return txn.type === 'income' ? acc + txn.amount : acc - txn.amount;
    }, 0);
};

export const getSpendingTrend = (transactions: any[]) => {
    const grouped = transactions.reduce((acc: any, txn: any) => {
        const date = new Date(txn.createdAt).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { date, amount: 0 };
        }
        if (txn.type === 'expense') {
            acc[date].amount += txn.amount;
        }
        return acc;
    }, {});
    return Object.values(grouped);
};

export const getCategoryBreakdown = (transactions: any[]) => {
    const grouped = transactions.reduce((acc: any, txn: any) => {
        if (txn.type === 'expense') {
            if (!acc[txn.category]) {
                acc[txn.category] = 0;
            }
            acc[txn.category] += txn.amount;
        }
        return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
    }));
};