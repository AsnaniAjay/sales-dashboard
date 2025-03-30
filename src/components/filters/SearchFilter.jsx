// src/components/filters/SearchFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, XCircleIcon } from '@heroicons/react/solid';

const SearchFilter = ({ onSearch, placeholder = "Search...", initialValue = "" }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const timeout = useRef(null);

  // Clear the debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  // Handle debounced search
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    
    timeout.current = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // 300ms debounce
    
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [searchTerm, onSearch]);

  // Handle search input change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search input
  const handleClear = () => {
    setSearchTerm('');
    inputRef.current.focus();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative rounded-md shadow-sm ${isFocused ? 'ring-2 ring-indigo-500' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClear}
            >
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchFilter;