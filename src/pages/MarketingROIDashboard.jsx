// src/pages/MarketingROIDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";

// Import ROAS dashboard components
import ROASMetricCard from "../components/marketing/ROASMetricCard";
import MarketingSpendChart from "../components/marketing/MarketingSpendChart";
import ChannelComparisonChart from "../components/marketing/ChannelComparisonChart";
import CampaignROASTable from "../components/marketing/CampaignROASTable";
import ConversionFunnel from "../components/marketing/ConversionFunnel";
import CACMetricsCard from "../components/marketing/CACMetricsCard";
import AttributionSelector from "../components/marketing/AttributionSelector";
import ROASGoalTracker from "../components/marketing/ROASGoalTracker";
import FilterContainer from "../components/filters/FilterContainer";

// Import mock data
import marketingData from "../data/marketingData";

const MarketingROIDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: {},
    channels: [],
    campaigns: [],
    attributionModel: "lastClick",
  });
  const [customerData] = useState({
    customers: [
      {
        id: "c001",
        name: "Acme Corp",
        industry: "Manufacturing",
        size: "Enterprise",
        region: "North America",
        joinDate: "2024-05-15",
        lifetimeValue: 6798.49,
        orderCount: 4,
        lastPurchaseDate: "2025-03-24",
        status: "active",
        contactPerson: "Jane Wilson",
        email: "jwilson@acmecorp.com",
      },
      // Add more customers from your mock data
    ],
  });

  // ROAS goals configuration
  const roasGoals = {
    below: 1,
    fair: 2,
    good: 3,
    excellent: 4,
  };

  // Simulate data loading
  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      // In a real app, you would fetch data from an API here
      // For now, we'll just use a timeout to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsLoading(false);
    };

    loadData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  // Handle attribution model changes
  const handleAttributionModelChange = (model) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      attributionModel: model,
    }));
  };

  // Apply filters to marketing data
  const filteredData = useMemo(() => {
    if (!marketingData) return null;

    // Create a deep copy of the marketing data
    const data = JSON.parse(JSON.stringify(marketingData));

    // Filter campaigns based on selected filters
    if (filters.campaigns && filters.campaigns.length > 0) {
      data.campaigns = data.campaigns.filter((campaign) =>
        filters.campaigns.includes(campaign.id)
      );
    }

    // Filter channel metrics based on selected channels
    if (filters.channels && filters.channels.length > 0) {
      data.channelMetrics = data.channelMetrics.filter((channel) =>
        filters.channels.includes(channel.name)
      );
    }

    // In a real app, you would also filter by date range here
    // For now, we'll just return the filtered data

    return data;
  }, [marketingData, filters]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Marketing ROI Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Track and analyze your marketing return on investment (ROAS)
        </p>
      </div>

      {/* Filters */}
      <FilterContainer
        marketingData={marketingData}
        selectedFilters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Charts Row 1 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MarketingSpendChart
          marketingData={filteredData}
          isLoading={isLoading}
        />
        <ChannelComparisonChart
          marketingData={filteredData}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ConversionFunnel
            marketingData={filteredData}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <AttributionSelector
            onModelChange={handleAttributionModelChange}
            initialModel={filters.attributionModel}
          />
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ROASMetricCard
          marketingData={filteredData}
          previousPeriodData={marketingData?.previousPeriodData}
          isLoading={isLoading}
        />
        <CACMetricsCard
          marketingData={filteredData}
          customerData={customerData}
          isLoading={isLoading}
        />
        <ROASGoalTracker
          marketingData={filteredData}
          goals={roasGoals}
          isLoading={isLoading}
        />
      </div>
      {/* Campaign Table */}
      <div className="mb-6">
        <CampaignROASTable marketingData={filteredData} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default MarketingROIDashboard;
