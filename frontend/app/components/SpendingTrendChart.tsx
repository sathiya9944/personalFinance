'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface SpendingTrendChartProps {
    data: any[];
}

export default function SpendingTrendChart({ data }: SpendingTrendChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📊 Spending Trend
                </h3>
                <div className="h-80 flex items-center justify-center text-gray-500">
                    No spending data available
                </div>
            </div>
        );
    }

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Spending Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={sortedData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tickFormatter={(dateString: string) => {
                            const date = new Date(dateString);
                            if (isNaN(date.getTime())) return dateString;
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            return `${month}/${day}`;
                        }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value: any) =>
                            new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                            }).format(value as number)
                        }
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={{ fill: '#f43f5e', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
