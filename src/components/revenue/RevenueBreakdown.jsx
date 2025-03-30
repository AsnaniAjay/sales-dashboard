import React, { useState, useMemo } from 'react';
import { FaChartBar } from 'react-icons/fa';
import BarChart from '../charts/BarChart';
import Card from '../cards/Card';
import Dropdown from '../ui/Dropdown';

const RevenueBreakdown = ({ salesData = [] }) => {
  const [breakdownBy, setBreakdownBy] = useState('category');
  
  // Breakdown options for dynamic display
  const breakdownOptions = [
    { value: 'category', label: 'By Category' },
    { value: 'product', label: 'By Product' },
    { value: 'region', label: 'By Region' },
    { value: 'salesRep', label: 'By Sales Rep' }
  ];

  // Process data for the selected breakdown
  const chartData = useMemo(() => {
    if (!salesData || !salesData.length) return [];

    // Create a map to aggregate revenue by the selected dimension
    const aggregatedData = {};

    salesData.forEach(sale => {
      const key = sale[breakdownBy] || 'Uncategorized';
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          revenue: 0,
          profit: 0,
          orders: 0
        };
      }
      aggregatedData[key].revenue += (sale.amount || 0);
      aggregatedData[key].profit += (sale.amount * 0.3); // Simplified profit calculation
      aggregatedData[key].orders += 1;
    });

    // Convert to array for the chart
    return Object.entries(aggregatedData)
      .map(([name, value]) => ({
        name,
        value: value.revenue,
        profit: value.profit,
        orders: value.orders
      }))
      .sort((a, b) => b.value - a.value); // Sort by value (descending)
  }, [salesData, breakdownBy]);

  // Handle dimension change
  const handleBreakdownChange = (option) => {
    setBreakdownBy(option.value);
  };

  // Chart config
  const chartConfig = {
    xAxisDataKey: 'name',
    bars: [
      {
        dataKey: 'value',
        fill: '#4F46E5',
        name: 'Revenue',
        stackId: 'revenue'
      },
      {
        dataKey: 'profit',
        fill: '#10B981',
        name: 'Profit',
        stackId: 'profit'
      }
    ],
    valueFormatter: (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center">
          <FaChartBar className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Revenue Breakdown</h3>
        </div>
        <div className="mt-2 sm:mt-0 w-48">
          <Dropdown
            items={breakdownOptions}
            selectedItem={breakdownOptions.find(option => option.value === breakdownBy)}
            onChange={handleBreakdownChange}
            width="w-full"
          />
        </div>
      </div>

      <div className="h-80">
        {chartData.length > 0 ? (
          <BarChart
            data={chartData}
            xAxisDataKey={chartConfig.xAxisDataKey}
            bars={chartConfig.bars}
            valueFormatter={chartConfig.valueFormatter}
            grid={true}
            showLegend={true}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 text-sm">No data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RevenueBreakdown;
