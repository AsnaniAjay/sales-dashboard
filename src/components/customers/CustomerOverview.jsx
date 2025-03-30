// src/components/customers/CustomerOverview.jsx
import React from 'react';
import { FaUsers, FaUserPlus, FaWallet, FaChartLine } from 'react-icons/fa';
import KpiCard from '../cards/KpiCard';

const CustomerOverview = ({ data, groups = [] }) => {
  // Calculate metrics from data
  const totalCustomers = data?.length || 0;
  const activeCustomers = data?.filter(customer => customer.status === 'active')?.length || 0;
  const inactiveRate = totalCustomers ? ((totalCustomers - activeCustomers) / totalCustomers * 100).toFixed(1) : 0;
  
  // Calculate average lifetime value
  const avgLifetimeValue = totalCustomers
    ? data.reduce((sum, customer) => sum + customer.lifetimeValue, 0) / totalCustomers
    : 0;
  
  // Calculate new customers (joined in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newCustomers = data?.filter(customer => {
    const joinDate = new Date(customer.joinDate);
    return joinDate >= thirtyDaysAgo;
  })?.length || 0;
  
  const newCustomerRate = totalCustomers ? (newCustomers / totalCustomers * 100).toFixed(1) : 0;

  // Calculate overall growth rate if customer groups are available
  let overallGrowthRate = 0;
  if (groups && groups.length > 0) {
    // Calculate weighted average growth rate based on revenue
    const totalRevenue = groups.reduce((sum, group) => sum + group.totalRevenue, 0);
    overallGrowthRate = groups.reduce((weightedSum, group) => {
      return weightedSum + (group.totalRevenue / totalRevenue) * group.growthRate;
    }, 0);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Customers"
        value={totalCustomers}
        change={newCustomerRate}
        changeText={`+${newCustomers} this month`}
        icon={<FaUsers className="h-6 w-6 text-indigo-600" />}
        color="blue"
        format="number"
      />
      
      <KpiCard
        title="Active Customers"
        value={activeCustomers}
        change={-inactiveRate}
        changeText={`${(100 - inactiveRate).toFixed(1)}% active rate`}
        icon={<FaUserPlus className="h-6 w-6 text-green-600" />}
        color="green"
        format="number"
      />
      
      <KpiCard
        title="Avg. Lifetime Value"
        value={avgLifetimeValue}
        change={overallGrowthRate || 5.2} // Use calculated growth rate or fallback
        icon={<FaWallet className="h-6 w-6 text-purple-600" />}
        color="purple"
        format="currency"
      />
      
      <KpiCard
        title="Retention Rate"
        value={92.7} // This would typically come from actual retention calculations
        change={1.3}  // This would typically come from historical data
        icon={<FaChartLine className="h-6 w-6 text-blue-600" />}
        color="blue"
        format="percentage"
      />
    </div>
  );
};

export default CustomerOverview;