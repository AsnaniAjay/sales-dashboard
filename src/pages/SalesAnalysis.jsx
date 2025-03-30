import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FaChartBar, 
  FaChartPie, 
  FaTable, 
  FaDownload, 
  FaFilter 
} from 'react-icons/fa';

// Context and Utility Imports
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency } from '../utils/formatters';
import { 
  convertToTimeSeries, 
  groupByField, 
  sumByField 
} from '../utils/calculators';

// Component Imports
import DashboardLayout from '../components/layout/DashboardLayout';
import DateRangePicker from '../components/filters/DateRangePicker';
import CategoryFilter from '../components/filters/CategoryFilter';
import SearchFilter from '../components/filters/SearchFilter';
import RevenueChart from '../components/charts/RevenueChart';
import PieChart from '../components/charts/PieChart';
import SalesTable from '../components/tables/SalesTable';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';

const SalesAnalysis = () => {
  const { 
    filteredData, 
    dateRange,
    filters,
    updateFilters,
    filterOptions,
    setCustomDateRange,
    setPresetDateRange,
    DATE_RANGES
  } = useDashboard();
  
  const [activeView, setActiveView] = useState('overview');
  const [groupBy, setGroupBy] = useState('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ searchTerm });
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, updateFilters]);
  
  // Prepare data for region analysis
  const regionData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const groupedByRegion = groupByField(filteredData, 'region');
    
    return Object.entries(groupedByRegion).map(([region, sales]) => ({
      name: region,
      value: sumByField(sales, 'amount')
    }));
  }, [filteredData]);
  
  // Prepare data for sales rep analysis
  const salesRepData = useMemo(() => {
    if (!filteredData.length) return [];
    
    const groupedByRep = groupByField(filteredData, 'salesRep');
    
    return Object.entries(groupedByRep).map(([rep, sales]) => ({
      name: rep,
      value: sumByField(sales, 'amount')
    })).sort((a, b) => b.value - a.value);
  }, [filteredData]);
  
  // Prepare time series data
  const timeSeriesData = useMemo(() => {
    if (!filteredData.length) return [];
    
    // Extract dates only (YYYY-MM-DD)
    const formattedData = filteredData.map(sale => ({
      ...sale,
      date: sale.date.split('T')[0]
    }));
    
    return convertToTimeSeries(formattedData, 'date', 'amount', groupBy);
  }, [filteredData, groupBy]);
  
  // Event Handlers
  const handleDateRangeChange = (range) => {
    setCustomDateRange(range.startDate, range.endDate);
  };
  
  const handleCategoryChange = (selectedCategories) => {
    updateFilters({ categories: selectedCategories });
  };
  
  const handleRegionChange = (selectedRegions) => {
    updateFilters({ regions: selectedRegions });
  };

  // Tabs configuration
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FaChartBar className="h-4 w-4" />,
      content: (
        <div className="mt-4">
          <RevenueChart 
            data={filteredData} 
            timeframe="monthly" 
          />
        </div>
      )
    },
    {
      id: 'by-category',
      label: 'By Category',
      icon: <FaChartPie className="h-4 w-4" />,
      content: (
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChart 
            data={Object.entries(groupByField(filteredData, 'category')).map(([name, data]) => ({ 
              name, 
              value: sumByField(data, 'amount') 
            }))}
            dataKey="value"
            nameKey="name"
            title="Sales by Category"
            description="Distribution of sales across product categories"
          />
          <div className="max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Category Breakdown</h3>
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {Object.entries(groupByField(filteredData, 'category'))
                  .sort(([, a], [, b]) => sumByField(b, 'amount') - sumByField(a, 'amount'))
                  .map(([category, sales]) => (
                    <li key={category} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-indigo-600">{category}</p>
                        <p className="text-sm text-gray-900 font-semibold">{formatCurrency(sumByField(sales, 'amount'))}</p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Orders: {sales.length}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          Avg. Order: {formatCurrency(sumByField(sales, 'amount') / sales.length)}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'by-region',
      label: 'By Region',
      icon: <FaChartPie className="h-4 w-4" />,
      content: (
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChart 
            data={regionData}
            dataKey="value"
            nameKey="name"
            title="Sales by Region"
            description="Distribution of sales across geographic regions"
          />
          <div className="max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Regional Breakdown</h3>
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {regionData
                  .sort((a, b) => b.value - a.value)
                  .map(region => (
                    <li key={region.name} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-indigo-600">{region.name}</p>
                        <p className="text-sm text-gray-900 font-semibold">{formatCurrency(region.value)}</p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {((region.value / sumByField(regionData, 'value')) * 100).toFixed(1)}% of total sales
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'by-rep',
      label: 'By Rep',
      icon: <FaChartPie className="h-4 w-4" />,
      content: (
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PieChart 
            data={salesRepData.slice(0, 5)} // Top 5 sales reps
            dataKey="value"
            nameKey="name"
            title="Sales by Representative"
            description="Distribution of sales across top 5 sales representatives"
          />
          <div className="max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Sales Rep Performance</h3>
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {salesRepData.map(rep => (
                  <li key={rep.name} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-indigo-600">{rep.name}</p>
                      <p className="text-sm text-gray-900 font-semibold">{formatCurrency(rep.value)}</p>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {((rep.value / sumByField(salesRepData, 'value')) * 100).toFixed(1)}% of total sales
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'all-transactions',
      label: 'Transactions',
      icon: <FaTable className="h-4 w-4" />,
      content: (
        <div className="mt-4">
          <SalesTable data={filteredData} />
        </div>
      )
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales Analysis</h1>
          <p className="mt-1 text-sm text-gray-600">
            Detailed breakdown and analysis of your sales data
          </p>
        </div>
        {isMobile && (
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <FaFilter className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Desktop Filters */}
      {!isMobile && (
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
          <div>
            <SearchFilter 
              onSearch={setSearchTerm}
              placeholder="Search sales..."
              initialValue={searchTerm}
            />
          </div>
        </div>
      )}
      
      {/* Mobile Filter Drawer */}
      <Drawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filters"
      >
        <div className="space-y-4">
          <DateRangePicker 
            onChange={(range) => {
              handleDateRangeChange(range);
              setIsFilterDrawerOpen(false);
            }}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
          />
          <CategoryFilter 
            categories={filterOptions.categories || []}
            selectedCategories={filters.categories || []}
            onChange={(selectedCategories) => {
              handleCategoryChange(selectedCategories);
              setIsFilterDrawerOpen(false);
            }}
          />
          <SearchFilter 
            onSearch={(term) => {
              setSearchTerm(term);
              setIsFilterDrawerOpen(false);
            }}
            placeholder="Search sales..."
            initialValue={searchTerm}
          />
        </div>
      </Drawer>
      
      {/* Quick Date Filters */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <div className="flex flex-wrap gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-grow"
            onClick={() => setPresetDateRange(DATE_RANGES.LAST_30_DAYS)}
          >
            Last 30 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-grow"
            onClick={() => setPresetDateRange(DATE_RANGES.THIS_MONTH)}
          >
            This Month
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-grow"
            onClick={() => setPresetDateRange(DATE_RANGES.LAST_QUARTER)}
          >
            Last Quarter
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-grow"
            onClick={() => setPresetDateRange(DATE_RANGES.THIS_YEAR)}
          >
            This Year
          </Button>
        </div>
        
        <div className="w-full mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            icon={<FaDownload className="h-4 w-4" />}
            iconPosition="left"
          >
            Export Data
          </Button>
        </div>
      </div>
    {/* Analysis Tabs */}
    <Tabs 
        tabs={tabs}
        activeTab={activeView}
        onChange={setActiveView}
        variant="underline"
      />
    </DashboardLayout>
  );
};

export default SalesAnalysis;