// src/components/filters/ChannelFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon, XIcon } from '@heroicons/react/solid';
import { FilterIcon } from '@heroicons/react/outline';

const ChannelFilter = ({ channels = [], selectedChannels = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedChannels);
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
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

  // Toggle selection of a channel
  const toggleChannel = (channelId) => {
    setSelected(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };

  // Clear all selections
  const clearSelection = (e) => {
    e.stopPropagation();
    setSelected([]);
    if (onChange) {
      onChange([]);
    }
  };

  // Apply selected channels
  const applySelection = () => {
    if (onChange) {
      onChange(selected);
    }
    setIsOpen(false);
  };

  // Select all channels
  const selectAll = () => {
    setSelected(channels.map(channel => channel.id));
  };

  // Get display text
  const getDisplayText = () => {
    if (selected.length === 0) {
      return 'All Channels';
    }
    
    if (selected.length === 1) {
      const channel = channels.find(c => c.id === selected[0]);
      return channel ? channel.name : 'Selected Channel';
    }
    
    return `${selected.length} Channels Selected`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter button */}
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <FilterIcon className="w-5 h-5 mr-2 text-gray-400" />
          <span>{getDisplayText()}</span>
        </div>
        
        <div className="flex items-center">
          {selected.length > 0 && (
            <button
              type="button"
              className="p-1 ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={clearSelection}
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
          <ChevronDownIcon className="w-5 h-5 ml-1 text-gray-400" />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="p-3 border border-gray-200 rounded-md">
            {/* Dropdown header */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Filter by Channel</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={selectAll}
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={clearSelection}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Channel list */}
            <div className="max-h-60 overflow-y-auto">
              {channels.length === 0 ? (
                <div className="py-2 text-center text-sm text-gray-500">
                  No channels available
                </div>
              ) : (
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleChannel(channel.id)}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 border rounded-md flex items-center justify-center ${
                        selected.includes(channel.id) 
                          ? 'bg-indigo-600 border-transparent' 
                          : 'border-gray-300'
                      }`}>
                        {selected.includes(channel.id) && (
                          <CheckIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="ml-2 text-sm text-gray-700">{channel.name}</span>
                      {channel.count && (
                        <span className="ml-auto text-xs text-gray-500">
                          {channel.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3 pt-2 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={applySelection}
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

export default ChannelFilter;