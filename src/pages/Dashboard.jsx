// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/cards/StatCard';
import KpiCard from '../components/cards/KpiCard';
import InsightCard from '../components/cards/InsightCard';
import DateRangePicker from '../components/filters/DateRangePicker';
import CategoryFilter from '../components/filters/CategoryFilter';
import RevenueChart from '../components/charts/RevenueChart';
import SalesByCategoryChart from '../components/charts/SalesByCategoryChart';
import OrderTrendsChart from '../components/charts/OrderTrendsChart';
import PieChart from '../components/charts/PieChart';
import SalesTable from '../components/tables/SalesTable';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon 
} from '@heroicons/react/outline';

const Dashboard = () => {
  const { 
    filteredData, 
    metrics, 
    isLoading, 
    dateRange,
    filters,
    comparisonData,
    setCustomDateRange,
    setPresetDateRange,
    updateFilters,
    filterOptions,
    DATE_RANGES
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setCustomDateRange(range.startDate, range.endDate);
  };
  
  // Handle category filter change
  const handleCategoryChange = (selectedCategories) => {
    updateFilters({ categories: selectedCategories });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Sales Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track and analyze your sales performance
        </p>
      </div>
      
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-2">
          <DateRangePicker 
            onChange={handleDateRangeChange}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
          />
        </div>
        <div>
          <CategoryFilter 
            categories={filterOptions.categories || []}
            selectedCategories={filters.categories || []}
            onChange={handleCategoryChange}
          />
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={metrics?.summary?.totalRevenue}
          change={comparisonData?.percentChange?.totalRevenue}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />}
          color="blue"
          format="currency"
          isLoading={isLoading}
        />
        <KpiCard
          title="Total Orders"
          value={metrics?.summary?.totalSales}
          change={comparisonData?.percentChange?.totalSales}
          icon={<ShoppingBagIcon className="h-6 w-6 text-green-600" />}
          color="green"
          format="number"
          isLoading={isLoading}
        />
        <KpiCard
          title="Average Order Value"
          value={metrics?.summary?.averageOrderValue}
          change={comparisonData?.percentChange?.averageOrderValue}
          icon={<ChartBarIcon className="h-6 w-6 text-purple-600" />}
          color="purple"
          format="currency"
          isLoading={isLoading}
        />
        <KpiCard
          title="Active Customers"
          value={metrics?.summary?.topCustomers?.length || 0}
          change={10.5} // Example change
          icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
          color="blue"
          format="number"
          isLoading={isLoading}
        />
      </div>
      
      {/* Charts - First Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueChart 
          data={filteredData} 
          timeframe="monthly" 
        />
        <OrderTrendsChart 
          data={filteredData} 
          timeframe="weekly" 
        />
      </div>
      
      {/* Charts - Second Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesByCategoryChart data={filteredData} />
        </div>
        <div>
          {filterOptions.categories && (
            <PieChart 
              data={Object.entries(metrics?.summary?.salesByCategory || {}).map(([name, value]) => ({ 
                name, value 
              }))}
              dataKey="value"
              nameKey="name"
              title="Sales by Category"
              description="Distribution of sales revenue across product categories"
              donut={true}
            />
          )}
        </div>
      </div>
      
      {/* Insights */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Insights</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics?.insights?.map((insight, index) => (
            <InsightCard
              key={index}
              title={insight.title}
              description={insight.description}
              type={insight.type}
            />
          ))}
        </div>
      </div>
      
      {/* Recent Sales */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Recent Sales</h2>
        <SalesTable 
          data={filteredData.slice(0, 50)} // Show only the most recent 50 sales
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;