// src/data/marketingData.js
// This file provides sample marketing data to work with the ROAS dashboard components

const marketingData = {
    // Overall marketing metrics
    totalSpend: 25000,
    totalRevenue: 62500,
    totalConversions: 125,
    
    // Campaign data
    campaigns: [
      {
        id: "c001",
        name: "Q1 Product Launch",
        channel: "Google Ads",
        spend: 8500,
        revenue: 21250,
        impressions: 180000,
        clicks: 9000,
        conversions: 42,
        startDate: "2025-01-15",
        endDate: "2025-03-15"
      },
      {
        id: "c002",
        name: "Spring Promotion",
        channel: "Facebook",
        spend: 6200,
        revenue: 15500,
        impressions: 250000,
        clicks: 7500,
        conversions: 31,
        startDate: "2025-02-20",
        endDate: "2025-03-20"
      },
      {
        id: "c003",
        name: "Enterprise Solution Campaign",
        channel: "LinkedIn",
        spend: 4800,
        revenue: 14400,
        impressions: 75000,
        clicks: 3000,
        conversions: 12,
        startDate: "2025-01-10",
        endDate: "2025-03-10"
      },
      {
        id: "c004",
        name: "Remarketing Campaign",
        channel: "Google Ads",
        spend: 3000,
        revenue: 7500,
        impressions: 120000,
        clicks: 6000,
        conversions: 25,
        startDate: "2025-02-01",
        endDate: "2025-03-31"
      },
      {
        id: "c005",
        name: "Email Newsletter",
        channel: "Email",
        spend: 1500,
        revenue: 3000,
        impressions: 50000,
        clicks: 2500,
        conversions: 10,
        startDate: "2025-03-01",
        endDate: "2025-03-31"
      },
      {
        id: "c006",
        name: "Content Promotion",
        channel: "Twitter",
        spend: 1000,
        revenue: 850,
        impressions: 45000,
        clicks: 1800,
        conversions: 5,
        startDate: "2025-02-15",
        endDate: "2025-03-15"
      }
    ],
    
    // Channel metrics (aggregated from campaigns)
    channelMetrics: [
      {
        name: "Google Ads",
        spend: 11500,
        revenue: 28750,
        impressions: 300000,
        clicks: 15000,
        conversions: 67,
        cpc: 0.77,
        conversionRate: 0.45
      },
      {
        name: "Facebook",
        spend: 6200,
        revenue: 15500,
        impressions: 250000,
        clicks: 7500,
        conversions: 31,
        cpc: 0.83,
        conversionRate: 0.41
      },
      {
        name: "LinkedIn",
        spend: 4800,
        revenue: 14400,
        impressions: 75000,
        clicks: 3000,
        conversions: 12,
        cpc: 1.60,
        conversionRate: 0.40
      },
      {
        name: "Email",
        spend: 1500,
        revenue: 3000,
        impressions: 50000,
        clicks: 2500,
        conversions: 10,
        cpc: 0.60,
        conversionRate: 0.40
      },
      {
        name: "Twitter",
        spend: 1000,
        revenue: 850,
        impressions: 45000,
        clicks: 1800,
        conversions: 5,
        cpc: 0.56,
        conversionRate: 0.28
      }
    ],
    
    // Daily metrics for trend analysis
    dailyMetrics: [
      { date: "2025-03-01", spend: 800, revenue: 2000, conversions: 4 },
      { date: "2025-03-02", spend: 850, revenue: 2125, conversions: 5 },
      { date: "2025-03-03", spend: 700, revenue: 1750, conversions: 3 },
      { date: "2025-03-04", spend: 900, revenue: 2250, conversions: 5 },
      { date: "2025-03-05", spend: 750, revenue: 1875, conversions: 4 },
      { date: "2025-03-06", spend: 800, revenue: 2000, conversions: 4 },
      { date: "2025-03-07", spend: 700, revenue: 1750, conversions: 3 },
      { date: "2025-03-08", spend: 600, revenue: 1500, conversions: 3 },
      { date: "2025-03-09", spend: 550, revenue: 1375, conversions: 3 },
      { date: "2025-03-10", spend: 900, revenue: 2250, conversions: 5 },
      { date: "2025-03-11", spend: 950, revenue: 2375, conversions: 5 },
      { date: "2025-03-12", spend: 850, revenue: 2125, conversions: 4 },
      { date: "2025-03-13", spend: 800, revenue: 2000, conversions: 4 },
      { date: "2025-03-14", spend: 750, revenue: 1875, conversions: 4 },
      { date: "2025-03-15", spend: 850, revenue: 2125, conversions: 5 },
      { date: "2025-03-16", spend: 700, revenue: 1750, conversions: 3 },
      { date: "2025-03-17", spend: 650, revenue: 1625, conversions: 3 },
      { date: "2025-03-18", spend: 900, revenue: 2250, conversions: 5 },
      { date: "2025-03-19", spend: 850, revenue: 2125, conversions: 4 },
      { date: "2025-03-20", spend: 800, revenue: 2000, conversions: 4 },
      { date: "2025-03-21", spend: 750, revenue: 1875, conversions: 4 },
      { date: "2025-03-22", spend: 650, revenue: 1625, conversions: 3 },
      { date: "2025-03-23", spend: 600, revenue: 1500, conversions: 3 },
      { date: "2025-03-24", spend: 950, revenue: 2375, conversions: 5 },
      { date: "2025-03-25", spend: 900, revenue: 2250, conversions: 4 },
      { date: "2025-03-26", spend: 850, revenue: 2125, conversions: 4 },
      { date: "2025-03-27", spend: 800, revenue: 2000, conversions: 4 },
      { date: "2025-03-28", spend: 750, revenue: 1875, conversions: 3 },
      { date: "2025-03-29", spend: 700, revenue: 1750, conversions: 3 },
      { date: "2025-03-30", spend: 850, revenue: 2125, conversions: 4 },
      { date: "2025-03-31", spend: 900, revenue: 2250, conversions: 5 }
    ],
    
    // Previous period data for comparison
    previousPeriodData: {
      totalSpend: 22000,
      totalRevenue: 49500,
      totalConversions: 110,
      
      campaigns: [
        {
          id: "p001",
          name: "Q4 Product Promotion",
          channel: "Google Ads",
          spend: 7500,
          revenue: 16875,
          conversions: 38
        },
        {
          id: "p002",
          name: "Winter Holiday Campaign",
          channel: "Facebook",
          spend: 5800,
          revenue: 13050,
          conversions: 29
        },
        {
          id: "p003",
          name: "B2B Lead Generation",
          channel: "LinkedIn",
          spend: 4200,
          revenue: 11340,
          conversions: 10
        },
        {
          id: "p004",
          name: "Remarketing Campaign",
          channel: "Google Ads",
          spend: 2600,
          revenue: 5850,
          conversions: 23
        },
        {
          id: "p005",
          name: "Email Campaign",
          channel: "Email",
          spend: 1200,
          revenue: 2160,
          conversions: 8
        },
        {
          id: "p006",
          name: "Social Media Promotion",
          channel: "Twitter",
          spend: 700,
          revenue: 525,
          conversions: 2
        }
      ]
    }
  };
  
  export default marketingData;