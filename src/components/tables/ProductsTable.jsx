// src/components/tables/ProductsTable.jsx
import React, { useState, useMemo } from 'react';
import { ArrowSmUpIcon, ArrowSmDownIcon, SearchIcon, TrendingUpIcon, MenuIcon } from '@heroicons/react/solid';

const ProductsTable = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'revenueGenerated',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'card', or 'table'
  const itemsPerPage = 5;

  // Toggle row expansion for mobile view
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'table' : 'card');
  };

  // Get sorted and filtered data
  const sortedAndFilteredData = useMemo(() => {
    if (!data || !data.length) return [];

    // Filter data based on search term
    let filteredData = [...data];
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        item =>
          item.name.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort data
    filteredData.sort((a, b) => {
      // Handle numeric sorting
      if (
        sortConfig.key === 'price' ||
        sortConfig.key === 'costPrice' ||
        sortConfig.key === 'salesCount' ||
        sortConfig.key === 'revenueGenerated' ||
        sortConfig.key === 'profit' ||
        sortConfig.key === 'profitMargin'
      ) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      // Handle string sorting
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filteredData;
  }, [data, searchTerm, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredData, currentPage]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowSmUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ArrowSmDownIcon className="h-4 w-4 inline ml-1" />
    );
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Product Performance</h3>
          
          {/* View toggle (visible on small screens) */}
          <button 
            className="md:hidden px-3 py-1 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50"
            onClick={toggleViewMode}
          >
            {viewMode === 'card' ? 'Switch to Table' : 'Switch to Cards'}
          </button>
        </div>
        
        <div className="w-full sm:w-auto sm:flex-1 max-w-lg sm:ml-auto">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table View - Always available but hidden on mobile unless toggled */}
      <div className={`${viewMode === 'table' ? 'block' : 'hidden md:block'} overflow-x-auto`}>
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('name')}
                >
                  Product {getSortIcon('name')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('category')}
                >
                  Category {getSortIcon('category')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('price')}
                >
                  Price {getSortIcon('price')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('salesCount')}
                >
                  Sales {getSortIcon('salesCount')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('revenueGenerated')}
                >
                  Revenue {getSortIcon('revenueGenerated')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                  onClick={() => requestSort('profitMargin')}
                >
                  Margin {getSortIcon('profitMargin')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-700 font-medium">{product.name.substring(0, 2)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {product.name}
                            {product.trending && (
                              <TrendingUpIcon className="h-4 w-4 text-green-500 ml-1" aria-hidden="true" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.category === 'Subscription' ? 'bg-green-100 text-green-800' :
                        product.category === 'Software' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.salesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(product.revenueGenerated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm ${
                          product.profitMargin >= 70 ? 'text-green-600' :
                          product.profitMargin >= 60 ? 'text-green-500' :
                          'text-yellow-500'
                        }`}>
                          {product.profitMargin.toFixed(1)}%
                        </span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              product.profitMargin >= 70 ? 'bg-green-600' :
                              product.profitMargin >= 60 ? 'bg-green-500' :
                              'bg-yellow-500'
                            }`} 
                            style={{ width: `${product.profitMargin}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.trending ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.trending ? 'Trending' : 'Stable'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card View - Always available but hidden on desktop unless toggled */}
      <div className={`${viewMode === 'card' ? 'block' : 'md:hidden'}`}>
        <div className="px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="grid grid-cols-2 gap-2">
            <div 
              className="cursor-pointer" 
              onClick={() => requestSort('name')}
            >
              Product {getSortIcon('name')}
            </div>
            <div 
              className="cursor-pointer text-right" 
              onClick={() => requestSort('revenueGenerated')}
            >
              Revenue {getSortIcon('revenueGenerated')}
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {paginatedData.length > 0 ? (
            paginatedData.map((product) => (
              <li key={product.id} className="px-4 py-4 hover:bg-gray-50">
                <div 
                  className="cursor-pointer"
                  onClick={() => toggleRowExpansion(product.id)}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 font-medium">{product.name.substring(0, 2)}</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {product.name}
                          {product.trending && (
                            <TrendingUpIcon className="h-4 w-4 text-green-500 ml-1" aria-hidden="true" />
                          )}
                        </div>
                        <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                          product.category === 'Subscription' ? 'bg-green-100 text-green-800' :
                          product.category === 'Software' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {product.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.revenueGenerated)}
                      </div>
                      <MenuIcon className="h-5 w-5 text-gray-400 mt-1" />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedRows[product.id] && (
                    <div className="mt-4 pl-13 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-500">Price</div>
                        <div>{formatCurrency(product.price)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Sales</div>
                        <div>{product.salesCount}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Margin</div>
                        <div className="flex items-center">
                          <span className={`${
                            product.profitMargin >= 70 ? 'text-green-600' :
                            product.profitMargin >= 60 ? 'text-green-500' :
                            'text-yellow-500'
                          }`}>
                            {product.profitMargin.toFixed(1)}%
                          </span>
                          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                product.profitMargin >= 70 ? 'bg-green-600' :
                                product.profitMargin >= 60 ? 'bg-green-500' :
                                'bg-yellow-500'
                              }`} 
                              style={{ width: `${product.profitMargin}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500">Status</div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.trending ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.trending ? 'Trending' : 'Stable'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <div className="font-medium text-gray-500">Description</div>
                        <p className="text-gray-600">{product.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 text-center text-sm text-gray-500">
              No products found.
            </li>
          )}
        </ul>
      </div>

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex flex-col sm:flex-row justify-between items-center w-full">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, sortedAndFilteredData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedAndFilteredData.length}</span> results
              </p>
            </div>
            <div className="flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  Previous
                </button>
                {/* Show limited page numbers on mobile */}
                {[...Array(totalPages)].map((_, index) => {
                  // On mobile, only show current page, first, last, and immediate neighbors
                  const showOnMobile = 
                    index === 0 || 
                    index === totalPages - 1 || 
                    Math.abs(currentPage - (index + 1)) <= 1;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === index + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      } ${!showOnMobile ? 'hidden sm:inline-flex' : ''}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;