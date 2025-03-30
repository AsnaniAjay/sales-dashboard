// src/hooks/useSalesData.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to fetch and manage sales data
 * 
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Sales data, loading state, error state, and methods to fetch and filter data
 */
const useSalesData = (initialFilters = {}) => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use a ref to track filters to avoid unnecessary re-renders
  const filtersRef = useRef(initialFilters);
  const [filters, setFilters] = useState(initialFilters);
  
  // Track if data has been loaded to prevent duplicate fetches
  const dataLoadedRef = useRef(false);

  // Function to fetch sales data
  const fetchSalesData = useCallback(async () => {
    // Prevent duplicate fetches
    if (dataLoadedRef.current && salesData.length > 0) {
      return { success: true, data: salesData };
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch sales data
      const salesResponse = await fetch('/mock-data/sales.json');
      if (!salesResponse.ok) throw new Error('Failed to fetch sales data');
      const salesResult = await salesResponse.json();

      // Fetch product data
      const productsResponse = await fetch('/mock-data/products.json');
      if (!productsResponse.ok) throw new Error('Failed to fetch product data');
      const productsResult = await productsResponse.json();

      // Fetch customer data
      const customersResponse = await fetch('/mock-data/customers.json');
      if (!customersResponse.ok) throw new Error('Failed to fetch customer data');
      const customersResult = await customersResponse.json();

      // Set data
      const salesArray = salesResult.sales || [];
      setSalesData(salesArray);
      setProductData(productsResult.products || []);
      setCustomerData(customersResult.customers || []);
      
      // Set initially filtered data
      setFilteredData(salesArray);
      
      // Mark data as loaded
      dataLoadedRef.current = true;
      
      return { success: true, data: salesArray };
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies to avoid re-creation

  // Fetch data on mount only once
  useEffect(() => {
    if (!dataLoadedRef.current) {
      fetchSalesData();
    }
  }, [fetchSalesData]);

  // Update internal filters when the prop changes
  useEffect(() => {
    // Skip if filters didn't meaningfully change
    if (JSON.stringify(filtersRef.current) === JSON.stringify(initialFilters)) {
      return;
    }
    
    filtersRef.current = initialFilters;
    setFilters(initialFilters);
  }, [initialFilters]);

  // Apply filters when filters or salesData change
  useEffect(() => {
    if (!salesData.length) return;
    
    let result = [...salesData];

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999); // Include the end date fully

      result = result.filter(sale => {
        if (!sale.date) return false;
        const saleDate = new Date(sale.date);
        return saleDate >= start && saleDate <= end;
      });
    }

    // Apply category filter
    if (filters.categories && filters.categories.length) {
      result = result.filter(sale => 
        sale.category && filters.categories.includes(sale.category)
      );
    }

    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(sale =>
        (sale.customer && sale.customer.toLowerCase().includes(searchLower)) ||
        (sale.product && sale.product.toLowerCase().includes(searchLower)) ||
        (sale.salesRep && sale.salesRep.toLowerCase().includes(searchLower)) ||
        (sale.category && sale.category.toLowerCase().includes(searchLower)) ||
        (sale.region && sale.region.toLowerCase().includes(searchLower))
      );
    }

    // Apply region filter
    if (filters.regions && filters.regions.length) {
      result = result.filter(sale => 
        sale.region && filters.regions.includes(sale.region)
      );
    }

    // Apply salesRep filter
    if (filters.salesReps && filters.salesReps.length) {
      result = result.filter(sale => 
        sale.salesRep && filters.salesReps.includes(sale.salesRep)
      );
    }

    // Apply payment method filter
    if (filters.paymentMethods && filters.paymentMethods.length) {
      result = result.filter(sale => 
        sale.paymentMethod && filters.paymentMethods.includes(sale.paymentMethod)
      );
    }

    setFilteredData(result);
  }, [salesData, filters]);

  // Update filters - use a separate function to avoid creating a new ref on each render
  const updateFilters = useCallback((newFilters) => {
    // Skip if no changes
    if (!newFilters || Object.keys(newFilters).length === 0) return;
    
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      filtersRef.current = updatedFilters;
      return updatedFilters;
    });
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    filtersRef.current = initialFilters;
    setFilters(initialFilters);
  }, [initialFilters]);

  // Memoize the summary calculation to avoid recalculating on every render
  const summaryRef = useRef({
    totalSales: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    salesByCategory: {},
    salesByRegion: {},
    topProducts: [],
    topCustomers: []
  });
  
  // Calculate summary statistics
  const calculateSummary = useCallback(() => {
    // Return cached summary if filtered data hasn't changed
    if (filteredData === summaryRef.current.data) {
      return summaryRef.current.summary;
    }
    
    if (!filteredData.length) {
      const emptySummary = {
        totalSales: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        salesByCategory: {},
        salesByRegion: {},
        topProducts: [],
        topCustomers: []
      };
      summaryRef.current = { data: filteredData, summary: emptySummary };
      return emptySummary;
    }

    // Calculate total sales and revenue
    const totalSales = filteredData.length;
    const totalRevenue = filteredData.reduce((sum, sale) => sum + (sale.amount || 0), 0);
    const averageOrderValue = totalRevenue / totalSales;

    // Group sales by category
    const salesByCategory = filteredData.reduce((acc, sale) => {
      if (!sale.category) return acc;
      acc[sale.category] = (acc[sale.category] || 0) + (sale.amount || 0);
      return acc;
    }, {});

    // Group sales by region
    const salesByRegion = filteredData.reduce((acc, sale) => {
      if (!sale.region) return acc;
      acc[sale.region] = (acc[sale.region] || 0) + (sale.amount || 0);
      return acc;
    }, {});

    // Get top products
    const productSales = {};
    filteredData.forEach(sale => {
      if (!sale.product) return;
      productSales[sale.product] = (productSales[sale.product] || 0) + (sale.amount || 0);
    });

    const topProducts = Object.entries(productSales)
      .map(([product, amount]) => ({ product, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Get top customers
    const customerSales = {};
    filteredData.forEach(sale => {
      if (!sale.customer) return;
      customerSales[sale.customer] = (customerSales[sale.customer] || 0) + (sale.amount || 0);
    });

    const topCustomers = Object.entries(customerSales)
      .map(([customer, amount]) => ({ customer, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const summary = {
      totalSales,
      totalRevenue,
      averageOrderValue,
      salesByCategory,
      salesByRegion,
      topProducts,
      topCustomers
    };
    
    // Cache the summary result
    summaryRef.current = { data: filteredData, summary };
    return summary;
  }, [filteredData]);

  return {
    // Data
    salesData,
    filteredData,
    productData,
    customerData,
    
    // State
    isLoading,
    error,
    filters,
    
    // Methods
    fetchSalesData,
    updateFilters,
    resetFilters,
    calculateSummary
  };
};

export default useSalesData;