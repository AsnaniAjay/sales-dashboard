// src/context/DashboardContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import useSalesData from '../hooks/useSalesData';
import useFilters from '../hooks/useFilters';
import useDateRange from '../hooks/useDateRange';

// Create the context
const DashboardContext = createContext();

/**
 * Provider component that wraps your app and makes dashboard data available to any
 * child component that calls the useDashboard() hook.
 */
export const DashboardProvider = ({ children }) => {
  // Initialize the date range - default to last 30 days
  const dateRangeHook = useDateRange();
  
  // Initialize filters with the date range - using a stable initial value
  const initialFilters = useMemo(() => ({
    startDate: dateRangeHook.dateRange.startDate,
    endDate: dateRangeHook.dateRange.endDate
  }), []); // Empty dependency array - only set this once on initial render
  
  const filtersHook = useFilters(initialFilters);
  
  // Initialize sales data with filters - use useMemo to prevent passing a new object on every render
  const currentFilters = useMemo(() => filtersHook.filters, [filtersHook.filters]);
  const salesDataHook = useSalesData(currentFilters);
  
  // Time period comparison - Calculate previous period data
  const [comparisonData, setComparisonData] = useState({
    previousPeriodSales: [],
    percentChange: {
      totalSales: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    }
  });
  
  // Update filters when date range changes - using useCallback for stability
  const updateDateFilters = useCallback(() => {
    filtersHook.updateFilters({
      startDate: dateRangeHook.dateRange.startDate,
      endDate: dateRangeHook.dateRange.endDate
    });
  }, [dateRangeHook.dateRange.startDate, dateRangeHook.dateRange.endDate, filtersHook.updateFilters]);
  
  // Use this callback in a proper effect with correct dependencies
  useEffect(() => {
    updateDateFilters();
  }, [updateDateFilters]);
  
  // Calculate comparison data
  useEffect(() => {
    if (!salesDataHook.salesData.length || !dateRangeHook.dateRange.startDate || !dateRangeHook.dateRange.endDate) {
      return;
    }
    
    // Get current stats first to avoid repeated calculations
    const currentStats = salesDataHook.calculateSummary();
    if (!currentStats) return;
    
    // Calculate previous period date range (same duration, immediately before)
    const currentStartDate = new Date(dateRangeHook.dateRange.startDate);
    const currentEndDate = new Date(dateRangeHook.dateRange.endDate);
    
    // Safety check for valid dates
    if (isNaN(currentStartDate.getTime()) || isNaN(currentEndDate.getTime())) {
      console.warn('Invalid date range detected');
      return;
    }
    
    const periodDuration = currentEndDate - currentStartDate;
    
    const previousEndDate = new Date(currentStartDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setTime(previousEndDate.getTime() - periodDuration);
    
    // Format dates to match the filter format
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    // Filter sales data for previous period
    const previousPeriodSales = salesDataHook.salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= previousStartDate && saleDate <= previousEndDate;
    });
    
    // Calculate previous period metrics
    const previousTotalSales = previousPeriodSales.length;
    const previousTotalRevenue = previousPeriodSales.reduce((sum, sale) => sum + sale.amount, 0);
    const previousAvgOrderValue = previousPeriodSales.length ? previousTotalRevenue / previousPeriodSales.length : 0;
    
    // Calculate percent changes
    const calculatePercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };
    
    setComparisonData({
      previousPeriodSales,
      previousPeriodRange: {
        startDate: formatDate(previousStartDate),
        endDate: formatDate(previousEndDate)
      },
      percentChange: {
        totalSales: calculatePercentChange(currentStats.totalSales, previousTotalSales),
        totalRevenue: calculatePercentChange(currentStats.totalRevenue, previousTotalRevenue),
        averageOrderValue: calculatePercentChange(currentStats.averageOrderValue, previousAvgOrderValue)
      }
    });
  }, [salesDataHook.salesData, dateRangeHook.dateRange.startDate, dateRangeHook.dateRange.endDate]);
  
  // Format currency helper - define outside of memoized functions for stability
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);
  
  // Derived metrics and summaries
  const dashboardMetrics = useMemo(() => {
    if (!salesDataHook.filteredData || !salesDataHook.filteredData.length) {
      return {
        summary: { totalSales: 0, totalRevenue: 0, averageOrderValue: 0 },
        dailySales: [],
        monthlySales: [],
        salesRepPerformance: [],
        insights: []
      };
    }
    
    const summary = salesDataHook.calculateSummary();
    
    // Calculate additional metrics
    const salesByDay = {};
    const salesByMonth = {};
    const salesByRep = {};
    
    salesDataHook.filteredData.forEach(sale => {
      // Skip if no valid date
      if (!sale.date) return;
      
      // Group by day
      const day = sale.date.split('T')[0];
      if (!salesByDay[day]) {
        salesByDay[day] = {
          day,
          count: 0,
          revenue: 0
        };
      }
      salesByDay[day].count += 1;
      salesByDay[day].revenue += sale.amount || 0;
      
      // Group by month
      const month = day.substring(0, 7); // YYYY-MM format
      if (!salesByMonth[month]) {
        salesByMonth[month] = {
          month,
          count: 0,
          revenue: 0
        };
      }
      salesByMonth[month].count += 1;
      salesByMonth[month].revenue += sale.amount || 0;
      
      // Group by sales rep
      if (sale.salesRep && !salesByRep[sale.salesRep]) {
        salesByRep[sale.salesRep] = {
          name: sale.salesRep,
          count: 0,
          revenue: 0
        };
      }
      if (sale.salesRep) {
        salesByRep[sale.salesRep].count += 1;
        salesByRep[sale.salesRep].revenue += sale.amount || 0;
      }
    });
    
    // Convert objects to arrays
    const dailySales = Object.values(salesByDay).sort((a, b) => a.day.localeCompare(b.day));
    const monthlySales = Object.values(salesByMonth).sort((a, b) => a.month.localeCompare(b.month));
    const salesRepPerformance = Object.values(salesByRep).sort((a, b) => b.revenue - a.revenue);
    
    // Generate insights
    const insights = [];
    
    // Top performing category
    if (summary && summary.salesByCategory && Object.keys(summary.salesByCategory).length) {
      const topCategory = Object.entries(summary.salesByCategory)
        .sort(([, a], [, b]) => b - a)[0];
      
      insights.push({
        type: 'positive',
        title: 'Top Performing Category',
        description: `${topCategory[0]} is your top performing category with ${formatCurrency(topCategory[1])} in sales.`
      });
    }
    
    // Revenue trend
    if (dailySales.length >= 2) {
      const recentDays = dailySales.slice(-5);
      const trend = recentDays[recentDays.length - 1].revenue - recentDays[0].revenue;
      
      insights.push({
        type: trend >= 0 ? 'positive' : 'warning',
        title: 'Recent Revenue Trend',
        description: `Revenue has ${trend >= 0 ? 'increased' : 'decreased'} by ${formatCurrency(Math.abs(trend))} over the last 5 days.`
      });
    }
    
    // Top performing sales rep
    if (salesRepPerformance.length) {
      const topRep = salesRepPerformance[0];
      
      insights.push({
        type: 'info',
        title: 'Top Sales Rep',
        description: `${topRep.name} is your top performer with ${formatCurrency(topRep.revenue)} in sales.`
      });
    }
    
    // Compare with previous period
    if (comparisonData.percentChange) {
      const revenueChange = comparisonData.percentChange.totalRevenue;
      
      insights.push({
        type: revenueChange >= 0 ? 'positive' : 'negative',
        title: 'Period Comparison',
        description: `Revenue has ${revenueChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(revenueChange).toFixed(1)}% compared to previous period.`
      });
    }
    
    return {
      summary,
      dailySales,
      monthlySales,
      salesRepPerformance,
      insights
    };
  }, [salesDataHook.filteredData, salesDataHook.calculateSummary, comparisonData.percentChange, formatCurrency]);
  
  // Available filter options derived from data
  const filterOptions = useMemo(() => {
    const salesData = salesDataHook.salesData || [];
    if (!salesData.length) return {
      categories: [],
      regions: [],
      salesReps: [],
      paymentMethods: []
    };
    
    // Get unique categories
    const categories = [...new Set(salesData.map(sale => sale.category).filter(Boolean))];
    
    // Get unique regions
    const regions = [...new Set(salesData.map(sale => sale.region).filter(Boolean))];
    
    // Get unique sales reps
    const salesReps = [...new Set(salesData.map(sale => sale.salesRep).filter(Boolean))];
    
    // Get unique payment methods
    const paymentMethods = [...new Set(salesData.map(sale => sale.paymentMethod).filter(Boolean))];
    
    return {
      categories,
      regions,
      salesReps,
      paymentMethods
    };
  }, [salesDataHook.salesData]);
  
  // Create a stable value object with useMemo
  const contextValue = useMemo(() => ({
    // Data
    salesData: salesDataHook.salesData,
    filteredData: salesDataHook.filteredData,
    productData: salesDataHook.productData,
    customerData: salesDataHook.customerData,
    comparisonData,
    metrics: dashboardMetrics,
    filterOptions,
    
    // State
    isLoading: salesDataHook.isLoading,
    error: salesDataHook.error,
    filters: filtersHook.filters,
    dateRange: dateRangeHook.dateRange,
    
    // Methods
    fetchSalesData: salesDataHook.fetchSalesData,
    updateFilters: filtersHook.updateFilters,
    resetFilters: filtersHook.resetFilters,
    setFilter: filtersHook.setFilter,
    toggleFilterValue: filtersHook.toggleFilterValue,
    hasActiveFilters: filtersHook.hasActiveFilters,
    setCustomDateRange: dateRangeHook.setCustomRange,
    setPresetDateRange: dateRangeHook.setPresetRange,
    clearDateRange: dateRangeHook.clearDateRange,
    getDateRangeDisplayText: dateRangeHook.getDisplayText,
    DATE_RANGES: dateRangeHook.DATE_RANGES
  }), [
    salesDataHook.salesData,
    salesDataHook.filteredData, 
    salesDataHook.productData,
    salesDataHook.customerData,
    salesDataHook.isLoading,
    salesDataHook.error,
    salesDataHook.fetchSalesData,
    comparisonData,
    dashboardMetrics,
    filterOptions,
    filtersHook.filters,
    filtersHook.updateFilters,
    filtersHook.resetFilters,
    filtersHook.setFilter,
    filtersHook.toggleFilterValue,
    filtersHook.hasActiveFilters,
    dateRangeHook.dateRange,
    dateRangeHook.setCustomRange,
    dateRangeHook.setPresetRange,
    dateRangeHook.clearDateRange,
    dateRangeHook.getDisplayText,
    dateRangeHook.DATE_RANGES
  ]);
  
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Custom hook to use the dashboard context
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext;