
// src/components/cards/KpiCard.jsx
import React from 'react';
import { ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/solid';

const KpiCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'percentage', // 'percentage', 'value', 'none'
  changeText,
  timeFrame = 'vs. last period',
  color = 'blue', // 'blue', 'green', 'purple', 'red', 'yellow'
  icon,
  footer,
  isLoading = false,
  format = 'number' // 'number', 'currency', 'percentage'
}) => {
  // Color variants
  const colorVariants = {
    blue: {
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-500',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    green: {
      bgLight: 'bg-green-50',
      bgDark: 'bg-green-500',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    purple: {
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-500',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    red: {
      bgLight: 'bg-red-50',
      bgDark: 'bg-red-500',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    yellow: {
      bgLight: 'bg-yellow-50',
      bgDark: 'bg-yellow-500',
      text: 'text-yellow-700',
      border: 'border-yellow-200'
    }
  };
  
  const selectedColor = colorVariants[color] || colorVariants.blue;
  
  // Determine change trend
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
  
  // Format value based on type
  const formatValue = (val) => {
    if (val === undefined || val === null) return '–';
    
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    
    if (format === 'percentage') {
      return `${parseFloat(val).toFixed(1)}%`;
    }
    
    // If value is a large number, format it with K, M, B suffix
    if (typeof val === 'number' && format === 'number') {
      if (val >= 1000000000) {
        return `${(val / 1000000000).toFixed(1)}B`;
      }
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      }
      if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
    }
    
    return val;
  };
  
  // Format change text
  const getChangeDisplay = () => {
    if (changeType === 'none' || change === undefined || change === null) {
      return null;
    }
    
    if (changeText) {
      return changeText;
    }
    
    if (changeType === 'value') {
      return `${change > 0 ? '+' : ''}${formatValue(change)}`;
    }
    
    // Default: percentage
    return `${change > 0 ? '+' : ''}${parseFloat(change).toFixed(1)}%`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon ? (
              <div className={`p-2 rounded-md ${selectedColor.bgLight}`}>
                {icon}
              </div>
            ) : null}
          </div>
          <div className={`${icon ? 'ml-3' : ''} w-full`}>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            
            <div className={`mt-1 flex items-baseline ${isLoading ? 'animate-pulse' : ''}`}>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '–' : formatValue(value)}
              </p>
              
              {!isLoading && trend !== 'neutral' && getChangeDisplay() && (
                <p className={`ml-2 text-sm ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                } flex items-center`}>
                  {trend === 'up' ? (
                    <ArrowSmUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" aria-hidden="true" />
                  ) : (
                    <ArrowSmDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" aria-hidden="true" />
                  )}
                  {getChangeDisplay()}
                </p>
              )}
            </div>
            
            {timeFrame && (
              <p className="mt-1 text-xs text-gray-500">{timeFrame}</p>
            )}
          </div>
        </div>
      </div>
      
      {footer && (
        <div className={`px-5 py-3 ${selectedColor.bgLight} ${selectedColor.border} border-t`}>
          <div className={`text-sm ${selectedColor.text}`}>
            {footer}
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiCard;