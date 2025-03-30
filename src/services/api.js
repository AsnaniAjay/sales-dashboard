// src/services/api.js
/**
 * API service for fetching and processing sales dashboard data
 * 
 * For a hackathon project, we're using mock data from local JSON files.
 * In a production environment, these would be actual API calls to a backend server.
 */

// Helper function to simulate API delay (makes the loading state more realistic)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch sales data with optional filters
 * @param {Object} filters - Filters to apply to the data
 * @returns {Promise<Object>} Promise resolving to filtered sales data
 */
export const fetchSalesData = async (filters = {}) => {
  try {
    // In a real app, this would be an API call with filters in the query params
    // For the hackathon, we're fetching from a local JSON file
    const response = await fetch('/mock-data/sales.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sales data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Simulate API delay
    await delay(800);
    
    // Apply filters client-side (in a real app, this would happen on the server)
    let filteredData = [...(data.sales || [])];
    
    // Date range filter
    if (filters.startDate && filters.endDate) {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        
        // Set end date to end of day for inclusive comparison
        endDate.setHours(23, 59, 59, 999);
        
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.categories.includes(item.category)
      );
    }
    
    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.regions.includes(item.region)
      );
    }
    
    // Sales rep filter
    if (filters.salesReps && filters.salesReps.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.salesReps.includes(item.salesRep)
      );
    }
    
    // Payment method filter
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.paymentMethods.includes(item.paymentMethod)
      );
    }
    
    // Search filter (searches across multiple fields)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.product.toLowerCase().includes(searchLower) ||
        item.customer.toLowerCase().includes(searchLower) ||
        item.salesRep.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.region.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      data: filteredData
    };
  } catch (error) {
    console.error('Error fetching sales data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch sales data'
    };
  }
};

/**
 * Fetch product data with optional filters
 * @param {Object} filters - Filters to apply to the data
 * @returns {Promise<Object>} Promise resolving to filtered product data
 */
export const fetchProductData = async (filters = {}) => {
  try {
    const response = await fetch('/mock-data/products.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Simulate API delay
    await delay(600);
    
    // Apply filters client-side
    let filteredData = [...(data.products || [])];
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.categories.includes(item.category)
      );
    }
    
    // Product search filter
    if (filters.productSearchTerm) {
      const searchLower = filters.productSearchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter for trending products only
    if (filters.trendingOnly) {
      filteredData = filteredData.filter(item => item.trending);
    }
    
    // Filter by minimum margin
    if (filters.minMargin !== undefined) {
      filteredData = filteredData.filter(item => 
        item.profitMargin >= filters.minMargin
      );
    }
    
    // Filter by maximum margin
    if (filters.maxMargin !== undefined) {
      filteredData = filteredData.filter(item => 
        item.profitMargin <= filters.maxMargin
      );
    }
    
    return {
      success: true,
      data: filteredData
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch product data'
    };
  }
};

/**
 * Fetch customer data with optional filters
 * @param {Object} filters - Filters to apply to the data
 * @returns {Promise<Object>} Promise resolving to filtered customer data
 */
export const fetchCustomerData = async (filters = {}) => {
  try {
    const response = await fetch('/mock-data/customers.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch customer data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Simulate API delay
    await delay(700);
    
    // Apply filters client-side
    let filteredData = [...(data.customers || [])];
    
    // Region filter
    if (filters.regions && filters.regions.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.regions.includes(item.region)
      );
    }
    
    // Industry filter
    if (filters.industries && filters.industries.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.industries.includes(item.industry)
      );
    }
    
    // Customer size filter
    if (filters.sizes && filters.sizes.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.sizes.includes(item.size)
      );
    }
    
    // Customer status filter
    if (filters.status && filters.status.length > 0) {
      filteredData = filteredData.filter(item => 
        filters.status.includes(item.status)
      );
    }
    
    // Search filter
    if (filters.customerSearchTerm) {
      const searchLower = filters.customerSearchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(searchLower) ||
        item.contactPerson.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.industry.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by minimum lifetime value
    if (filters.minLifetimeValue !== undefined) {
      filteredData = filteredData.filter(item => 
        item.lifetimeValue >= filters.minLifetimeValue
      );
    }
    
    return {
      success: true,
      data: filteredData,
      // Include customer groups too
      groups: data.customerGroups || []
    };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch customer data'
    };
  }
};

/**
 * Get aggregated dashboard stats
 * @param {string} timeframe - Time period (today, week, month, year)
 * @returns {Promise<Object>} Promise resolving to dashboard stats
 */
