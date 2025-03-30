// src/pages/ProductPerformance.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SearchFilter from "../components/filters/SearchFilter";
import CategoryFilter from "../components/filters/CategoryFilter";
import ProductsTable from "../components/tables/ProductsTable";
import StatCard from "../components/cards/StatCard";
import KpiCard from "../components/cards/KpiCard";
import PieChart from "../components/charts/PieChart";
import Tabs from "../components/ui/Tabs";
import { useDashboard } from "../context/DashboardContext";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import { findTopItems, groupByField, sumByField } from "../utils/calculators";
import {
  TrendingUpIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/outline";

const ProductPerformance = () => {
  const {
    productData,
    isLoading,
    filterOptions,
    filters,
    updateFilters,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Ref for scrollable tabs container
  const tabsContainerRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Check if scrolling is needed
  useEffect(() => {
    const checkForScrollButtons = () => {
      if (tabsContainerRef.current) {
        const { scrollWidth, clientWidth } = tabsContainerRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };

    checkForScrollButtons();
    window.addEventListener('resize', checkForScrollButtons);
    
    return () => {
      window.removeEventListener('resize', checkForScrollButtons);
    };
  }, []);

  // Scroll tabs left/right
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const scrollAmount = container.clientWidth / 2;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Update category filter
  useEffect(() => {
    setSelectedCategories(filters.categories || []);
  }, [filters.categories]);

  // Handle search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ productSearchTerm: searchTerm });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, updateFilters]);

  // Handle category filter change
  const handleCategoryChange = (selected) => {
    setSelectedCategories(selected);
    updateFilters({ categories: selected });
  };

  // Filter products based on search and categories
  const filteredProducts = useMemo(() => {
    if (!productData) return [];

    let result = [...productData];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply tab filter
    if (activeTab === "trending") {
      result = result.filter((product) => product.trending);
    } else if (activeTab === "high-margin") {
      result = result.filter((product) => product.profitMargin >= 70);
    } else if (activeTab === "low-margin") {
      result = result.filter((product) => product.profitMargin < 60);
    }

    return result;
  }, [productData, searchTerm, selectedCategories, activeTab]);

  // Calculate product metrics
  const productMetrics = useMemo(() => {
    if (!productData || productData.length === 0) {
      return {
        totalProducts: 0,
        totalRevenue: 0,
        averageMargin: 0,
        trendingProducts: 0,
      };
    }

    const totalProducts = productData.length;
    const totalRevenue = sumByField(productData, "revenueGenerated");

    // Average margin (weighted by revenue)
    const weightedMargin = productData.reduce((sum, product) => {
      return sum + product.profitMargin * product.revenueGenerated;
    }, 0);
    const averageMargin = weightedMargin / totalRevenue;

    // Count trending products
    const trendingProducts = productData.filter(
      (product) => product.trending
    ).length;

    // Top categories by revenue
    const productsByCategory = groupByField(productData, "category");
    const categoryRevenue = Object.entries(productsByCategory)
      .map(([category, products]) => ({
        name: category,
        value: sumByField(products, "revenueGenerated"),
      }))
      .sort((a, b) => b.value - a.value);

    // Top products
    const topProducts = findTopItems(productData, "revenueGenerated", 5);

    return {
      totalProducts,
      totalRevenue,
      averageMargin,
      trendingProducts,
      categoryRevenue,
      topProducts,
    };
  }, [productData]);

  // Tabs configuration
  const tabs = [
    { id: "all", label: "All Products" },
    { id: "trending", label: "Trending" },
    { id: "high-margin", label: "High Margin" },
    { id: "low-margin", label: "Low Margin" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Product Performance
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Analyze and track the performance of your products
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Products"
          value={productMetrics.totalProducts}
          color="blue"
          icon={<ShoppingBagIcon className="h-6 w-6 text-blue-600" />}
          format="number"
          isLoading={isLoading}
        />
        <KpiCard
          title="Total Revenue"
          value={productMetrics.totalRevenue}
          color="green"
          icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
          format="currency"
          isLoading={isLoading}
        />
        <KpiCard
          title="Average Margin"
          value={productMetrics.averageMargin}
          color="purple"
          icon={<CashIcon className="h-6 w-6 text-purple-600" />}
          format="percentage"
          isLoading={isLoading}
        />
        <KpiCard
          title="Trending Products"
          value={productMetrics.trendingProducts}
          color="yellow"
          icon={<TrendingUpIcon className="h-6 w-6 text-yellow-600" />}
          format="number"
          isLoading={isLoading}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <SearchFilter
            onSearch={setSearchTerm}
            placeholder="Search products..."
            initialValue={searchTerm}
          />
        </div>
        <div className="lg:col-span-2">
          <CategoryFilter
            categories={filterOptions.categories || []}
            selectedCategories={selectedCategories}
            onChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* Analysis Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue by Category Pie Chart */}
        <div>
          {productMetrics.categoryRevenue && (
            <PieChart
              data={productMetrics.categoryRevenue}
              dataKey="value"
              nameKey="name"
              title="Revenue by Category"
              description="Distribution of revenue across product categories"
              donut={true}
            />
          )}
        </div>

        {/* Top 5 Products List */}
        <div className="lg:col-span-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Top Performing Products
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Products generating the most revenue
              </p>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {productMetrics.topProducts?.map((product) => (
                  <li key={product.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {product.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {formatCurrency(product.revenueGenerated)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Category: {product.category}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        Margin: {formatPercentage(product.profitMargin / 100)}
                        {product.trending && (
                          <TrendingUpIcon className="ml-1 h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table with Scrollable Tabs */}
      <div className="mb-6">
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <div className="relative flex items-center">
              {/* Left scroll button */}
              {showScrollButtons && (
                <button 
                  onClick={() => scrollTabs('left')}
                  className="absolute left-0 z-10 bg-gradient-to-r from-white via-white to-transparent pl-2 pr-4 py-4 focus:outline-none"
                  aria-label="Scroll tabs left"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
              
              {/* Scrollable tabs container */}
              <div 
                ref={tabsContainerRef} 
                className="flex overflow-x-auto scrollbar-hide space-x-8 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex-shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        activeTab === tab.id
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Right scroll button */}
              {showScrollButtons && (
                <button 
                  onClick={() => scrollTabs('right')}
                  className="absolute right-0 z-10 bg-gradient-to-l from-white via-white to-transparent pr-2 pl-4 py-4 focus:outline-none"
                  aria-label="Scroll tabs right"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <ProductsTable data={filteredProducts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductPerformance;