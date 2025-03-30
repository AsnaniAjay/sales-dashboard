// src/components/charts/SalesByCategoryChart.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SalesByCategoryChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || !data.length) return;

    // Process data to group by category
    const categoryData = {};
    data.forEach(sale => {
      if (!categoryData[sale.category]) {
        categoryData[sale.category] = {
          category: sale.category,
          revenue: 0,
          orders: 0,
          products: new Set()
        };
      }
      categoryData[sale.category].revenue += sale.amount;
      categoryData[sale.category].orders += 1;
      categoryData[sale.category].products.add(sale.product);
    });

    // Convert to array and add product count
    const processedData = Object.values(categoryData).map(item => ({
      ...item,
      productCount: item.products.size,
      products: undefined // Remove Set before rendering
    }));

    // Sort by revenue descending
    processedData.sort((a, b) => b.revenue - a.revenue);
    setChartData(processedData);
  }, [data]);

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
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-indigo-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-green-600">
            Orders: {payload[1].value}
          </p>
          <p className="text-blue-600">
            Products: {payload[2].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales by Category</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="category" />
            <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => formatCurrency(value)} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="productCount" name="Products" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-right">
        <span className="text-xs text-gray-500">
          Breakdown of sales revenue by product categories
        </span>
      </div>
    </div>
  );
};

export default SalesByCategoryChart;