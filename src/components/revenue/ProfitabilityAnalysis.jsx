// src/components/revenue/ProfitabilityAnalysis.jsx
import React, { useState, useMemo } from 'react';
import { FaChartPie, FaChartLine } from 'react-icons/fa';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../cards/Card';
import TabGroup from '../ui/TabGroup';

const ProfitabilityAnalysis = ({ salesData = [], costData = [] }) => {
  const [activeView, setActiveView] = useState('margin');
  
  // Define tabs for different profitability views
  const tabs = [
    { id: 'margin', label: 'Gross Margin', icon: <FaChartLine className="h-4 w-4" /> },
    { id: 'category', label: 'By Category', icon: <FaChartPie className="h-4 w-4" /> },
    { id: 'costs', label: 'Cost Breakdown', icon: <FaChartPie className="h-4 w-4" /> }
  ];

  // Process data for gross margin over time
  const marginTimeData = useMemo(() => {
    if (!salesData || !salesData.length || !costData || !costData.length) return [];

    // Group sales by month
    const monthlySales = {};
    salesData.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlySales[monthKey]) {
        monthlySales[monthKey] = {
          month: monthKey,
          revenue: 0,
          cost: 0,
          margin: 0,
          marginPercent: 0
        };
      }
      
      monthlySales[monthKey].revenue += (sale.amount || 0);
    });
    
    // Add costs by month
    costData.forEach(cost => {
      const date = new Date(cost.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlySales[monthKey]) {
        monthlySales[monthKey].cost += (cost.amount || 0);
      }
    });
    
    // Calculate margins
    Object.values(monthlySales).forEach(month => {
      month.margin = month.revenue - month.cost;
      month.marginPercent = month.revenue > 0 ? (month.margin / month.revenue) * 100 : 0;
    });
    
    // Convert to array and sort by date
    return Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month));
  }, [salesData, costData]);

  // Process data for profit by category
  const categoryProfitData = useMemo(() => {
    if (!salesData || !salesData.length || !costData || !costData.length) return [];

    // Group sales by category
    const categoryData = {};
    salesData.forEach(sale => {
      const category = sale.category || 'Uncategorized';
      
      if (!categoryData[category]) {
        categoryData[category] = {
          category,
          revenue: 0,
          cost: 0,
          profit: 0,
          margin: 0
        };
      }
      
      categoryData[category].revenue += (sale.amount || 0);
    });
    
    // Add costs by category (assuming costData has category field)
    costData.forEach(cost => {
      const category = cost.category || 'Uncategorized';
      
      if (categoryData[category]) {
        categoryData[category].cost += (cost.amount || 0);
      }
    });
    
    // Calculate profits and margins
    Object.values(categoryData).forEach(cat => {
      cat.profit = cat.revenue - cat.cost;
      cat.margin = cat.revenue > 0 ? (cat.profit / cat.revenue) * 100 : 0;
    });
    
    // Convert to array and sort by profit (descending)
    return Object.values(categoryData)
      .sort((a, b) => b.profit - a.profit);
  }, [salesData, costData]);

  // Process data for cost breakdown
  const costBreakdownData = useMemo(() => {
    if (!costData || !costData.length) return [];

    // Group costs by type
    const costsByType = {};
    costData.forEach(cost => {
      const type = cost.type || 'Other';
      
      if (!costsByType[type]) {
        costsByType[type] = {
          type,
          amount: 0
        };
      }
      
      costsByType[type].amount += (cost.amount || 0);
    });
    
    // Convert to array and sort by amount (descending)
    return Object.values(costsByType)
      .sort((a, b) => b.amount - a.amount);
  }, [costData]);

  // Format currency for tooltip and axis
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage for tooltip and axis
  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Format month for x-axis
  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year.substring(2)}`;
  };

  // Render the appropriate chart based on active view
  const renderChart = () => {
    if (activeView === 'margin') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={marginTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={formatMonth}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={formatPercent}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Revenue' || name === 'Cost' || name === 'Margin') {
                  return [formatCurrency(value), name];
                }
                return [formatPercent(value), name];
              }}
              labelFormatter={formatMonth}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#4F46E5" />
            <Bar yAxisId="left" dataKey="cost" name="Cost" fill="#F43F5E" />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="margin" 
              name="Margin" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="marginPercent" 
              name="Margin %" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      );
    } else if (activeView === 'category') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={categoryProfitData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickFormatter={formatPercent}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Revenue' || name === 'Cost' || name === 'Profit') {
                  return [formatCurrency(value), name];
                }
                return [formatPercent(value), name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#4F46E5" />
            <Bar yAxisId="left" dataKey="cost" name="Cost" fill="#F43F5E" />
            <Bar yAxisId="left" dataKey="profit" name="Profit" fill="#10B981" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="margin" 
              name="Margin %" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      );
    } else if (activeView === 'costs') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={costBreakdownData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="type" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value), 'Cost']}
            />
            <Legend />
            <Bar dataKey="amount" name="Cost Amount" fill="#F43F5E" />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  };

  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center ">
          <FaChartPie className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Profitability Analysis</h3>
        </div>
        
        <TabGroup 
          tabs={tabs} 
          activeTab={activeView}
          onChange={(tabId) => setActiveView(tabId)}
        />
        
        <div className="h-80">
          {renderChart()}
        </div>
      </div>
    </Card>
  );
};

export default ProfitabilityAnalysis;