export const fetchDashboardStats = async (timeframe = 'month') => {
  try {
    // In a real app, this would be a dedicated API endpoint
    // Here we'll calculate from our mock sales data
    const response = await fetch('/mock-data/sales.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sales data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const salesData = data.sales || [];
    
    // Simulate API delay
    await delay(900);
    
    // Filter by timeframe (today, week, month, year)
    const now = new Date();
    let filteredSales = [...salesData];
    
    if (timeframe === 'today') {
      const today = now.toISOString().split('T')[0];
      filteredSales = salesData.filter(sale => 
        sale.date.startsWith(today)
      );
    } else if (timeframe === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filteredSales = salesData.filter(sale => 
        new Date(sale.date) >= weekAgo
      );
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filteredSales = salesData.filter(sale => 
        new Date(sale.date) >= monthAgo
      );
    } // 'year' would use all data for this demo
    
    // Calculate aggregate stats
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalOrders = filteredSales.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Group by category
    const categorySales = {};
    filteredSales.forEach(sale => {
      categorySales[sale.category] = (categorySales[sale.category] || 0) + sale.amount;
    });
    
    // Group by region
    const regionSales = {};
    filteredSales.forEach(sale => {
      regionSales[sale.region] = (regionSales[sale.region] || 0) + sale.amount;
    });
    
    // Calculate top products
    const productSales = {};
    filteredSales.forEach(sale => {
      productSales[sale.product] = (productSales[sale.product] || 0) + sale.amount;
    });
    
    const topProducts = Object.entries(productSales)
      .map(([product, amount]) => ({ product, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Calculate top customers
    const customerSales = {};
    filteredSales.forEach(sale => {
      customerSales[sale.customer] = (customerSales[sale.customer] || 0) + sale.amount;
    });
    
    const topCustomers = Object.entries(customerSales)
      .map(([customer, amount]) => ({ customer, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Group by sales rep
    const salesRepData = {};
    filteredSales.forEach(sale => {
      if (!salesRepData[sale.salesRep]) {
        salesRepData[sale.salesRep] = {
          rep: sale.salesRep,
          sales: 0,
          revenue: 0
        };
      }
      salesRepData[sale.salesRep].sales += 1;
      salesRepData[sale.salesRep].revenue += sale.amount;
    });
    
    const salesRepPerformance = Object.values(salesRepData).sort((a, b) => b.revenue - a.revenue);
    
    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        categorySales,
        regionSales,
        topProducts,
        topCustomers,
        salesRepPerformance
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch dashboard statistics'
    };
  }
};

/**
 * Compare current period with previous period
 * @param {string} startDate - Start date of current period (YYYY-MM-DD)
 * @param {string} endDate - End date of current period (YYYY-MM-DD)
 * @returns {Promise<Object>} Promise resolving to period comparison data
 */
export const fetchPeriodComparison = async (startDate, endDate) => {
  try {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    
    // Get all sales data
    const response = await fetch('/mock-data/sales.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sales data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const salesData = data.sales || [];
    
    // Simulate API delay
    await delay(800);
    
    // Parse dates
    const currentStart = new Date(startDate);
    const currentEnd = new Date(endDate);
    
    // Set end date to end of day for inclusive comparison
    currentEnd.setHours(23, 59, 59, 999);
    
    // Calculate period duration in milliseconds
    const periodDuration = currentEnd.getTime() - currentStart.getTime();
    
    // Calculate previous period dates
    const previousEnd = new Date(currentStart);
    previousEnd.setDate(previousEnd.getDate() - 1);
    
    const previousStart = new Date(previousEnd);
    previousStart.setTime(previousEnd.getTime() - periodDuration);
    
    // Filter sales for current period
    const currentPeriodSales = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= currentStart && saleDate <= currentEnd;
    });
    
    // Filter sales for previous period
    const previousPeriodSales = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= previousStart && saleDate <= previousEnd;
    });
    
    // Calculate metrics for both periods
    const calculateMetrics = (sales) => {
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
      const orderCount = sales.length;
      const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
      
      // Group by category
      const byCategory = {};
      sales.forEach(sale => {
        byCategory[sale.category] = (byCategory[sale.category] || 0) + sale.amount;
      });
      
      // Group by region
      const byRegion = {};
      sales.forEach(sale => {
        byRegion[sale.region] = (byRegion[sale.region] || 0) + sale.amount;
      });
      
      return {
        totalRevenue,
        orderCount,
        avgOrderValue,
        byCategory,
        byRegion
      };
    };
    
    const currentMetrics = calculateMetrics(currentPeriodSales);
    const previousMetrics = calculateMetrics(previousPeriodSales);
    
    // Calculate percentage changes
    const calculatePercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };
    
    const percentChanges = {
      totalRevenue: calculatePercentChange(currentMetrics.totalRevenue, previousMetrics.totalRevenue),
      orderCount: calculatePercentChange(currentMetrics.orderCount, previousMetrics.orderCount),
      avgOrderValue: calculatePercentChange(currentMetrics.avgOrderValue, previousMetrics.avgOrderValue)
    };
    
    return {
      success: true,
      data: {
        currentPeriod: {
          startDate: startDate,
          endDate: endDate,
          metrics: currentMetrics
        },
        previousPeriod: {
          startDate: previousStart.toISOString().split('T')[0],
          endDate: previousEnd.toISOString().split('T')[0],
          metrics: previousMetrics
        },
        percentChanges
      }
    };
  } catch (error) {
    console.error('Error fetching period comparison:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch period comparison'
    };
  }
};

/**
 * Export data to CSV format
 * @param {Array} data - Data to export
 * @param {string} type - Type of data (sales, products, customers)
 * @returns {string} CSV string
 */
export const exportToCSV = (data, type = 'sales') => {
  if (!data || !data.length) {
    return '';
  }
  
  // Get column headers based on data type
  const getHeaders = () => {
    switch (type) {
      case 'sales':
        return ['ID', 'Date', 'Customer', 'Product', 'Category', 'Amount', 'Quantity', 'Payment Method', 'Sales Rep', 'Region'];
      case 'products':
        return ['ID', 'Name', 'Category', 'Description', 'Price', 'Cost Price', 'Sales Count', 'Revenue', 'Profit', 'Profit Margin', 'Trending'];
      case 'customers':
        return ['ID', 'Name', 'Industry', 'Size', 'Region', 'Join Date', 'Lifetime Value', 'Order Count', 'Last Purchase Date', 'Status', 'Contact Person', 'Email'];
      default:
        return Object.keys(data[0]);
    }
  };
  
  // Get row values based on data type
  const getRowValues = (item) => {
    switch (type) {
      case 'sales':
        return [
          item.id,
          item.date,
          item.customer,
          item.product,
          item.category,
          item.amount,
          item.quantity,
          item.paymentMethod,
          item.salesRep,
          item.region
        ];
      case 'products':
        return [
          item.id,
          item.name,
          item.category,
          item.description,
          item.price,
          item.costPrice,
          item.salesCount,
          item.revenueGenerated,
          item.profit,
          item.profitMargin,
          item.trending ? 'Yes' : 'No'
        ];
      case 'customers':
        return [
          item.id,
          item.name,
          item.industry,
          item.size,
          item.region,
          item.joinDate,
          item.lifetimeValue,
          item.orderCount,
          item.lastPurchaseDate,
          item.status,
          item.contactPerson,
          item.email
        ];
      default:
        return Object.values(item);
    }
  };
  
  // Convert to CSV
  const headers = getHeaders();
  const rows = data.map(item => getRowValues(item));
  
  // Escape function for CSV values
  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    // If value contains comma, quote, or newline, wrap in quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      // Double up any quotes within the value
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };
  
  // Join headers and rows
  const headerLine = headers.map(escapeCSV).join(',');
  const dataLines = rows.map(row => row.map(escapeCSV).join(','));
  
  return [headerLine, ...dataLines].join('\n');
};

/**
 * Download data as a file
 * @param {string} content - File content
 * @param {string} fileName - File name
 * @param {string} mimeType - MIME type
 */
export const downloadFile = (content, fileName, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Export dashboard data
 * @param {string} type - Type of data to export (sales, products, customers, all)
 * @param {Object} filters - Filters to apply before export
 */
export const exportDashboardData = async (type = 'sales', filters = {}) => {
  try {
    let data = [];
    let fileName = '';
    
    // Get current date for filename
    const date = new Date().toISOString().split('T')[0];
    
    switch (type) {
      case 'sales': {
        const salesResult = await fetchSalesData(filters);
        if (salesResult.success) {
          data = salesResult.data;
          fileName = `sales_export_${date}.csv`;
        } else {
          throw new Error(salesResult.error);
        }
        break;
      }
        
      case 'products': {
        const productsResult = await fetchProductData(filters);
        if (productsResult.success) {
          data = productsResult.data;
          fileName = `products_export_${date}.csv`;
        } else {
          throw new Error(productsResult.error);
        }
        break;
      }
        
      case 'customers': {
        const customersResult = await fetchCustomerData(filters);
        if (customersResult.success) {
          data = customersResult.data;
          fileName = `customers_export_${date}.csv`;
        } else {
          throw new Error(customersResult.error);
        }
        break;
      }
        
      case 'all':
        // Export all data types to a single ZIP file
        // This would require a ZIP library, which is beyond the scope of this hackathon
        throw new Error('Exporting all data is not implemented in this demo');
        
      default:
        throw new Error(`Unknown export type: ${type}`);
    }
    
    if (data.length === 0) {
      throw new Error('No data to export');
    }
    
    const csvContent = exportToCSV(data, type);
    downloadFile(csvContent, fileName);
    
    return {
      success: true,
      message: `Successfully exported ${data.length} ${type} records`
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      success: false,
      error: error.message || 'Failed to export data'
    };
  }
};