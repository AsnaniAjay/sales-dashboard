import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const BarChart = ({
  data = [],
  xAxisDataKey = 'name',
  bars = [{ dataKey: 'value', fill: '#4F46E5', name: 'Value' }],
  valueFormatter,
  grid = true,
  showLegend = true,
  horizontal = false,
  stackId = null
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-900 mb-1">{label}</p> {/* This is where the category/product/region name is displayed */}
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              ></div>
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span>
                  {valueFormatter ? valueFormatter(entry.value) : entry.value}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        
        {horizontal ? (
          <>
            <XAxis 
              type="number" 
              tickFormatter={valueFormatter}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              dataKey={xAxisDataKey} 
              type="category" 
              tick={{ fontSize: 12 }}
              width={120} 
            />
          </>
        ) : (
          <>
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              tickFormatter={valueFormatter}
              tick={{ fontSize: 12 }}
            />
          </>
        )}
        
        <Tooltip content={customTooltip} />
        {showLegend && <Legend />}
        
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.fill}
            stackId={stackId || bar.stackId}
            radius={bar.radius || [4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
