// src/components/revenue/PaymentMethodAnalysis.jsx
import React, { useState, useMemo } from 'react';
import { FaCreditCard } from 'react-icons/fa';
import Card from '../cards/Card';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import TabGroup from '../ui/TabGroup';

const PaymentMethodAnalysis = ({ salesData = [] }) => {
  const [chartType, setChartType] = useState('pie');
  
  // Chart type options
  const chartOptions = [
    { id: 'pie', label: 'Pie Chart' },
    { id: 'bar', label: 'Bar Chart' }
  ];

  // Process data for payment method breakdown
  const paymentData = useMemo(() => {
    if (!salesData || !salesData.length) return [];

    // Group by payment method
    const paymentMethodGroups = {};
    salesData.forEach(sale => {
      const method = sale.paymentMethod || 'Other';
      
      if (!paymentMethodGroups[method]) {
        paymentMethodGroups[method] = {
          name: method,
          value: 0,
          count: 0
        };
      }
      
      paymentMethodGroups[method].value += (sale.amount || 0);
      paymentMethodGroups[method].count += 1;
    });
    
    // Convert to array and sort by value (descending)
    return Object.values(paymentMethodGroups)
      .sort((a, b) => b.value - a.value);
  }, [salesData]);

  // Format currency for tooltip and labels
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return paymentData.reduce((sum, method) => sum + method.value, 0);
  }, [paymentData]);

  // Calculate percentages for display
  const paymentDataWithPercent = useMemo(() => {
    if (totalRevenue === 0) return paymentData;
    
    return paymentData.map(method => ({
      ...method,
      percentage: (method.value / totalRevenue) * 100
    }));
  }, [paymentData, totalRevenue]);

  // Pie chart configuration
  const pieChartConfig = {
    dataKey: 'value',
    nameKey: 'name',
    colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F43F5E', '#6366F1', '#14B8A6'],
    tooltip: (entry) => `${entry.name}: ${formatCurrency(entry.value)} (${entry.percentage.toFixed(1)}%)`,
    label: (entry) => `${entry.percentage > 5 ? `${entry.name}: ${entry.percentage.toFixed(1)}%` : ''}`
  };

  // Bar chart configuration
  const barChartConfig = {
    xAxisDataKey: 'name',
    bars: [
      {
        dataKey: 'value',
        fill: '#4F46E5',
        name: 'Revenue',
      }
    ],
    valueFormatter: formatCurrency
  };

  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <FaCreditCard className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Payment Method Analysis</h3>
          </div>
          <TabGroup 
            tabs={chartOptions}
            activeTab={chartType}
            onChange={setChartType}
            variant="simple"
          />
        </div>
        
        <div className="h-80">
          {paymentData.length > 0 ? (
            chartType === 'pie' ? (
              <PieChart 
                data={paymentDataWithPercent}
                dataKey={pieChartConfig.dataKey}
                nameKey={pieChartConfig.nameKey}
                colors={pieChartConfig.colors}
                tooltip={pieChartConfig.tooltip}
                label={pieChartConfig.label}
                donut={true}
                showLegend={true}
              />
            ) : (
              <BarChart
                data={paymentDataWithPercent}
                xAxisDataKey={barChartConfig.xAxisDataKey}
                bars={barChartConfig.bars}
                valueFormatter={barChartConfig.valueFormatter}
                grid={true}
                horizontal={true}
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500 text-sm">No payment method data available</p>
            </div>
          )}
        </div>
        
        {/* Summary Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentDataWithPercent.map((method, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {method.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(method.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {method.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {method.percentage ? `${method.percentage.toFixed(1)}%` : '0%'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default PaymentMethodAnalysis;