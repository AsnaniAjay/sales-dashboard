// src/components/customers/CustomerDetail.jsx
import React from 'react';
import Modal from '../ui/Modal';
import { formatCurrency } from '../../utils/formatters';

const CustomerDetail = ({ customer, isOpen, onClose }) => {
  if (!customer) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate metrics
  const avgOrderValue = customer.orderCount 
    ? customer.lifetimeValue / customer.orderCount 
    : 0;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Customer Details: ${customer.name}`}
      size="lg"
      footer={
        <button
          type="button"
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onClose}
        >
          Close
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Basic Info Section */}
        <div className="sm:col-span-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Company Name</div>
          <div className="mt-1 text-sm text-gray-900">{customer.name}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Contact Person</div>
          <div className="mt-1 text-sm text-gray-900">{customer.contactPerson}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Email Address</div>
          <div className="mt-1 text-sm text-gray-900">{customer.email}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Status</div>
          <div className="mt-1">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {customer.status}
            </span>
          </div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Industry</div>
          <div className="mt-1 text-sm text-gray-900">{customer.industry}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Size</div>
          <div className="mt-1 text-sm text-gray-900">{customer.size}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Region</div>
          <div className="mt-1 text-sm text-gray-900">{customer.region}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Join Date</div>
          <div className="mt-1 text-sm text-gray-900">{formatDate(customer.joinDate)}</div>
        </div>

        {/* Metrics Section */}
        <div className="sm:col-span-6 pt-4">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Performance Metrics</h3>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Lifetime Value</div>
          <div className="mt-1 text-sm text-gray-900">{formatCurrency(customer.lifetimeValue)}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Total Orders</div>
          <div className="mt-1 text-sm text-gray-900">{customer.orderCount}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Average Order Value</div>
          <div className="mt-1 text-sm text-gray-900">{formatCurrency(avgOrderValue)}</div>
        </div>

        <div className="sm:col-span-3">
          <div className="text-sm font-medium text-gray-500">Last Purchase Date</div>
          <div className="mt-1 text-sm text-gray-900">{formatDate(customer.lastPurchaseDate)}</div>
        </div>

        {/* Additional Notes Section */}
        <div className="sm:col-span-6 pt-4">
          <div className="text-sm font-medium text-gray-500">Notes</div>
          <div className="mt-1 text-sm text-gray-900">
            <p>
              {customer.notes || "No additional notes available for this customer."}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetail;