// src/components/customers/CustomerSegmentation.jsx
import React from 'react';
import PieChart from '../charts/PieChart';

const CustomerSegmentation = ({ data, segmentBy = 'industry' }) => {
  // Process data for segmentation
  const getSegmentationData = () => {
    if (!data || !data.length) return [];
    
    const segments = {};
    data.forEach(customer => {
      const segmentValue = customer[segmentBy] || 'Unknown';
      if (!segments[segmentValue]) {
        segments[segmentValue] = {
          name: segmentValue,
          value: 0,
          customers: []
        };
      }
      segments[segmentValue].value += 1;
      segments[segmentValue].customers.push(customer);
    });
    
    return Object.values(segments).sort((a, b) => b.value - a.value);
  };

  const segmentationData = getSegmentationData();

  // Calculate segment-specific metrics
  const calculateSegmentMetrics = (segment) => {
    const customers = segment.customers;
    const totalLTV = customers.reduce((sum, customer) => sum + customer.lifetimeValue, 0);
    const avgLTV = customers.length ? totalLTV / customers.length : 0;
    const totalOrders = customers.reduce((sum, customer) => sum + customer.orderCount, 0);
    const avgOrders = customers.length ? totalOrders / customers.length : 0;
    
    return {
      totalLTV,
      avgLTV,
      totalOrders,
      avgOrders
    };
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Segmentation by {segmentBy.charAt(0).toUpperCase() + segmentBy.slice(1)}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-80">
          <PieChart 
            data={segmentationData}
            dataKey="value"
            nameKey="name"
            title=""
            description=""
            donut={true}
            showLabels={true}
          />
        </div>
        
        {/* Segment Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Segment Breakdown</h4>
          <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
            <ul className="divide-y divide-gray-200">
              {segmentationData.map((segment, index) => {
                const metrics = calculateSegmentMetrics(segment);
                return (
                  <li key={index} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{segment.name}</p>
                      <p className="text-sm text-gray-500">{segment.value} customers</p>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Avg LTV:</span> ${metrics.avgLTV.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </div>
                      <div>
                        <span className="font-medium">Avg Orders:</span> {metrics.avgOrders.toFixed(1)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentation;