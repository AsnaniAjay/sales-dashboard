// src/components/filters/FilterContainer.jsx
import React from 'react';
import DateRangeFilter from './DateRangeFilter';
import ChannelFilter from './ChannelFilter';
import CampaignFilter from './CampaignFilter';

const FilterContainer = ({ 
  marketingData, 
  selectedFilters = {}, 
  onFilterChange,
  availableFilters = ['date', 'channel', 'campaign']
}) => {
  // Handler for date range changes
  const handleDateChange = (dateRange) => {
    if (onFilterChange) {
      onFilterChange({
        ...selectedFilters,
        dateRange
      });
    }
  };

  // Handler for channel filter changes
  const handleChannelChange = (channels) => {
    if (onFilterChange) {
      onFilterChange({
        ...selectedFilters,
        channels
      });
    }
  };

  // Handler for campaign filter changes
  const handleCampaignChange = (campaigns) => {
    if (onFilterChange) {
      onFilterChange({
        ...selectedFilters,
        campaigns
      });
    }
  };

  // Extract channel data for filter
  const channelOptions = marketingData?.channelMetrics 
    ? marketingData.channelMetrics.map(channel => ({
      id: channel.name,
      name: channel.name,
      count: channel.conversions
    }))
    : [];

  // Extract campaign data for filter
  const campaignOptions = marketingData?.campaigns 
    ? marketingData.campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      channel: campaign.channel,
      spend: campaign.spend
    }))
    : [];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Filters</h3>
        <p className="text-sm text-gray-500">Refine your marketing performance data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date range filter */}
        {availableFilters.includes('date') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <DateRangeFilter
              onChange={handleDateChange}
              initialStartDate={selectedFilters.dateRange?.startDate}
              initialEndDate={selectedFilters.dateRange?.endDate}
            />
          </div>
        )}

        {/* Channel filter */}
        {availableFilters.includes('channel') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Channel</label>
            <ChannelFilter
              channels={channelOptions}
              selectedChannels={selectedFilters.channels || []}
              onChange={handleChannelChange}
            />
          </div>
        )}

        {/* Campaign filter */}
        {availableFilters.includes('campaign') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign</label>
            <CampaignFilter
              campaigns={campaignOptions}
              selectedCampaigns={selectedFilters.campaigns || []}
              onChange={handleCampaignChange}
            />
          </div>
        )}

        {/* Additional filter slots can be added here */}
      </div>

      {/* Active filters display */}
      {(selectedFilters.dateRange?.startDate || 
        (selectedFilters.channels && selectedFilters.channels.length > 0) || 
        (selectedFilters.campaigns && selectedFilters.campaigns.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Active Filters:</span>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.dateRange?.startDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Date Range
                </span>
              )}
              
              {selectedFilters.channels && selectedFilters.channels.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {selectedFilters.channels.length === 1 
                    ? channelOptions.find(c => c.id === selectedFilters.channels[0])?.name || 'Channel'
                    : `${selectedFilters.channels.length} Channels`}
                </span>
              )}
              
              {selectedFilters.campaigns && selectedFilters.campaigns.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {selectedFilters.campaigns.length === 1 
                    ? campaignOptions.find(c => c.id === selectedFilters.campaigns[0])?.name || 'Campaign'
                    : `${selectedFilters.campaigns.length} Campaigns`}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterContainer;