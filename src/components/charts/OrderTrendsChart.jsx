// src/components/charts/OrderTrendsChart.jsx
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const OrderTrendsChart = ({ data, timeframe = 'weekly' }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;

    // Process data based on timeframe
    if (timeframe === 'weekly') {
      // Group by week
      const weeklyData = {};
      data.forEach(sale => {
        const date = new Date(sale.date);
        const year = date.getFullYear();
        const weekNumber = getWeekNumber(date);
        const weekKey = `${year}-W${weekNumber}`;
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            week: weekKey,
            orders: 0,
            newCustomers: 0,
            returningCustomers: 0,
            // For demo purposes, randomly assign new vs returning
            // In a real app, this would be based on actual customer data
            totalAmount: 0
          };
        }
        
        weeklyData[weekKey].orders += 1;
        weeklyData[weekKey].totalAmount += sale.amount;
        
        // Randomly determine if this is a new or returning customer for demo
        const isNewCustomer = Math.random() > 0.7; // 30% chance of being a new customer
        if (isNewCustomer) {
          weeklyData[weekKey].newCustomers += 1;
        } else {
          weeklyData[weekKey].returningCustomers += 1;
        }
      });
      
      // Convert to array and sort by week
      const result = Object.values(weeklyData);
      result.sort((a, b) => a.week.localeCompare(b.week));
      setChartData(result);
    } else if (timeframe === 'daily') {
      // Group by day
      const dailyData = {};
      data.forEach(sale => {
        const date = new Date(sale.date).toISOString().split('T')[0];
        
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            orders: 0,
            newCustomers: 0,
            returningCustomers: 0,
            totalAmount: 0
          };
        }
        
        dailyData[date].orders += 1;
        dailyData[date].totalAmount += sale.amount;
        
        // Randomly determine if this is a new or returning customer for demo
        const isNewCustomer = Math.random() > 0.7;
        if (isNewCustomer) {
          dailyData[date].newCustomers += 1;
        } else {
          dailyData[date].returningCustomers += 1;
        }
      });
      
      // Convert to array and sort by date
      const result = Object.values(dailyData);
      result.sort((a, b) => a.date.localeCompare(b.date));
      setChartData(result);
    }
  }, [data, timeframe]);

  // Helper function to get week number
  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

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
          <p className="font-semibold text-gray-800">{timeframe === 'weekly' ? `Week ${label.split('-W')[1]}` : label}</p>
          <p className="text-indigo-600">
            Total Orders: {payload[0].value}
          </p>
          <p className="text-green-600">
            New Customers: {payload[1].value}
          </p>
          <p className="text-blue-600">
            Returning Customers: {payload[2].value}
          </p>
          {payload[3] && (
            <p className="text-purple-600">
              Order Volume: {formatCurrency(payload[3].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={timeframe === 'weekly' ? 'week' : 'date'} 
              tickFormatter={(value) => {
                if (timeframe === 'weekly') {
                  return `W${value.split('-W')[1]}`;
                } else {
                  return value.slice(5); // Show only MM-DD for daily
                }
              }}
            />
            <YAxis yAxisId="left" /> {/* Main Y-axis */}
            <YAxis yAxisId="right" orientation="right" hide={true} /> {/* Secondary Y-axis for totalAmount */}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="orders"
              stackId="1"
              stroke="#4f46e5"
              fill="#c7d2fe"
              name="Total Orders"
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              stackId="2"
              stroke="#10b981"
              fill="#a7f3d0"
              name="New Customers"
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="returningCustomers"
              stackId="2"
              stroke="#3b82f6"
              fill="#bfdbfe"
              name="Returning Customers"
              yAxisId="left"
            />
            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke="#8b5cf6"
              fill="none"
              name="Order Volume"
              yAxisId="right" // Using the secondary Y-axis
              hide={true} // Hidden by default, can be shown via legend
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-right">
        <span className="text-xs text-gray-500">
          {timeframe === 'weekly' ? 'Weekly' : 'Daily'} order volume and customer acquisition trends
        </span>
      </div>
    </div>
  );
};

export default OrderTrendsChart;