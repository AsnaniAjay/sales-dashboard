// src/components/notifications/NotificationFilters.jsx
import React from 'react';
import { FaSearch, FaFilter, FaSort, FaClock, FaCheckDouble, FaTrashAlt } from 'react-icons/fa';

const NotificationFilters = ({ 
  selectedFilter, 
  onFilterChange, 
  sortBy, 
  onSortChange, 
  timeRange, 
  onTimeRangeChange, 
  searchQuery, 
  onSearchChange,
  onMarkAllAsRead,
  onClearAll,
  unreadCount
}) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'alert', label: 'Alerts' },
    { id: 'report', label: 'Reports' },
    { id: 'system', label: 'System' },
    { id: 'customer', label: 'Customer' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'unread', label: 'Unread First' }
  ];

  const timeRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 md:flex md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          {/* Type Filter */}
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              <FaFilter className="inline mr-1" size={14} />
              Filter By Type
            </label>
            <div className="mt-1">
              <select
                id="type-filter"
                value={selectedFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {filters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              <FaSort className="inline mr-1" size={14} />
              Sort By
            </label>
            <div className="mt-1">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 mb-1">
              <FaClock className="inline mr-1" size={14} />
              Time Range
            </label>
            <div className="mt-1">
              <select
                id="time-range"
                value={timeRange}
                onChange={(e) => onTimeRangeChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {timeRanges.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0 md:max-w-xs">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              <FaSearch className="inline mr-1" size={14} />
              Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                id="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search notifications..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 md:mt-0 flex space-x-3">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaCheckDouble className="mr-2 h-4 w-4 text-gray-500" />
              Mark All as Read
            </button>
          )}

          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaTrashAlt className="mr-2 h-4 w-4 text-gray-500" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;