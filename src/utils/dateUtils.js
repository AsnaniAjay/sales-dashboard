// src/utils/dateUtils.js
/**
 * Utility functions for date manipulation and formatting
 */

/**
 * Format a date as YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateToISO = (date) => {
    if (!date) return null;
    
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  /**
   * Format a date for display (e.g., "Mar 15, 2025")
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  export const formatDateForDisplay = (date, options = {}) => {
    if (!date) return '';
    
    const d = date instanceof Date ? date : new Date(date);
    const defaultOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    };
    
    return d.toLocaleDateString('en-US', { ...defaultOptions, ...options });
  };
  
  /**
   * Get start and end of a day
   * @param {Date|string} date - Date to process
   * @returns {Object} Object with startOfDay and endOfDay
   */
  export const getDayBoundaries = (date) => {
    if (!date) return { startOfDay: null, endOfDay: null };
    
    const d = date instanceof Date ? date : new Date(date);
    
    // Start of day (00:00:00)
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    
    // End of day (23:59:59)
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      startOfDay,
      endOfDay
    };
  };
  
  /**
   * Get start and end of a month
   * @param {Date|string} date - Date within the month
   * @returns {Object} Object with startOfMonth and endOfMonth
   */
  export const getMonthBoundaries = (date) => {
    if (!date) return { startOfMonth: null, endOfMonth: null };
    
    const d = date instanceof Date ? date : new Date(date);
    
    // Start of month (1st day)
    const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    // End of month (last day)
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    return {
      startOfMonth,
      endOfMonth
    };
  };
  
  /**
   * Get start and end of a year
   * @param {Date|string} date - Date within the year
   * @returns {Object} Object with startOfYear and endOfYear
   */
  export const getYearBoundaries = (date) => {
    if (!date) return { startOfYear: null, endOfYear: null };
    
    const d = date instanceof Date ? date : new Date(date);
    
    // Start of year (Jan 1)
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    
    // End of year (Dec 31)
    const endOfYear = new Date(d.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);
    
    return {
      startOfYear,
      endOfYear
    };
  };
  
  /**
   * Calculate date range for previous period (same duration)
   * @param {Date|string} startDate - Start date of current period
   * @param {Date|string} endDate - End date of current period
   * @returns {Object} Object with previousStartDate and previousEndDate
   */
  export const getPreviousPeriod = (startDate, endDate) => {
    if (!startDate || !endDate) return { previousStartDate: null, previousEndDate: null };
    
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Calculate duration in milliseconds
    const durationMs = end.getTime() - start.getTime();
    
    // Calculate previous period end (day before current start)
    const previousEnd = new Date(start);
    previousEnd.setDate(previousEnd.getDate() - 1);
    
    // Calculate previous period start
    const previousStart = new Date(previousEnd);
    previousStart.setTime(previousEnd.getTime() - durationMs);
    
    return {
      previousStartDate: previousStart,
      previousEndDate: previousEnd
    };
  };
  
  /**
   * Get an array of dates between start and end dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {Array} Array of date strings in YYYY-MM-DD format
   */
  export const getDatesBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return [];
    
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    // Ensure start date is at beginning of day and end date is at end of day
    const { startOfDay } = getDayBoundaries(start);
    const { endOfDay } = getDayBoundaries(end);
    
    const dates = [];
    const currentDate = new Date(startOfDay);
    
    // Loop through each day and add to array
    while (currentDate <= endOfDay) {
      dates.push(formatDateToISO(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  /**
   * Calculate the week number for a date
   * @param {Date|string} date - Date to get week number for
   * @returns {number} Week number (1-53)
   */
  export const getWeekNumber = (date) => {
    if (!date) return null;
    
    const d = date instanceof Date ? date : new Date(date);
    
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setHours(0, 0, 0, 0);
    const dayNum = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - dayNum);
    
    // Get first day of year
    const yearStart = new Date(d.getFullYear(), 0, 1);
    
    // Calculate full weeks to nearest Thursday
    const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    
    return weekNum;
  };