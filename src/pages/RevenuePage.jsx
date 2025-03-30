// src/pages/RevenuePage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import RevenueKPIs from '../components/revenue/RevenueKPIs';
import RevenueBreakdown from '../components/revenue/RevenueBreakdown';
import RevenueForecast from '../components/revenue/RevenueForecast';
import ProfitabilityAnalysis from '../components/revenue/ProfitabilityAnalysis';
import RevenueCalendar from '../components/revenue/RevenueCalendar';
import PaymentMethodAnalysis from '../components/revenue/PaymentMethodAnalysis';
import DateRangePicker from '../components/filters/DateRangePicker';
import Button from '../components/ui/Button';
import { FaDownload, FaFilter } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext';

const RevenuePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const dataLoadedRef = useRef(false);
  
  // Get dashboard context
  const { 
    salesData, 
    filteredData, 
    filters, 
    updateFilters, 
    resetFilters,
    fetchSalesData,
    isLoading: contextLoading
  } = useDashboard();
  
  // Mock cost data (in a real app, this would be from API/context)
  const [costData, setCostData] = useState([]);
  
  // Fetch sales data on mount - only once
  useEffect(() => {
    const loadData = async () => {
      if (dataLoadedRef.current) return;
      
      setIsLoading(true);
      try {
        await fetchSalesData();
        
        // Generate mock cost data only once to avoid re-renders
        if (salesData && salesData.length > 0 && !dataLoadedRef.current) {
          const mockCosts = generateMockCostData(salesData);
          setCostData(mockCosts);
          dataLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Error loading revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [fetchSalesData]);
  
  // Generate mock cost data once when salesData is available
  useEffect(() => {
    if (salesData && salesData.length > 0 && !dataLoadedRef.current) {
      const mockCosts = generateMockCostData(salesData);
      setCostData(mockCosts);
      dataLoadedRef.current = true;
      setIsLoading(false);
    }
  }, [salesData]);
  
  // Generate mock cost data for demo purposes
  const generateMockCostData = useCallback((sales) => {
    if (!sales || !sales.length) return [];
    
    return sales.map(sale => {
      // Use a deterministic random factor based on the sale id to ensure stable results
      const idHash = sale.id ? 
        sale.id.toString().split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0) : 0;
      
      // Create a stable cost percentage between 40-70%
      const seedValue = Math.abs(idHash) / 100000000;
      const costPercentage = 0.4 + (seedValue * 0.3);
      
      // Get a consistent cost type
      const types = ['COGS', 'Marketing', 'Operations', 'Personnel', 'Other'];
      const typeIndex = Math.abs(idHash) % types.length;
      
      return {
        id: `cost-${sale.id}`,
        saleId: sale.id,
        date: sale.date,
        amount: sale.amount * costPercentage,
        category: sale.category,
        type: types[typeIndex]
      };
    });
  }, []);
  
  // Handle date range change - use memoized function to avoid recreating on each render
  const handleDateRangeChange = useCallback(({ startDate, endDate }) => {
    // Skip if dates haven't changed
    if (startDate === filters.startDate && endDate === filters.endDate) {
      return;
    }
    
    updateFilters({
      startDate,
      endDate
    });
  }, [filters.startDate, filters.endDate, updateFilters]);
  
  // Toggle filters visibility
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);
  
  // Handle export
  const handleExport = useCallback(() => {
    if (!filteredData || filteredData.length === 0) {
      alert('No data to export');
      return;
    }
    
    // Create a CSV content from the filtered data
    // Get headers from the first item
    const headers = Object.keys(filteredData[0]).join(',');
    
    // Convert each item to CSV row
    const csvRows = filteredData.map(item => {
      return Object.values(item)
        .map(value => {
          if (value === null || value === undefined) return '';
          // Handle strings with commas by wrapping in quotes
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        })
        .join(',');
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'revenue_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredData]);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Revenue Analysis</h1>
            <p className="mt-1 text-sm text-gray-600">
              Detailed insights into your business revenue and profitability
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              icon={<FaFilter className="h-4 w-4" />}
              iconPosition="left"
              onClick={toggleFilters}
            >
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              icon={<FaDownload className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <DateRangePicker 
                initialStartDate={filters.startDate}
                initialEndDate={filters.endDate}
                onChange={handleDateRangeChange}
              />
            </div>
            <div className="md:col-span-2 flex items-end justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {(isLoading || contextLoading) ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPIs Section */}
          <RevenueKPIs salesData={filteredData || []} period="monthly" />
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <RevenueBreakdown salesData={filteredData || []} />
            
            {/* Revenue Forecast */}
            <RevenueForecast salesData={filteredData || []} forecastMonths={6} />
          </div>
          
          {/* Profitability Analysis */}
          <ProfitabilityAnalysis salesData={filteredData || []} costData={costData || []} />
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Calendar */}
            <RevenueCalendar salesData={filteredData || []} />
            
            {/* Payment Method Analysis */}
            <PaymentMethodAnalysis salesData={filteredData || []} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RevenuePage;