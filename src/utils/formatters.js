// src/utils/formatters.js
/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param {number} value - Value to format
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, options = {}) => {
    if (value === null || value === undefined) return '';
    
    const defaultOptions = {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    };
    
    return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(value);
  };
  
  /**
   * Format a number as percentage
   * @param {number} value - Value to format
   * @param {Object} options - Intl.NumberFormat options
   * @returns {string} Formatted percentage string
   */
  export const formatPercentage = (value, options = {}) => {
    if (value === null || value === undefined) return '';
    
    const defaultOptions = {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    };
    
    // Convert decimal to percentage (e.g., 0.156 to 15.6%)
    const percentValue = typeof value === 'number' && Math.abs(value) < 10 ? value : value / 100;
    
    return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(percentValue);
  };
  
  /**
   * Format large numbers with K, M, B suffixes
   * @param {number} value - Value to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number (e.g., 1.5K, 2.3M)
   */
  export const formatCompactNumber = (value, decimals = 1) => {
    if (value === null || value === undefined) return '';
    
    if (value === 0) return '0';
    
    if (Math.abs(value) < 1000) {
      return value.toFixed(decimals).replace(/\.0+$/, '');
    }
    
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const suffixIndex = Math.floor(Math.log10(Math.abs(value)) / 3);
    
    const shortValue = (value / Math.pow(1000, suffixIndex)).toFixed(decimals);
    return shortValue.replace(/\.0+$/, '') + suffixes[suffixIndex];
  };
  
  /**
   * Format a number with thousand separators
   * @param {number} value - Value to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted number
   */
  export const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined) return '';
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };
  
  /**
   * Truncate text with ellipsis
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, length = 30) => {
    if (!text) return '';
    
    if (text.length <= length) return text;
    
    return text.substring(0, length) + '...';
  };
  
  /**
   * Format a phone number
   * @param {string} phone - Phone number to format
   * @returns {string} Formatted phone number
   */
  export const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Remove non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // US format: (XXX) XXX-XXXX
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    
    return phone;
  };