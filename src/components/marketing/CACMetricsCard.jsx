// src/components/marketing/CACMetricsCard.jsx
import React, { useMemo } from "react";
import { CashIcon, UserAddIcon, UserGroupIcon } from "@heroicons/react/outline";
import Card from "../cards/Card";

const CACMetricsCard = ({ marketingData, customerData, isLoading = false }) => {
  // Calculate CAC and related metrics
  const metrics = useMemo(() => {
    if (!marketingData || !customerData) {
      return {
        cac: 0,
        ltv: 0,
        ltvCacRatio: 0,
        conversionCount: 0,
      };
    }

    // Total marketing spend
    const totalSpend = marketingData.totalSpend || 0;

    // Total conversions
    const conversionCount = marketingData.totalConversions || 0;

    // Customer Acquisition Cost
    const cac = conversionCount > 0 ? totalSpend / conversionCount : 0;

    // Average Customer Lifetime Value
    // We'll use the average LTV from the customer data
    const totalLtv =
      customerData.customers?.reduce(
        (sum, customer) => sum + (customer.lifetimeValue || 0),
        0
      ) || 0;

    const customerCount = customerData.customers?.length || 1;
    const ltv = totalLtv / customerCount;

    // LTV:CAC Ratio (a key SaaS metric)
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;

    return {
      cac,
      ltv,
      ltvCacRatio,
      conversionCount,
    };
  }, [marketingData, customerData]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get color class for LTV:CAC ratio
  const getLtvCacRatioColor = (ratio) => {
    if (ratio >= 3) return "text-green-600"; // Excellent
    if (ratio >= 2) return "text-blue-600"; // Good
    if (ratio >= 1) return "text-yellow-600"; // Fair
    return "text-red-600"; // Poor
  };

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse p-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 md:p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Acquisition Metrics
        </h3>

        <div className="flex flex-col gap-4">
          {/* CAC Card */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-3 mr-4 flex-shrink-0">
                <CashIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500">Customer Acquisition Cost</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.cac)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Average cost to acquire a new customer
                </p>
              </div>
            </div>
          </div>

          {/* LTV Card */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-3 mr-4 flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500">Customer Lifetime Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.ltv)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Average revenue generated per customer
                </p>
              </div>
            </div>
          </div>

          {/* LTV:CAC Ratio Card */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-3 mr-4 flex-shrink-0">
                <UserAddIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500">LTV:CAC Ratio</p>
                <p
                  className={`text-3xl font-bold mt-1 ${getLtvCacRatioColor(
                    metrics.ltvCacRatio
                  )}`}
                >
                  {metrics.ltvCacRatio.toFixed(2)}x
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Ratio of customer value to acquisition cost
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CAC by Channel */}
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            CAC by Channel
          </h4>
          <div className="space-y-3">
            {marketingData.channelMetrics?.map((channel) => {
              const channelCAC =
                channel.conversions > 0
                  ? channel.spend / channel.conversions
                  : 0;

              return (
                <div
                  key={channel.name}
                  className="flex items-center justify-between py-2 px-1"
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600 mr-3"></div>
                    <span className="text-base text-gray-700">
                      {channel.name}
                    </span>
                  </div>
                  <span className="text-base font-medium text-gray-900">
                    {formatCurrency(channelCAC)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payback Period */}
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-700 font-medium">
              CAC Payback Period
            </span>
            <span className="text-base font-semibold text-gray-900">
              {metrics.cac > 0 && metrics.ltv > 0
                ? `${Math.round(metrics.cac / (metrics.ltv / 12))} months`
                : "N/A"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Time required to recoup the cost of acquiring a customer
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CACMetricsCard;
