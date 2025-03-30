// src/components/marketing/ConversionFunnel.jsx
import React, { useMemo } from 'react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import Card from '../cards/Card';

const ConversionFunnel = ({ marketingData, isLoading = false }) => {
  // Calculate funnel metrics
  const funnelData = useMemo(() => {
    if (!marketingData) return [];

    // Aggregate campaign data
    const totalImpressions = marketingData.channelMetrics?.reduce(
      (sum, channel) => sum + (channel.impressions || 0), 
      0
    ) || 0;
    
    const totalClicks = marketingData.channelMetrics?.reduce(
      (sum, channel) => sum + (channel.clicks || 0), 
      0
    ) || 0;
    
    const totalConversions = marketingData.channelMetrics?.reduce(
      (sum, channel) => sum + (channel.conversions || 0), 
      0
    ) || 0;
    
    // Assume 40% of visitors view a product page
    const productViews = Math.round(totalClicks * 0.4);
    
    // Prepare funnel stages
    return [
      {
        id: 'impressions',
        name: 'Impressions',
        value: totalImpressions,
        percentage: 100,
        color: 'bg-blue-500'
      },
      {
        id: 'clicks',
        name: 'Clicks',
        value: totalClicks,
        percentage: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
        color: 'bg-blue-600',
        dropoff: totalImpressions > 0 ? 100 - ((totalClicks / totalImpressions) * 100) : 0
      },
      {
        id: 'productViews',
        name: 'Product Views',
        value: productViews,
        percentage: totalImpressions > 0 ? (productViews / totalImpressions) * 100 : 0,
        color: 'bg-blue-700',
        dropoff: totalClicks > 0 ? 100 - ((productViews / totalClicks) * 100) : 0
      },
      {
        id: 'conversions',
        name: 'Conversions',
        value: totalConversions,
        percentage: totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0,
        color: 'bg-blue-800',
        dropoff: productViews > 0 ? 100 - ((totalConversions / productViews) * 100) : 0
      }
    ];
  }, [marketingData]);

  // Format large numbers
  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-14 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Conversion Funnel</h3>
            <p className="text-sm text-gray-500">Visitor progression from impressions to conversions</p>
          </div>
        </div>

        <div className="space-y-4">
          {funnelData.map((stage, index) => (
            <div key={stage.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {formatNumber(stage.value)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formatPercentage(stage.percentage)})
                  </span>
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="overflow-hidden h-3 text-xs flex rounded bg-gray-100">
                  <div
                    style={{ width: `${stage.percentage}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${stage.color}`}
                  ></div>
                </div>
              </div>
              
              {index < funnelData.length - 1 && (
                <div className="mt-1 flex justify-center">
                  <div className="flex flex-col items-center">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    {stage.dropoff && (
                      <span className="text-xs text-gray-500">
                        {formatPercentage(stage.dropoff)} drop off
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Conversion rate summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Click-through Rate</p>
              <p className="text-lg font-medium text-gray-900">
                {formatPercentage(funnelData[1]?.percentage || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-lg font-medium text-gray-900">
                {formatPercentage((funnelData[3]?.value / funnelData[1]?.value) * 100 || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConversionFunnel;