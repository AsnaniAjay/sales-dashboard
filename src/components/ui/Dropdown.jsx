// src/components/ui/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/solid';

const Dropdown = ({ 
  label, 
  items, 
  selectedItem, 
  onChange, 
  placeholder = 'Select an option',
  width = 'w-64',
  disabled = false,
  error,
  icon,
  buttonClassName = '',
  menuClassName = '',
  menuItemClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Handle item selection
  const handleItemClick = (item) => {
    onChange(item);
    setIsOpen(false);
  };

  // Find selected item label
  const getSelectedLabel = () => {
    if (!selectedItem) return placeholder;
    
    if (typeof selectedItem === 'object' && selectedItem.label) {
      return selectedItem.label;
    }
    
    const selected = items.find(item => 
      (typeof item === 'object' && item.value === selectedItem) || 
      item === selectedItem
    );
    
    return selected ? 
      (typeof selected === 'object' ? selected.label : selected) : 
      placeholder;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        className={`
          ${width} inline-flex justify-between items-center px-4 py-2 border
          ${error ? 'border-red-300 text-red-900' : 'border-gray-300 text-gray-700'}
          bg-white rounded-md shadow-sm text-sm font-medium
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${buttonClassName}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="truncate">{getSelectedLabel()}</span>
        </div>
        <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {isOpen && (
        <div 
          className={`absolute z-10 mt-1 ${width} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none ${menuClassName}`}
        >
          <div className="py-1 max-h-60 overflow-auto">
            {items.length > 0 ? (
              items.map((item, index) => {
                const itemValue = typeof item === 'object' ? item.value : item;
                const itemLabel = typeof item === 'object' ? item.label : item;
                const isSelected = 
                  selectedItem === itemValue ||
                  (typeof selectedItem === 'object' && selectedItem.value === itemValue);
                
                return (
                  <div
                    key={index}
                    className={`
                      ${isSelected ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700 hover:bg-gray-100'}
                      cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm
                      ${menuItemClassName}
                    `}
                    onClick={() => handleItemClick(typeof item === 'object' ? item : itemValue)}
                  >
                    <div className="flex items-center">
                      {typeof item === 'object' && item.icon && (
                        <span className="mr-2">{item.icon}</span>
                      )}
                      <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                        {itemLabel}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-2 px-3 text-sm text-gray-500">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;