// src/hooks/useDateRange.js
import { useRef } from 'react';

/**
 * Predefined date ranges for easy selection
 */
export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days'
};

// Helper functions
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

/**
 * RADICALLY SIMPLIFIED version of useDateRange
 * 
 * This hook no longer manages internal state. It only provides functions
 * to calculate date ranges and passes them to the parent via onChange.
 * Parent is responsible for maintaining the actual state.
 * 
 * @param {Object} dateRange - Current date range from parent (startDate, endDate, label)
 * @param {Function} onChange - Callback when date range changes
 */
const useDateRange = (dateRange = {}, onChange) => {
  // Track if default range was set
  const initialized = useRef(false);
  
  // Initialize with default range if needed (does this only once)
  if (!initialized.current && !dateRange.startDate && !dateRange.endDate && onChange) {
    initialized.current = true;
    
    // Default to last 30 days
    const today = new Date();
    const last30Start = new Date(today);
    last30Start.setDate(today.getDate() - 29);
    
    const defaultRange = {
      startDate: formatDate(startOfDay(last30Start)),
      endDate: formatDate(endOfDay(today)),
      label: 'Last 30 Days'
    };
    
    // Call onChange with the default range
    onChange(defaultRange);
  }

  // Set custom date range
  const setCustomRange = (startDate, endDate, label = 'Custom') => {
    if (!onChange) return;
    
    onChange({
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      label
    });
  };

  // Set predefined date range
  const setPresetRange = (presetKey) => {
    if (!onChange) return;
    
    const today = new Date();
    let startDate = null;
    let endDate = null;
    let label = 'Custom';

    // Calculate date range based on preset key
    switch (presetKey) {
      case DATE_RANGES.TODAY:
        startDate = startOfDay(today);
        endDate = endOfDay(today);
        label = 'Today';
        break;
      
      case DATE_RANGES.YESTERDAY: {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        startDate = startOfDay(yesterday);
        endDate = endOfDay(yesterday);
        label = 'Yesterday';
        break;
      }
      
      case DATE_RANGES.THIS_WEEK: {
        const thisWeekStart = new Date(today);
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust for Sunday
        thisWeekStart.setDate(diff);
        startDate = startOfDay(thisWeekStart);
        endDate = endOfDay(today);
        label = 'This Week';
        break;
      }
      
      case DATE_RANGES.LAST_WEEK: {
        const lastWeekStart = new Date(today);
        const lastWeekEnd = new Date(today);
        const lastWeekDay = today.getDay();
        
        lastWeekStart.setDate(today.getDate() - lastWeekDay - 6);
        lastWeekEnd.setDate(today.getDate() - lastWeekDay);
        
        startDate = startOfDay(lastWeekStart);
        endDate = endOfDay(lastWeekEnd);
        label = 'Last Week';
        break;
      }
      
      case DATE_RANGES.THIS_MONTH: {
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = startOfDay(thisMonthStart);
        endDate = endOfDay(today);
        label = 'This Month';
        break;
      }
      
      case DATE_RANGES.LAST_MONTH: {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = startOfDay(lastMonthStart);
        endDate = endOfDay(lastMonthEnd);
        label = 'Last Month';
        break;
      }
      
      case DATE_RANGES.THIS_QUARTER: {
        const quarter = Math.floor(today.getMonth() / 3);
        const thisQuarterStart = new Date(today.getFullYear(), quarter * 3, 1);
        startDate = startOfDay(thisQuarterStart);
        endDate = endOfDay(today);
        label = 'This Quarter';
        break;
      }
      
      case DATE_RANGES.LAST_QUARTER: {
        const currentQuarter = Math.floor(today.getMonth() / 3);
        const lastQuarterStart = new Date(today.getFullYear(), (currentQuarter - 1) * 3, 1);
        const lastQuarterEnd = new Date(today.getFullYear(), currentQuarter * 3, 0);
        startDate = startOfDay(lastQuarterStart);
        endDate = endOfDay(lastQuarterEnd);
        label = 'Last Quarter';
        break;
      }
      
      case DATE_RANGES.THIS_YEAR: {
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        startDate = startOfDay(thisYearStart);
        endDate = endOfDay(today);
        label = 'This Year';
        break;
      }
      
      case DATE_RANGES.LAST_YEAR: {
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        startDate = startOfDay(lastYearStart);
        endDate = endOfDay(lastYearEnd);
        label = 'Last Year';
        break;
      }
      
      case DATE_RANGES.LAST_7_DAYS: {
        const last7Start = new Date(today);
        last7Start.setDate(today.getDate() - 6);
        startDate = startOfDay(last7Start);
        endDate = endOfDay(today);
        label = 'Last 7 Days';
        break;
      }
      
      case DATE_RANGES.LAST_30_DAYS: {
        const last30Start = new Date(today);
        last30Start.setDate(today.getDate() - 29);
        startDate = startOfDay(last30Start);
        endDate = endOfDay(today);
        label = 'Last 30 Days';
        break;
      }
      
      case DATE_RANGES.LAST_90_DAYS: {
        const last90Start = new Date(today);
        last90Start.setDate(today.getDate() - 89);
        startDate = startOfDay(last90Start);
        endDate = endOfDay(today);
        label = 'Last 90 Days';
        break;
      }
      
      default:
        break;
    }

    // Call onChange with the calculated range
    if (startDate && endDate) {
      onChange({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        label
      });
    }
  };

  // Clear the date range
  const clearDateRange = () => {
    if (!onChange) return;
    
    onChange({
      startDate: null,
      endDate: null,
      label: null
    });
  };

  // Format date range for display
  const getDisplayText = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'All Time';
    }
    
    if (dateRange.label && dateRange.label !== 'Custom') {
      return dateRange.label;
    }
    
    if (dateRange.startDate && dateRange.endDate) {
      return `${formatDisplayDate(dateRange.startDate)} - ${formatDisplayDate(dateRange.endDate)}`;
    }
    
    return 'Custom Range';
  };

  return {
    dateRange,  // Just pass through the dateRange from props
    setCustomRange,
    setPresetRange,
    clearDateRange,
    getDisplayText,
    DATE_RANGES
  };
};

export default useDateRange;