// src/components/revenue/RevenueCalendar.jsx
import React, { useState, useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Card from "../cards/Card";
import Dropdown from "../ui/Dropdown";

const RevenueCalendar = ({ salesData = [] }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Available years in the data
  const availableYears = useMemo(() => {
    if (!salesData || !salesData.length) return [new Date().getFullYear()];

    const years = new Set();
    salesData.forEach((sale) => {
      const date = new Date(sale.date);
      if (!isNaN(date.getTime())) {
        years.add(date.getFullYear());
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [salesData]);

  // Month options
  const monthOptions = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  // Year options
  const yearOptions = availableYears.map((year) => ({
    value: year,
    label: year.toString(),
  }));

  // Process data for calendar heatmap
  const calendarData = useMemo(() => {
    if (!salesData || !salesData.length) return [];

    // Filter data for selected year and month
    const filteredSales = salesData.filter((sale) => {
      const date = new Date(sale.date);
      return (
        date.getFullYear() === selectedYear && date.getMonth() === selectedMonth
      );
    });

    // Group by day of month
    const dailyData = {};

    // Initialize all days of the month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      dailyData[i] = {
        day: i,
        date: new Date(selectedYear, selectedMonth, i),
        revenue: 0,
        sales: 0,
        dayOfWeek: new Date(selectedYear, selectedMonth, i).getDay(),
      };
    }

    // Populate with actual sales data
    filteredSales.forEach((sale) => {
      const date = new Date(sale.date);
      const dayOfMonth = date.getDate();

      if (dailyData[dayOfMonth]) {
        dailyData[dayOfMonth].revenue += sale.amount || 0;
        dailyData[dayOfMonth].sales += 1;
      }
    });

    // Convert to array
    return Object.values(dailyData);
  }, [salesData, selectedYear, selectedMonth]);

  // Calculate max revenue for color scaling
  const maxRevenue = useMemo(() => {
    if (!calendarData || !calendarData.length) return 1000;

    return Math.max(...calendarData.map((day) => day.revenue));
  }, [calendarData]);

  // Calculate intensity for heatmap
  const getIntensity = (value) => {
    if (value === 0) return 0;
    // Calculate logarithmic scale for better visualization
    const intensity = Math.log(value + 1) / Math.log(maxRevenue + 1);
    return Math.max(0.1, Math.min(1, intensity)); // Range 0.1 to 1
  };

  // Get bg color class based on intensity - using lighter colors
  const getBgColorClass = (intensity) => {
    if (intensity === 0) return "bg-gray-50";
    if (intensity < 0.25) return "bg-blue-100";
    if (intensity < 0.5) return "bg-blue-200";
    if (intensity < 0.75) return "bg-blue-300";
    return "bg-blue-500";
  };

  // Format currency - formatted for mobile
  const formatCurrency = (value) => {
    // More compact formatting for smaller screens
    if (window.innerWidth < 640) {
      // sm breakpoint
      if (value >= 1000) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value);
      }
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle year change
  const handleYearChange = (option) => {
    setSelectedYear(option.value);
  };

  // Handle month change
  const handleMonthChange = (option) => {
    setSelectedMonth(option.value);
  };

  // Day of week headers - responsive
  const dayOfWeekHeadersFull = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  const dayOfWeekHeadersShort = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card>
      <div className="flex flex-col space-y-4">
        {/* Title and Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <FaCalendarAlt className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Revenue Calendar
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-32">
              <Dropdown
                items={monthOptions}
                selectedItem={monthOptions.find(
                  (option) => option.value === selectedMonth
                )}
                onChange={handleMonthChange}
                width="w-full"
              />
            </div>
            <div className="w-24">
              <Dropdown
                items={yearOptions}
                selectedItem={yearOptions.find(
                  (option) => option.value === selectedYear
                )}
                onChange={handleYearChange}
                width="w-full"
              />
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto overflow-y-hidden">
          <div className="min-w-full">
            {/* Day of week headers - responsive */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayOfWeekHeadersShort.map((day, index) => (
                <div
                  key={index}
                  className="p-1 text-xs font-medium text-gray-500 text-center sm:hidden"
                >
                  {day}
                </div>
              ))}
              {dayOfWeekHeadersFull.map((day, index) => (
                <div
                  key={`full-${index}`}
                  className="p-1 text-xs font-medium text-gray-500 text-center hidden sm:block"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the 1st of the month */}
              {Array.from({ length: calendarData[0]?.dayOfWeek || 0 }).map(
                (_, i) => (
                  <div
                    key={`empty-start-${i}`}
                    className="h-12 md:h-16 p-1 rounded-md bg-gray-50"
                  ></div>
                )
              )}

              {/* Day cells */}
              {calendarData.map((day) => {
                const intensity = getIntensity(day.revenue);
                const bgColorClass = getBgColorClass(intensity);

                return (
                  <div
                    key={day.day}
                    className={`h-12 md:h-16 rounded-md ${bgColorClass} hover:bg-blue-400 flex flex-col justify-between p-1`}
                  >
                    <div className="text-xs font-medium text-gray-900">
                      {day.day}
                    </div>
                    {day.revenue > 0 && (
                      <div className="text-xs font-medium text-white text-gray-900 truncate">
                        {formatCurrency(day.revenue)}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Empty cells for days after the last day of the month */}
              {Array.from({
                length:
                  calendarData.length > 0
                    ? (7 -
                        ((calendarData[calendarData.length - 1]?.dayOfWeek +
                          1) %
                          7)) %
                      7
                    : 0,
              }).map((_, i) => (
                <div
                  key={`empty-end-${i}`}
                  className="h-12 md:h-16 p-1 rounded-md bg-gray-50"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend - responsive */}
        <div className="mt-2 flex flex-wrap justify-end gap-x-2 gap-y-1">
          <div className="text-xs text-gray-500 mr-1">Revenue:</div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-gray-50 mr-1"></div>
            <span className="text-xs text-gray-500">$0</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-blue-100 mr-1"></div>
            <span className="text-xs text-gray-500">Low</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-blue-200 mr-1"></div>
            <span className="text-xs text-gray-500">Medium</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-blue-300 mr-1"></div>
            <span className="text-xs text-gray-500">High</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-500">Very High</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RevenueCalendar;
