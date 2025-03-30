// src/components/revenue/RevenueForecast.jsx
import React, { useMemo } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart
} from 'recharts';
import Card from '../cards/Card';

const RevenueForecast = ({ salesData = [], forecastMonths = 6 }) => {
  // Process data for forecasting
  const forecastData = useMemo(() => {
    if (!salesData || salesData.length === 0) return [];

    // Sort sales data by date
    const sortedData = [...salesData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Group by month
    const monthlyData = {};
    sortedData.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          revenue: 0,
          count: 0
        };
      }
      
      monthlyData[monthKey].revenue += (sale.amount || 0);
      monthlyData[monthKey].count += 1;
    });
    
    // Convert to array and calculate monthly growth rates
    const monthlyArray = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    
    // We need at least 2 months of data for forecasting
    if (monthlyArray.length < 2) {
      return monthlyArray;
    }
    
    // Calculate growth rates and linear regression for forecasting
    const xValues = monthlyArray.map((_, i) => i); // Months as numeric indices
    const yValues = monthlyArray.map(m => m.revenue); // Revenue values
    
    // Simple linear regression
    const n = xValues.length;
    const sumX = xValues.reduce((sum, x) => sum + x, 0);
    const sumY = yValues.reduce((sum, y) => sum + y, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Function to predict revenue
    const predictRevenue = (monthIndex) => intercept + slope * monthIndex;
    
    // Calculate standard error for confidence intervals
    const predictions = xValues.map(x => predictRevenue(x));
    const residuals = predictions.map((pred, i) => yValues[i] - pred);
    const residualSquares = residuals.map(r => r * r);
    const standardError = Math.sqrt(residualSquares.reduce((sum, r) => sum + r, 0) / (n - 2));
    
    // Add forecast data
    const historicalData = [...monthlyArray];
    const lastMonth = new Date(historicalData[historicalData.length - 1].month + '-01');
    
    for (let i = 1; i <= forecastMonths; i++) {
      const forecastDate = new Date(lastMonth);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      const monthKey = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
      const monthIndex = xValues.length + i - 1;
      
      const forecastedRevenue = predictRevenue(monthIndex);
      const confidenceInterval = 1.96 * standardError; // 95% confidence interval
      
      historicalData.push({
        month: monthKey,
        revenue: null, // Actual revenue is null for forecast
        forecast: Math.max(0, forecastedRevenue), // Don't allow negative forecasts
        upperBound: Math.max(0, forecastedRevenue + confidenceInterval),
        lowerBound: Math.max(0, forecastedRevenue - confidenceInterval),
        isForecast: true
      });
    }
    
    return historicalData;
  }, [salesData, forecastMonths]);

  // Format for tooltip
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format for X-axis labels (month)
  const formatXAxis = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year.substring(2)}`;
  };

  // Find the index where forecast starts
  const forecastStartIndex = forecastData.findIndex(item => item.isForecast);

  return (
    <Card>
      <div className="flex items-center mb-4">
        <FaChartLine className="h-5 w-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Revenue Forecast</h3>
      </div>
      
      <div className="h-80">
        {forecastData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={forecastData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatXAxis} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                labelFormatter={formatXAxis}
              />
              <Legend />
              
              {/* Historical Revenue Line */}
              <Line
                type="monotone"
                dataKey="revenue"
                name="Actual Revenue"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 8 }}
              />
              
              {/* Forecast Line */}
              <Line
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
              />
              
              {/* Confidence Interval Area */}
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="transparent"
                fill="#10B981"
                fillOpacity={0.2}
                name="Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="transparent"
                fill="#10B981"
                fillOpacity={0.2}
                name="Lower Bound"
              />
              
              {/* Reference line showing where forecast begins */}
              {forecastStartIndex > 0 && (
                <ReferenceLine
                  x={forecastData[forecastStartIndex].month}
                  stroke="#6B7280"
                  strokeDasharray="3 3"
                  label={{ value: 'Forecast Start', position: 'top', fill: '#6B7280', fontSize: 12 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500 text-sm">Insufficient data for forecast</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Based on historical data with 95% confidence interval</p>
      </div>
    </Card>
  );
};

export default RevenueForecast;