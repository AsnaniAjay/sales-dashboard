// src/pages/Customers.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import CustomerOverview from '../components/customers/CustomerOverview';
import CustomerSegmentation from '../components/customers/CustomerSegmentation';
import CustomerTable from '../components/customers/CustomerTable';
import CustomerDetail from '../components/customers/CustomerDetail';
import SearchFilter from '../components/filters/SearchFilter';
import Dropdown from '../components/ui/Dropdown';
import Button from '../components/ui/Button';
import { FaFilter, FaDownload, FaUserPlus } from 'react-icons/fa';
import { useDashboard } from '../context/DashboardContext';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerGroups, setCustomerGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('industry');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get data from context
  const { fetchCustomerData } = useDashboard();
  
  // Updated part of Customers.jsx with robust JSON loading

useEffect(() => {
    const getCustomerData = async () => {
      setIsLoading(true);
      try {
        // Define the URL properly - Make sure this path is correct!
        // The error suggests it's returning HTML instead of JSON
        const jsonUrl = new URL('mock-data/customers.json', window.location.origin).href;
 
        
        // Use more robust fetch with explicit headers
        const response = await fetch(jsonUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Verify that we're getting JSON back
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Response is not JSON, content type:', contentType);
          // Try to get text to see what's being returned
          const textContent = await response.text();
          console.error('Response content (first 100 chars):', textContent.substring(0, 100));
          throw new Error('Response is not JSON');
        }
        
        // Now parse the JSON
        const data = await response.json();
        
        // Validate the data structure
        if (data && data.customers && Array.isArray(data.customers)) {
          setCustomers(data.customers);
          
          // Also store customer groups if available
          if (data.customerGroups && Array.isArray(data.customerGroups)) {
            setCustomerGroups(data.customerGroups);
          }

        } else {
          throw new Error('Invalid customer data format in JSON file');
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        // If fetch fails, fallback to a basic structure
        setCustomers([]);
        // Log advice about file location
        console.warn(
          'Make sure your customers.json file is correctly placed in the public folder (not in src). ' +
          'For Vite, it should be in the "public" folder at the root of your project.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    getCustomerData();
  }, []);
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  // Handle view customer
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };
  
  // Segmentation options
  const segmentationOptions = [
    { value: 'industry', label: 'Industry' },
    { value: 'size', label: 'Company Size' },
    { value: 'region', label: 'Region' },
    { value: 'status', label: 'Status' }
  ];
  
  // Handle segmentation change
  const handleSegmentChange = (option) => {
    setSelectedSegment(option.value);
  };
  
  // Export customer data
  const handleExport = () => {
    console.log('Exporting customer data...');
    
    // Create a CSV content from the customers data
    if (customers.length > 0) {
      // Get headers from the first customer object
      const headers = Object.keys(customers[0]).join(',');
      
      // Convert each customer to CSV row
      const csvRows = customers.map(customer => {
        return Object.values(customer)
          .map(value => {
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
      link.setAttribute('download', 'customer_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No customer data to export');
    }
  };
  
  // Add customer handler
  const handleAddCustomer = () => {
    // In a real app, this would open a form or modal
    alert('Add customer functionality would open here');
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and analyze your customer base
            </p>
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              icon={<FaDownload className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleExport}
            >
              Export
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              icon={<FaUserPlus className="h-4 w-4" />}
              iconPosition="left"
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>
      </div>
      
      {/* Customer Overview KPIs */}
      <div className="mb-6">
        <CustomerOverview data={customers} groups={customerGroups} />
      </div>
      
      {/* Filters & Segmentation Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SearchFilter 
            onSearch={handleSearch}
            placeholder="Search customers..."
            initialValue={searchTerm}
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm text-gray-700">Segment by:</span>
          </div>
          <div className="mt-1">
            <Dropdown 
              items={segmentationOptions}
              selectedItem={segmentationOptions.find(option => option.value === selectedSegment)}
              onChange={handleSegmentChange}
              width="w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Customer Segmentation */}
      <div className="mb-6">
        <CustomerSegmentation data={customers} segmentBy={selectedSegment} />
      </div>
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        /* Customer Table */
        <div className="mb-6">
          <CustomerTable 
            data={customers}
            onViewCustomer={handleViewCustomer} 
          />
        </div>
      )}
      
      {/* Customer Detail Modal */}
      <CustomerDetail 
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Customers;