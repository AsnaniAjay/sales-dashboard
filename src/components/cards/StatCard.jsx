// src/components/cards/StatCard.jsx
import React from "react";

const StatCard = ({
  title,
  value,
  previousValue,
  change,
  icon,
  trend = "neutral", // 'up', 'down', or 'neutral'
  isPercentage = false,
  isCurrency = false,
  isLoading = false,
}) => {
  // Calculate change percentage if not provided
  const changePercentage =
    change ??
    (previousValue && value
      ? (((value - previousValue) / previousValue) * 100).toFixed(1)
      : null);

  // Determine if trend is positive or negative based on changePercentage
  const determinedTrend =
    trend === "neutral" && changePercentage
      ? changePercentage > 0
        ? "up"
        : changePercentage < 0
        ? "down"
        : "neutral"
      : trend;

  // Format value
  const formattedValue = () => {
    if (isLoading) return "–";

    if (isPercentage) {
      return `${parseFloat(value).toFixed(1)}%`;
    }

    if (isCurrency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    // If value is a large number, format it with K, M, B suffix
    if (typeof value === "number" && !isPercentage && !isCurrency) {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
    }

    return value;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              {icon}
            </div>
          )}
          <div className={icon ? "ml-5 w-0 flex-1" : "w-full"}>
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div
                  className={`flex items-baseline ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                >
                  <div className="text-2xl font-semibold text-gray-900">
                    {formattedValue()}
                  </div>

                  {!isLoading && changePercentage !== null && (
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        determinedTrend === "up"
                          ? "text-green-600"
                          : determinedTrend === "down"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {determinedTrend === "up" ? (
                        <svg
                          className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : determinedTrend === "down" ? (
                        <svg
                          className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : null}
                      <span className="sr-only">
                        {determinedTrend === "up" ? "Increased" : "Decreased"}{" "}
                        by
                      </span>
                      {Math.abs(changePercentage)}%
                    </div>
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
