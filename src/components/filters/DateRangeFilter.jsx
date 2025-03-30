// src/components/filters/DateRangeFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, XIcon } from '@heroicons/react/outline';

const DateRangeFilter = ({ onChange, initialStartDate, initialEndDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const dropdownRef = useRef(null);

  // Predefined date ranges
  const presets = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'last7days', label: 'Last 7 Days' },
    { id: 'last30days', label: 'Last 30 Days' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
    { id: 'thisQuarter', label: 'This Quarter' },
    { id: 'lastQuarter', label: 'Last Quarter' },
    { id: 'yearToDate', label: 'Year to Date' },
    { id: 'custom', label: 'Custom Range' }
  ];

  // Calculate date from preset
  const getPresetDates = (presetId) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch(presetId) {
      case 'today':
        // Start and end are today
        break;
      case 'yesterday':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'last7days':
        start.setDate(today.getDate() - 6);
        break;
      case 'last30days':
        start.setDate(today.getDate() - 29);
        break;
      case 'thisMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'thisQuarter': {
        const currentQuarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), currentQuarter * 3, 1);
        end = new Date(today.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;
      }
      case 'lastQuarter': {
        const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
        const yearOffset = lastQuarter < 0 ? -1 : 0;
        const adjustedQuarter = lastQuarter < 0 ? 3 : lastQuarter;
        start = new Date(today.getFullYear() + yearOffset, adjustedQuarter * 3, 1);
        end = new Date(today.getFullYear() + yearOffset, (adjustedQuarter + 1) * 3, 0);
        break;
      }
      case 'yearToDate':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return { start: '', end: '' };
    }

    // Format the dates for input fields (YYYY-MM-DD)
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply preset
  const applyPreset = (presetId) => {
    if (presetId === 'custom') {
      setSelectedPreset('custom');
      return;
    }

    const { start, end } = getPresetDates(presetId);
    setStartDate(start);
    setEndDate(end);
    setSelectedPreset(presetId);

    if (onChange) {
      onChange({ startDate: start, endDate: end, preset: presetId });
    }
  };

  // Handle date change
  const handleDateChange = (field, value) => {
    if (field === 'start') {
      setStartDate(value);
      setSelectedPreset('custom');
    } else {
      setEndDate(value);
      setSelectedPreset('custom');
    }
  };

  // Apply custom date range
  const applyCustomRange = () => {
    if (onChange) {
      onChange({ startDate, endDate, preset: 'custom' });
    }
    setIsOpen(false);
  };

  // Format display date
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  // Get display text for the date range
  const getDisplayText = () => {
    if (selectedPreset !== 'custom') {
      const preset = presets.find(p => p.id === selectedPreset);
      return preset ? preset.label : 'Select date range';
    }
    
    if (startDate && endDate) {
      return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
    }
    
    return 'Select date range';
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Date range button */}
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span>{getDisplayText()}</span>
        </div>
        
        {(startDate || endDate) && (
          <button
            type="button"
            className="p-1 ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setStartDate('');
              setEndDate('');
              setSelectedPreset('custom');
              if (onChange) {
                onChange({ startDate: '', endDate: '', preset: 'custom' });
              }
            }}
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="p-4 border border-gray-200 rounded-md">
            {/* Presets */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {presets.filter(p => p.id !== 'custom').map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                      selectedPreset === preset.id
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => applyPreset(preset.id)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom range */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Custom Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="start-date" className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    id="start-date"
                    className="block w-full px-3 py-2 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={startDate}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    id="end-date"
                    className="block w-full px-3 py-2 text-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={endDate}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={applyCustomRange}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;