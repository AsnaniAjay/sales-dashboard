// src/components/filters/CategoryFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/solid';

const CategoryFilter = ({ categories, selectedCategories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside clicks
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
  }, [dropdownRef]);

  // Toggle category selection
  const toggleCategory = (category) => {
    let newSelected;
    if (selectedCategories.includes(category)) {
      newSelected = selectedCategories.filter(cat => cat !== category);
    } else {
      newSelected = [...selectedCategories, category];
    }
    onChange(newSelected);
  };

  // Select all categories
  const selectAll = () => {
    onChange([...categories]);
  };

  // Clear all selections
  const clearAll = () => {
    onChange([]);
  };

  // Get display text for the dropdown button
  const getDisplayText = () => {
    if (selectedCategories.length === 0) {
      return 'All Categories';
    } else if (selectedCategories.length === categories.length) {
      return 'All Categories';
    } else if (selectedCategories.length === 1) {
      return selectedCategories[0];
    } else {
      return `${selectedCategories.length} Categories`;
    }
  };

  // Get background color for category badge
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Subscription':
        return 'bg-green-100 text-green-800';
      case 'Software':
        return 'bg-blue-100 text-blue-800';
      case 'Services':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getDisplayText()}</span>
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 px-2" role="menu" aria-orientation="vertical">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex justify-between">
                <button
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                  onClick={selectAll}
                >
                  Select All
                </button>
                <button
                  className="text-xs text-gray-600 hover:text-gray-800"
                  onClick={clearAll}
                >
                  Clear All
                </button>
              </div>
            </div>
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex-1 flex items-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(category)}`}>
                    {category}
                  </span>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {selectedCategories.includes(category) && (
                    <CheckIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;