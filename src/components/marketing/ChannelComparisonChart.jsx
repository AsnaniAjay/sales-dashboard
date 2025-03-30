// src/components/marketing/ChannelComparisonChart.jsx
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import Card from '../cards/Card';

const ChannelComparisonChart = ({ marketingData, isLoading = false }) => {
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
    if (!marketingData || !marketingData.channelMetrics) {
      return [];
    }

    // Group campaigns by channel and calculate metrics
    const channelData = marketingData.channelMetrics.map(channel => ({
      name: channel.name,
      roas: channel.revenue / channel.spend,
      spend: channel.spend,
      revenue: channel.revenue,
      conversions: channel.conversions
    }));

    // Sort by ROAS (descending)
    return channelData.sort((a, b) => b.roas - a.roas);
  }, [marketingData]);

  // Get color based on ROAS value
  const getROASColor = (roas) => {
    if (roas >= 4) return '#10b981'; // Green (excellent)
    if (roas >= 2) return '#3b82f6'; // Blue (good)
    if (roas >= 1) return '#f59e0b'; // Yellow (fair)
    return '#ef4444'; // Red (poor)
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-gray-700 font-medium">{label}</p>
          <p className="text-green-600">
            ROAS: {data.roas.toFixed(2)}x
          </p>
          <p className="text-blue-600">
            Revenue: {formatCurrency(data.revenue)}
          </p>
          <p className="text-red-600">
            Spend: {formatCurrency(data.spend)}
          </p>
          <p className="text-gray-600">
            Conversions: {data.conversions}
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
          <p className="text-gray-500">No channel data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900">Channel ROAS Comparison</h3>
          <p className="text-sm text-gray-500">Performance metrics by marketing channel</p>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis 
                label={{ value: 'ROAS', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <ReferenceLine y={1} stroke="#d1d5db" strokeDasharray="3 3" label={{ position: 'right', value: 'Breakeven', fill: '#6b7280', fontSize: 12 }} />
              <Bar dataKey="roas" name="ROAS">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getROASColor(entry.roas)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Channel summary table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((channel, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{channel.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-medium" style={{ color: getROASColor(channel.roas) }}>
                    {channel.roas.toFixed(2)}x
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(channel.spend)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">{formatCurrency(channel.revenue)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">{channel.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default ChannelComparisonChart;