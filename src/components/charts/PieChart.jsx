// src/components/charts/PieChart.jsx
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const RADIAN = Math.PI / 180;

// Custom label for pie slices
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is significant
  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChart = ({ data, dataKey, nameKey, title, description, donut = false, showLabels = true }) => {
  // Ensure data is valid and has numeric values
  const validData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    // Calculate total for percentage
    const total = data.reduce((sum, item) => {
      const value = Number(item[dataKey]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    // Create a new array with valid numeric values and calculated percentages
    return data.map(item => {
      const value = Number(item[dataKey]);
      const validValue = isNaN(value) ? 0 : value;
      const percentage = total > 0 ? validValue / total : 0;
      
      return {
        ...item,
        [dataKey]: validValue,
        percentage: percentage
      };
    });
  }, [data, dataKey]);

  // Format currency for tooltip if needed
  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const itemValue = data.value;
      const itemPercentage = data.payload.percentage;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-800">{data.name}</p>
          <p className="text-indigo-600">
            value: {typeof itemValue === 'number' && dataKey.toLowerCase().includes('value') 
              ? formatCurrency(itemValue) 
              : itemValue}
          </p>
          <p className="text-gray-500">
            {itemPercentage ? `${(itemPercentage * 100).toFixed(1)}%` : '0%'}
          </p>
        </div>
      );
    }
    return null;
  };

  // If no data or empty array, show empty state
  if (!validData || validData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={validData}
              cx="50%"
              cy="50%"
              labelLine={showLabels}
              label={showLabels ? renderCustomizedLabel : null}
              outerRadius={80}
              innerRadius={donut ? 40 : 0}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              isAnimationActive={true}
            >
              {validData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;