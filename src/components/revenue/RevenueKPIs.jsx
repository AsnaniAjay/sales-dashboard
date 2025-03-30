// src/components/revenue/RevenueKPIs.jsx
import React, { useMemo } from 'react';
import { FaChartLine, FaCalendarAlt, FaUserFriends, FaPercentage } from 'react-icons/fa';
import KpiCard from '../cards/KpiCard';

const RevenueKPIs = ({ salesData = [], period = 'monthly' }) => {
  // Memoize calculations to avoid recomputing on every render
  const metrics = useMemo(() => {
    if (!salesData || !salesData.length) {
      return {
        totalRevenue: 0,
        recurringRevenue: 0,
        growth: 0,
        avgRevenuePerCustomer: 0
      };
    }

    // Calculate total revenue
    const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.amount || 0), 0);
    
    // Calculate recurring revenue (MRR/ARR)
    const recurringRevenue = period === 'monthly' 
      ? totalRevenue / (salesData.length > 30 ? salesData.length / 30 : 1) 
      : totalRevenue * 12;
    
    // Calculate growth (comparing recent period to previous period)
    let growth = 0;
    if (salesData.length > 1) {
      // Sort data by date
      const sortedData = [...salesData].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Split into two equal periods
      const midpoint = Math.floor(sortedData.length / 2);
      const previousPeriod = sortedData.slice(0, midpoint);
      const recentPeriod = sortedData.slice(midpoint);
      
      const previousRevenue = previousPeriod.reduce((sum, sale) => sum + (sale.amount || 0), 0);
      const recentRevenue = recentPeriod.reduce((sum, sale) => sum + (sale.amount || 0), 0);
      
      // Calculate growth percentage
      growth = previousRevenue === 0 
        ? 100 
        : ((recentRevenue - previousRevenue) / previousRevenue) * 100;
    }
    
    // Calculate average revenue per customer
    const uniqueCustomers = new Set(salesData.map(sale => sale.customerId || sale.customer));
    const avgRevenuePerCustomer = uniqueCustomers.size > 0 
      ? totalRevenue / uniqueCustomers.size 
      : totalRevenue;

    return {
      totalRevenue,
      recurringRevenue,
      growth,
      avgRevenuePerCustomer
    };
  }, [salesData, period]);

  // Descriptive text for recurring revenue
  const recurringRevenueText = period === 'monthly' ? 'Monthly Recurring Revenue' : 'Annual Recurring Revenue';
  const recurringRevenueAbbr = period === 'monthly' ? 'MRR' : 'ARR';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Total Revenue"
        value={metrics.totalRevenue}
        icon={<FaChartLine className="h-6 w-6 text-blue-600" />}
        color="blue"
        format="currency"
      />
      
      <KpiCard
        title={recurringRevenueText}
        value={metrics.recurringRevenue}
        changeText={recurringRevenueAbbr}
        icon={<FaCalendarAlt className="h-6 w-6 text-green-600" />}
        color="green"
        format="currency"
      />
      
      <KpiCard
        title="Revenue Growth"
        value={metrics.growth}
        icon={<FaPercentage className="h-6 w-6 text-purple-600" />}
        color="purple"
        format="percentage"
      />
      
      <KpiCard
        title="Avg. Revenue Per Customer"
        value={metrics.avgRevenuePerCustomer}
        icon={<FaUserFriends className="h-6 w-6 text-orange-600" />}
        color="orange"
        format="currency"
      />
    </div>
  );
};

export default RevenueKPIs;