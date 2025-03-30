// src/components/marketing/CampaignROASTable.jsx
import React, { useState, useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import Card from "../cards/Card";

const CampaignROASTable = ({ marketingData, isLoading = false }) => {
  const [sortField, setSortField] = useState("roas");
  const [sortDirection, setSortDirection] = useState("desc");

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  // Calculate and prepare campaign data
  const campaignData = useMemo(() => {
    if (!marketingData || !marketingData.campaigns) return [];

    return marketingData.campaigns.map((campaign) => {
      const conversions = campaign.conversions || 0;
      const clicks = campaign.clicks || 0;

      return {
        ...campaign,
        roas: campaign.revenue / campaign.spend,
        cpa: campaign.spend / conversions,
        conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      };
    });
  }, [marketingData]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!campaignData.length) return [];

    return [...campaignData].sort((a, b) => {
      let comparison = 0;

      if (a[sortField] > b[sortField]) {
        comparison = 1;
      } else if (a[sortField] < b[sortField]) {
        comparison = -1;
      }

      return sortDirection === "desc" ? comparison * -1 : comparison;
    });
  }, [campaignData, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;

    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline ml-1" />
    );
  };

  // Get color class based on ROAS value
  const getRoasColorClass = (roas) => {
    if (roas >= 4) return "text-green-600";
    if (roas >= 2) return "text-blue-600";
    if (roas >= 1) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Campaign Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Campaign {renderSortIcon("name")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("channel")}
                >
                  Channel {renderSortIcon("channel")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("spend")}
                >
                  Spend {renderSortIcon("spend")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("revenue")}
                >
                  Revenue {renderSortIcon("revenue")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("roas")}
                >
                  ROAS {renderSortIcon("roas")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("conversions")}
                >
                  Conversions {renderSortIcon("conversions")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("cpa")}
                >
                  CPA {renderSortIcon("cpa")}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("conversionRate")}
                >
                  Conv. Rate {renderSortIcon("conversionRate")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {campaign.channel}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(campaign.spend)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(campaign.revenue)}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${getRoasColorClass(
                      campaign.roas
                    )}`}
                  >
                    {campaign.roas.toFixed(2)}x
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {campaign.conversions}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(campaign.cpa)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatPercentage(campaign.conversionRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedData.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No campaign data available</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CampaignROASTable;
