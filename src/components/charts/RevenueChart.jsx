// src/components/charts/RevenueChart.jsx
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const RevenueChart = ({ data, timeframe = 'monthly' }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;

    // Process data based on timeframe
    if (timeframe === 'daily') {
      // Group by day for daily view
      const dailyData = {};
      data.forEach(sale => {
        const date = new Date(sale.date).toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            revenue: 0,
            profit: 0,
            orders: 0
          };
        }
        dailyData[date].revenue += sale.amount;
        dailyData[date].profit += (sale.amount * 0.3); // Simplified profit calculation
        dailyData[date].orders += 1;
      });
      setChartData(Object.values(dailyData));
    } else if (timeframe === 'monthly') {
      // Group by month for monthly view
      const monthlyData = {};
      data.forEach(sale => {
        const date = new Date(sale.date);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[month]) {
          monthlyData[month] = {
            month,
            revenue: 0,
            profit: 0,
            orders: 0
          };
        }
        monthlyData[month].revenue += sale.amount;
        monthlyData[month].profit += (sale.amount * 0.3); // Simplified profit calculation
        monthlyData[month].orders += 1;
      });
      setChartData(Object.values(monthlyData));
    }
  }, [data, timeframe]);

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
          <p className="font-semibold text-gray-800">{timeframe === 'daily' ? label : `${label}`}</p>
          <p className="text-indigo-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-green-600">
              Profit: {formatCurrency(payload[1].value)}
            </p>
          )}
          {payload[2] && (
            <p className="text-blue-600">
              Orders: {payload[2].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={timeframe === 'daily' ? 'date' : 'month'} 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (timeframe === 'daily') {
                  return value.slice(5); // Show only MM-DD
                } else {
                  return value.slice(5); // Show only MM
                }
              }}
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              tick={{ fontSize: 12 }}
            />
            {/* Adding a second YAxis for orders */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              domain={[0, 'auto']}
              hide={true} // Hide this axis since orders are hidden by default
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Profit"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Orders"
              yAxisId="right" // Changed from numeric 1 to string "right"
              hide={true} // Hidden by default, can be toggled from Legend
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-right">
        <span className="text-xs text-gray-500">
          {timeframe === 'daily' ? 'Daily' : 'Monthly'} revenue and profit trends
        </span>
      </div>
    </div>
  );
};

export default RevenueChart;