// src/pages/Settings.jsx
import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import Tabs from "../components/ui/Tabs";
import Modal from "../components/ui/Modal";
import { useDashboard } from "../context/DashboardContext";
import {
  CogIcon,
  BellIcon,
  UserIcon,
  ColorSwatchIcon,
  DatabaseIcon,
  SaveIcon,
  EyeIcon,
} from "@heroicons/react/outline";

// Import useAuth from your Auth context (create if not exists)
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { resetFilters } = useDashboard();
  const { user, updateUserProfile } = useAuth(); // Get user and update function from Auth context

  const [activeTab, setActiveTab] = useState("profile");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [formProfile, setFormProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    role: user?.role || "admin"
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    salesSummary: true,
    productAlerts: false,
    performanceReports: true,
  });
  const [dashboardSettings, setDashboardSettings] = useState({
    defaultView: "overview",
    compactMode: false, // Replaced darkMode with compactMode
    autoRefresh: true,
    refreshInterval: 30,
    showCurrency: "USD", // New setting
  });

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle toggling notification settings
  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle changing dashboard settings
  const updateDashboardSetting = (key, value) => {
    setDashboardSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle profile save
  const saveProfile = () => {
    // Update the user profile in context/API
    updateUserProfile(formProfile);
    
    // Show saved message
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Handle save preferences
  const savePreferences = () => {
    // Here you'd typically save to API or localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Show saved message
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Handle save settings
  const saveSettings = () => {
    // Here you'd typically save to API or localStorage
    localStorage.setItem('dashboardSettings', JSON.stringify(dashboardSettings));
    
    // Show saved message
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Handle reset confirmation
  const handleResetData = () => {
    resetFilters();
    setShowResetModal(false);
    // In a real app, this might also clear other stored preferences
  };

  // Tabs configuration
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <UserIcon className="h-4 w-4" />,
      content: (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h3>
            {showSavedMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Profile updated successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formProfile.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formProfile.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formProfile.role}
                  onChange={handleProfileChange}
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Sales Manager</option>
                  <option value="analyst">Analyst</option>
                  <option value="user">Regular User</option>
                </select>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <Button variant="secondary" className="mr-3">
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    icon={<SaveIcon className="h-4 w-4" />}
                    iconPosition="left"
                    onClick={saveProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon className="h-4 w-4" />,
      content: (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Notification Settings
            </h3>
            {showSavedMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Notification preferences saved successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-6">
              <fieldset>
                <legend className="text-sm font-medium text-gray-900">
                  Email Notifications
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailAlerts"
                        name="emailAlerts"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notifications.emailAlerts}
                        onChange={() => toggleNotification("emailAlerts")}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="emailAlerts"
                        className="font-medium text-gray-700"
                      >
                        Email Alerts
                      </label>
                      <p className="text-gray-500">
                        Receive important alerts via email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="salesSummary"
                        name="salesSummary"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notifications.salesSummary}
                        onChange={() => toggleNotification("salesSummary")}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="salesSummary"
                        className="font-medium text-gray-700"
                      >
                        Sales Summary
                      </label>
                      <p className="text-gray-500">
                        Receive daily sales summary reports.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="productAlerts"
                        name="productAlerts"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notifications.productAlerts}
                        onChange={() => toggleNotification("productAlerts")}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="productAlerts"
                        className="font-medium text-gray-700"
                      >
                        Product Alerts
                      </label>
                      <p className="text-gray-500">
                        Get notified about product performance changes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="performanceReports"
                        name="performanceReports"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={notifications.performanceReports}
                        onChange={() =>
                          toggleNotification("performanceReports")
                        }
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="performanceReports"
                        className="font-medium text-gray-700"
                      >
                        Performance Reports
                      </label>
                      <p className="text-gray-500">
                        Weekly performance reports and insights.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className="pt-5">
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    icon={<SaveIcon className="h-4 w-4" />}
                    iconPosition="left"
                    onClick={savePreferences}
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <ColorSwatchIcon className="h-4 w-4" />,
      content: (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Display Settings
            </h3>
            {showSavedMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Display settings saved successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-5 space-y-6">
              <div>
                <label
                  htmlFor="defaultView"
                  className="block text-sm font-medium text-gray-700"
                >
                  Default Dashboard View
                </label>
                <select
                  id="defaultView"
                  name="defaultView"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={dashboardSettings.defaultView}
                  onChange={(e) =>
                    updateDashboardSetting("defaultView", e.target.value)
                  }
                >
                  <option value="overview">Overview</option>
                  <option value="sales">Sales Analysis</option>
                  <option value="products">Product Performance</option>
                </select>
              </div>

              {/* Currency Selection - New Setting */}
              <div>
                <label
                  htmlFor="showCurrency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display Currency
                </label>
                <select
                  id="showCurrency"
                  name="showCurrency"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={dashboardSettings.showCurrency}
                  onChange={(e) =>
                    updateDashboardSetting("showCurrency", e.target.value)
                  }
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                  <option value="INR">Indian Rupee (₹)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Choose which currency to display for monetary values throughout the dashboard.
                </p>
              </div>

              {/* Compact Mode - Replacing Dark Mode */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="compactMode"
                    name="compactMode"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={dashboardSettings.compactMode}
                    onChange={() =>
                      updateDashboardSetting(
                        "compactMode",
                        !dashboardSettings.compactMode
                      )
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="compactMode"
                    className="font-medium text-gray-700"
                  >
                    Compact Mode
                  </label>
                  <p className="text-gray-500">
                    Use a more compact layout with higher information density.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="autoRefresh"
                    name="autoRefresh"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={dashboardSettings.autoRefresh}
                    onChange={() =>
                      updateDashboardSetting(
                        "autoRefresh",
                        !dashboardSettings.autoRefresh
                      )
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="autoRefresh"
                    className="font-medium text-gray-700"
                  >
                    Auto-refresh Data
                  </label>
                  <p className="text-gray-500">
                    Automatically refresh dashboard data.
                  </p>
                </div>
              </div>

              {dashboardSettings.autoRefresh && (
                <div>
                  <label
                    htmlFor="refreshInterval"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Refresh Interval (minutes)
                  </label>
                  <select
                    id="refreshInterval"
                    name="refreshInterval"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={dashboardSettings.refreshInterval}
                    onChange={(e) =>
                      updateDashboardSetting(
                        "refreshInterval",
                        parseInt(e.target.value)
                      )
                    }
                  >
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              )}

              <div className="pt-5">
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    icon={<SaveIcon className="h-4 w-4" />}
                    iconPosition="left"
                    onClick={saveSettings}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "data",
      label: "Data",
      icon: <DatabaseIcon className="h-4 w-4" />,
      content: (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Data Management
            </h3>
            <div className="mt-5 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Import Data
                </h4>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      CSV, Excel up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900">
                  Export Data
                </h4>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                  <Button variant="outline" fullWidth>
                    Export Sales Data (CSV)
                  </Button>
                  <Button variant="outline" fullWidth>
                    Export Products Data (CSV)
                  </Button>
                  <Button variant="outline" fullWidth>
                    Export Customer Data (CSV)
                  </Button>
                  <Button variant="outline" fullWidth>
                    Export All Data (Excel)
                  </Button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900">
                  Reset Dashboard
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  This will reset all filters and cached data. Your actual data
                  will not be affected.
                </p>
                <div className="mt-4">
                  <Button
                    variant="danger"
                    onClick={() => setShowResetModal(true)}
                  >
                    Reset Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your dashboard preferences and account settings
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
      />

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Dashboard"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleResetData}>
              Reset
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to reset your dashboard? This will clear all
            filters and cached data. Your saved settings and actual data will
            not be affected.
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Settings;