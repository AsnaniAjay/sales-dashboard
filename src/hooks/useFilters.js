// src/hooks/useFilters.js - Fixed version
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to manage filter state for the dashboard
 * 
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} - Filter state and methods to update filters
 */
const useFilters = (initialFilters = {}) => {
  // Store the initial filters in a ref to avoid dependency issues
  const initialFiltersRef = useRef(initialFilters);
  const isInitializedRef = useRef(false);
  
  // Initialize state once with the initialFilters
  const [filters, setFilters] = useState({
    startDate: initialFilters.startDate || null,
    endDate: initialFilters.endDate || null,
    categories: initialFilters.categories || [],
    regions: initialFilters.regions || [],
    salesReps: initialFilters.salesReps || [],
    paymentMethods: initialFilters.paymentMethods || [],
    searchTerm: initialFilters.searchTerm || '',
    ...initialFilters
  });

  // Prevent filters from being reset on every render
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      // We've already set the initial state, so don't do anything here
    }
  }, []);

  // Track previous state to avoid unnecessary updates
  const prevFiltersRef = useRef(filters);

  // Update a single filter
  const setFilter = useCallback((key, value) => {
    // Skip update if value hasn't changed
    if (prevFiltersRef.current[key] === value) return;
    
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      };
      prevFiltersRef.current = newFilters;
      return newFilters;
    });
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters) => {
    if (!newFilters || Object.keys(newFilters).length === 0) return;
    
    // Check if any values have actually changed
    let hasChanged = false;
    for (const key in newFilters) {
      if (prevFiltersRef.current[key] !== newFilters[key]) {
        hasChanged = true;
        break;
      }
    }
    
    if (!hasChanged) return;
    
    setFilters(prev => {
      const updatedFilters = {
        ...prev,
        ...newFilters
      };
      prevFiltersRef.current = updatedFilters;
      return updatedFilters;
    });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    const initial = initialFiltersRef.current;
    
    // Skip if filters are already at initial values
    let hasChanged = false;
    for (const key in initial) {
      if (prevFiltersRef.current[key] !== initial[key]) {
        hasChanged = true;
        break;
      }
    }
    
    if (!hasChanged) return;
    
    const resetValues = {
      startDate: initial.startDate || null,
      endDate: initial.endDate || null,
      categories: initial.categories || [],
      regions: initial.regions || [],
      salesReps: initial.salesReps || [],
      paymentMethods: initial.paymentMethods || [],
      searchTerm: initial.searchTerm || '',
      ...initial
    };
    
    setFilters(resetValues);
    prevFiltersRef.current = resetValues;
  }, []);

  // Toggle a value in an array filter (like categories, regions)
  const toggleFilterValue = useCallback((key, value) => {
    setFilters(prev => {
      const currentValues = prev[key] || [];
      const valueIndex = currentValues.indexOf(value);
      let newValues;
      
      if (valueIndex >= 0) {
        newValues = [...currentValues];
        newValues.splice(valueIndex, 1);
      } else {
        newValues = [...currentValues, value];
      }
      
      const newFilters = {
        ...prev,
        [key]: newValues
      };
      
      prevFiltersRef.current = newFilters;
      return newFilters;
    });
  }, []);

  // Check if a filter has any values set
  const hasActiveFilters = useCallback(() => {
    const { searchTerm, startDate, endDate, categories, regions, salesReps, paymentMethods } = filters;
    
    return Boolean(
      searchTerm || 
      startDate || 
      endDate || 
      (categories && categories.length) ||
      (regions && regions.length) ||
      (salesReps && salesReps.length) ||
      (paymentMethods && paymentMethods.length)
    );
  }, [filters]);

  // Get available filter options from the data
  const getFilterOptions = useCallback((data, field) => {
    if (!data || !data.length || !field) return [];
    
    const uniqueValues = new Set();
    data.forEach(item => {
      if (item && item[field]) {
        uniqueValues.add(item[field]);
      }
    });
    
    return Array.from(uniqueValues);
  }, []);

  return {
    filters,
    setFilter,
    updateFilters,
    resetFilters,
    toggleFilterValue,
    hasActiveFilters,
    getFilterOptions
  };
};

export default useFilters;