// src/components/marketing/ROASMetricCard.jsx
import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/outline';
import Card from '../cards/Card';

// This component displays the Return on Ad Spend (ROAS) as a main KPI
const ROASMetricCard = ({ 
  marketingData, 
  previousPeriodData, 
  isLoading = false,
  period = 'This Month'
}) => {
  // If we're still loading or no data is available, show loading state
  if (isLoading || !marketingData) {
    return (
      <Card>
        <div className="animate-pulse flex flex-col h-full">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  // Calculate ROAS: Revenue / Ad Spend
  const totalRevenue = marketingData.campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
  const totalSpend = marketingData.campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  const roas = totalRevenue / totalSpend;

  // Calculate previous period ROAS for comparison
  let previousRoas = 0;
  let roasChange = 0;
  let isPositiveChange = true;

  if (previousPeriodData && previousPeriodData.campaigns) {
    const prevRevenue = previousPeriodData.campaigns.reduce((sum, campaign) => sum + campaign.revenue, 0);
    const prevSpend = previousPeriodData.campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
    previousRoas = prevRevenue / prevSpend;
    
    roasChange = ((roas - previousRoas) / previousRoas) * 100;
    isPositiveChange = roasChange >= 0;
  }

  // Determine card color based on ROAS value
  const getColorClass = (roasValue) => {
    if (roasValue >= 4) return 'bg-green-100 text-green-800'; // Excellent
    if (roasValue >= 2) return 'bg-blue-100 text-blue-800';   // Good
    if (roasValue >= 1) return 'bg-yellow-100 text-yellow-800'; // Fair
    return 'bg-red-100 text-red-800'; // Poor
  };

  const colorClass = getColorClass(roas);

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Return on Ad Spend</h3>
            <div className="flex items-baseline mt-1">
              <p className="text-3xl font-semibold text-gray-900">{roas.toFixed(2)}x</p>
              {previousRoas > 0 && (
                <p className={`ml-2 text-sm font-medium ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? '+' : ''}{roasChange.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
          <div className={`rounded-full p-2 ${colorClass}`}>
            {isPositiveChange ? 
              <TrendingUpIcon className="w-6 h-6" /> : 
              <TrendingDownIcon className="w-6 h-6" />
            }
          </div>
        </div>
        
        <div className="mt-1">
          <p className="text-sm text-gray-500">
            ${totalRevenue.toLocaleString()} revenue on ${totalSpend.toLocaleString()} spend
          </p>
          <p className="text-xs text-gray-400 mt-1">{period}</p>
        </div>
      </div>
    </Card>
  );
};

export default ROASMetricCard;