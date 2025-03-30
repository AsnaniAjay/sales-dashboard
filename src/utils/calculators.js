// src/utils/calculators.js
/**
 * Utility functions for calculations and data processing
 */

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export const calculatePercentChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    
    return ((current - previous) / Math.abs(previous)) * 100;
  };
  
  /**
   * Calculate moving average for a data series
   * @param {Array} data - Array of numeric values
   * @param {number} windowSize - Size of moving window
   * @returns {Array} Moving averages
   */
  export const calculateMovingAverage = (data, windowSize = 3) => {
    if (!data || !data.length || windowSize < 1) return [];
    
    const result = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        // Not enough previous data points
        result.push(null);
      } else {
        // Calculate average of window
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
          sum += data[i - j];
        }
        result.push(sum / windowSize);
      }
    }
    
    return result;
  };
  
  /**
   * Group data by a specific field
   * @param {Array} data - Array of objects
   * @param {string} field - Field to group by
   * @returns {Object} Grouped data
   */
  export const groupByField = (data, field) => {
    if (!data || !data.length) return {};
    
    return data.reduce((acc, item) => {
      const key = item[field];
      if (!key) return acc;
      
      acc[key] = acc[key] || [];
      acc[key].push(item);
      return acc;
    }, {});
  };
  
  /**
   * Calculate sum of values in an array
   * @param {Array} data - Array of objects
   * @param {string} field - Field to sum
   * @returns {number} Sum of values
   */
  export const sumByField = (data, field) => {
    if (!data || !data.length) return 0;
    
    return data.reduce((sum, item) => {
      return sum + (Number(item[field]) || 0);
    }, 0);
  };
  
  /**
   * Calculate average of values in an array
   * @param {Array} data - Array of objects
   * @param {string} field - Field to average
   * @returns {number} Average value
   */
  export const averageByField = (data, field) => {
    if (!data || !data.length) return 0;
    
    const sum = sumByField(data, field);
    return sum / data.length;
  };
  
  /**
   * Find minimum value in an array
   * @param {Array} data - Array of objects
   * @param {string} field - Field to compare
   * @returns {number} Minimum value
   */
  export const minByField = (data, field) => {
    if (!data || !data.length) return 0;
    
    return Math.min(...data.map(item => Number(item[field]) || 0));
  };
  
  /**
   * Find maximum value in an array
   * @param {Array} data - Array of objects
   * @param {string} field - Field to compare
   * @returns {number} Maximum value
   */
  export const maxByField = (data, field) => {
    if (!data || !data.length) return 0;
    
    return Math.max(...data.map(item => Number(item[field]) || 0));
  };
  
  /**
   * Calculate growth rate between periods
   * @param {Array} currentPeriod - Current period data
   * @param {Array} previousPeriod - Previous period data
   * @param {string} field - Field to compare
   * @returns {number} Growth rate as percentage
   */
  export const calculateGrowthRate = (currentPeriod, previousPeriod, field) => {
    const currentSum = sumByField(currentPeriod, field);
    const previousSum = sumByField(previousPeriod, field);
    
    return calculatePercentChange(currentSum, previousSum);
  };
  
  /**
   * Convert flat data to time series format for charts
   * @param {Array} data - Array of data objects
   * @param {string} dateField - Field containing date
   * @param {string} valueField - Field containing value
   * @param {string} groupField - Optional field for grouping (e.g., category)
   * @returns {Array} Data formatted for time series charts
   */
  export const convertToTimeSeries = (data, dateField, valueField, groupField = null) => {
    if (!data || !data.length) return [];
    
    // If no grouping, create simple time series
    if (!groupField) {
      const uniqueDates = [...new Set(data.map(item => item[dateField]))];
      uniqueDates.sort(); // Sort dates chronologically
      
      return uniqueDates.map(date => {
        const items = data.filter(item => item[dateField] === date);
        const sum = sumByField(items, valueField);
        
        return {
          date,
          value: sum
        };
      });
    }
    
    // With grouping, create grouped time series
    const uniqueDates = [...new Set(data.map(item => item[dateField]))];
    const uniqueGroups = [...new Set(data.map(item => item[groupField]))];
    uniqueDates.sort(); // Sort dates chronologically
    
    return uniqueDates.map(date => {
      const result = { date };
      
      uniqueGroups.forEach(group => {
        const items = data.filter(item => 
          item[dateField] === date && item[groupField] === group
        );
        result[group] = sumByField(items, valueField);
      });
      
      return result;
    });
  };
  
  /**
   * Find top N items by a field
   * @param {Array} data - Array of objects
   * @param {string} field - Field to sort by
   * @param {number} n - Number of items to return
   * @returns {Array} Top N items
   */
  export const findTopItems = (data, field, n = 5) => {
    if (!data || !data.length) return [];
    
    // Sort by field in descending order
    const sorted = [...data].sort((a, b) => {
      const valueA = Number(a[field]) || 0;
      const valueB = Number(b[field]) || 0;
      return valueB - valueA;
    });
    
    // Return top N items
    return sorted.slice(0, n);
  };