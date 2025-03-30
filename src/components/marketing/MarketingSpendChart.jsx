// src/components/marketing/MarketingSpendChart.jsx
import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import Card from '../cards/Card';

const MarketingSpendChart = ({ marketingData, isLoading = false, period = '30 days' }) => {
  // Format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
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

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!marketingData || !marketingData.dailyMetrics) {
      return [];
    }

    return marketingData.dailyMetrics.map(day => ({
      date: formatDate(day.date),
      revenue: day.revenue,
      spend: day.spend,
      roas: day.revenue / day.spend
    }));
  }, [marketingData]);

  // Calculate average ROAS for reference line
  const avgRoas = useMemo(() => {
    if (!chartData.length) return 0;
    
    const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0);
    const totalSpend = chartData.reduce((sum, day) => sum + day.spend, 0);
    return totalRevenue / totalSpend;
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-gray-700 font-medium">{label}</p>
          <p className="text-blue-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-red-600">
            Spend: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-green-600">
            ROAS: {(payload[2].value).toFixed(2)}x
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse flex flex-col h-80">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex-1 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-80">
          <p className="text-gray-500">No marketing data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Marketing Spend vs. Revenue</h3>
            <p className="text-sm text-gray-500">Performance over the last {period}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Average ROAS</p>
            <p className="text-lg font-medium text-green-600">{avgRoas.toFixed(2)}x</p>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'ROAS', angle: -90, position: 'insideRight' }}
                domain={[0, 'dataMax + 1']}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                name="Revenue" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="spend" 
                stroke="#ef4444" 
                name="Ad Spend" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="roas" 
                stroke="#10b981" 
                name="ROAS" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <ReferenceLine 
                yAxisId="right" 
                y={1} 
                stroke="#d1d5db" 
                strokeDasharray="3 3" 
                label={{ position: 'right', value: 'Breakeven', fill: '#6b7280', fontSize: 12 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default MarketingSpendChart;