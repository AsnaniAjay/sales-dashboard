// src/components/filters/CampaignFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon, XIcon } from '@heroicons/react/solid';
import { FilterIcon } from '@heroicons/react/outline';

const CampaignFilter = ({ 
  campaigns = [], 
  selectedCampaigns = [], 
  onChange,
  showSearch = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

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
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current && showSearch) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  // Toggle campaign selection
  const toggleCampaign = (campaignId) => {
    setSelected(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  // Clear all selections
  const clearSelection = (e) => {
    if (e) e.stopPropagation();
    setSelected([]);
    if (onChange) {
      onChange([]);
    }
  };

  // Apply selected campaigns
  const applySelection = () => {
    if (onChange) {
      onChange(selected);
    }
    setIsOpen(false);
  };

  // Filter campaigns by search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get display text
  const getDisplayText = () => {
    if (selected.length === 0) {
      return 'All Campaigns';
    }
    
    if (selected.length === 1) {
      const campaign = campaigns.find(c => c.id === selected[0]);
      return campaign ? campaign.name : 'Selected Campaign';
    }
    
    return `${selected.length} Campaigns Selected`;
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
          <span className="truncate">{getDisplayText()}</span>
        </div>
        
        <div className="flex items-center">
          {selected.length > 0 && (
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={clearSelection}
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-72 mt-1 bg-white rounded-md shadow-lg right-0">
          <div className="p-3 border border-gray-200 rounded-md">
            {/* Search input */}
            {showSearch && (
              <div className="mb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="block w-full px-3 py-2 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setSearchTerm('')}
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Campaign list */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCampaigns.length === 0 ? (
                <div className="py-2 text-center text-sm text-gray-500">
                  {searchTerm ? 'No matching campaigns found' : 'No campaigns available'}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleCampaign(campaign.id)}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        checked={selected.includes(campaign.id)}
                        onChange={() => {}}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="ml-3 flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{campaign.name}</span>
                        {campaign.channel && (
                          <span className="text-xs text-gray-500">{campaign.channel}</span>
                        )}
                      </div>
                      {campaign.spend && (
                        <span className="ml-auto text-xs text-gray-500">
                          ${campaign.spend.toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Filter actions */}
            <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={clearSelection}
              >
                Clear
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default CampaignFilter;