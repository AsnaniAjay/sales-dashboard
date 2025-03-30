// src/components/marketing/ROASGoalTracker.jsx
import React, { useMemo } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import Card from '../cards/Card';

const ROASGoalTracker = ({ 
  marketingData, 
  goals = { below: 1, fair: 2, good: 3, excellent: 4 },
  isLoading = false
}) => {
  // Calculate overall ROAS
  const roas = useMemo(() => {
    if (!marketingData) return 0;
    
    const totalRevenue = marketingData.totalRevenue || 0;
    const totalSpend = marketingData.totalSpend || 0;
    
    return totalSpend > 0 ? totalRevenue / totalSpend : 0;
  }, [marketingData]);

  // Determine status based on ROAS value
  const getStatus = (roasValue) => {
    if (roasValue >= goals.excellent) return 'excellent';
    if (roasValue >= goals.good) return 'good';
    if (roasValue >= goals.fair) return 'fair';
    if (roasValue >= goals.below) return 'below';
    return 'critical';
  };

  const status = getStatus(roas);

  // Get status color and message
  const getStatusDetails = (statusValue) => {
    switch(statusValue) {
      case 'excellent':
        return {
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-100',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
          message: 'Excellent! Your ROAS is performing above target.'
        };
      case 'good':
        return {
          color: 'bg-blue-500',
          textColor: 'text-blue-700',
          bgColor: 'bg-blue-100',
          icon: <CheckCircleIcon className="h-5 w-5 text-blue-500" />,
          message: 'Good. Your ROAS is meeting expectations.'
        };
      case 'fair':
        return {
          color: 'bg-yellow-500',
          textColor: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />,
          message: 'Fair. Your ROAS is acceptable but could be improved.'
        };
      case 'below':
        return {
          color: 'bg-orange-500',
          textColor: 'text-orange-700',
          bgColor: 'bg-orange-100',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />,
          message: 'Below target. Consider optimizing your campaigns.'
        };
      case 'critical':
        return {
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-100',
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
          message: 'Critical. Your marketing spend is not generating positive returns.'
        };
      default:
        return {
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-100',
          icon: null,
          message: 'No data available.'
        };
    }
  };

  const statusDetails = getStatusDetails(status);

  // Calculate progress percentage for gauge
  const calculateProgressPercentage = () => {
    if (roas <= 0) return 0;
    if (roas >= goals.excellent) return 100;
    
    if (roas >= goals.good) {
      return 75 + (25 * (roas - goals.good) / (goals.excellent - goals.good));
    }
    
    if (roas >= goals.fair) {
      return 50 + (25 * (roas - goals.fair) / (goals.good - goals.fair));
    }
    
    if (roas >= goals.below) {
      return 25 + (25 * (roas - goals.below) / (goals.fair - goals.below));
    }
    
    return (25 * roas) / goals.below;
  };

  const progressPercentage = calculateProgressPercentage();

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse p-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">ROAS Goal Tracker</h3>
          <div className="text-right">
            <span className="text-xs text-gray-500">Current</span>
            <p className="text-xl font-semibold text-gray-900">{roas.toFixed(2)}x</p>
          </div>
        </div>

        {/* ROAS gauge visualization */}
        <div className="relative pt-1 mb-6">
          <div className="flex mb-2 justify-between">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-100">
              Critical
            </span>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-100">
              Below
            </span>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-100">
              Fair
            </span>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
              Good
            </span>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
              Excellent
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${progressPercentage}%` }} 
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${statusDetails.color} transition-all duration-500`}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>0x</span>
            <span>{goals.below}x</span>
            <span>{goals.fair}x</span>
            <span>{goals.good}x</span>
            <span>{goals.excellent}x+</span>
          </div>
        </div>

        {/* Status message */}
        <div className={`${statusDetails.bgColor} ${statusDetails.textColor} p-3 rounded-md mb-4 flex items-start`}>
          <div className="flex-shrink-0 mr-2">
            {statusDetails.icon}
          </div>
          <div>
            <p className="text-sm font-medium">{statusDetails.message}</p>
          </div>
        </div>

        {/* Tips based on status */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {status === 'excellent' && (
              <>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                  Maintain current strategies and continue monitoring
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                  Consider scaling top-performing campaigns
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                  Test new targeting options to improve efficiency further
                </li>
              </>
            )}
            
            {status === 'good' && (
              <>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Optimize budget allocation across campaigns
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Identify top-performing segments for targeted expansion
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Review creative assets for potential improvements
                </li>
              </>
            )}
            
            {status === 'fair' && (
              <>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></span>
                  Review audience targeting strategy
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></span>
                  Adjust bidding strategy to reduce costs
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></span>
                  Test new ad variants and messaging
                </li>
              </>
            )}
            
            {status === 'below' && (
              <>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></span>
                  Reduce spend on low-performing campaigns
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></span>
                  Review landing page conversion rates
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></span>
                  Analyze customer journey for friction points
                </li>
              </>
            )}
            
            {status === 'critical' && (
              <>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                  Pause underperforming campaigns immediately
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                  Re-evaluate target audience and messaging
                </li>
                <li className="text-xs text-gray-600 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                  Consider testing entirely new approaches
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ROASGoalTracker;