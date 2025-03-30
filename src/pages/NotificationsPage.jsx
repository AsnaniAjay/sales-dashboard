// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import NotificationList from "../components/notifications/NotificationList";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationStats from "../components/notifications/NotificationStats";
import EmptyState from "../components/common/EmptyState";
import { useNotifications } from "../context/NotificationContext";

const NotificationsPage = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    fetchNotifications
  } = useNotifications();

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [timeRange, setTimeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications when component mounts
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      await fetchNotifications();
      setIsLoading(false);
    };
    
    loadNotifications();
  }, [fetchNotifications]);

  // Filter and sort notifications based on user selection
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...notifications];

    // Filter by type
    if (selectedFilter !== "all") {
      filtered = filtered.filter(notification => notification.type === selectedFilter);
    }

    // Filter by read/unread
    if (timeRange === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(notification => {
        const notifDate = new Date(notification.timestamp);
        return notifDate >= today;
      });
    } else if (timeRange === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(notification => {
        const notifDate = new Date(notification.timestamp);
        return notifDate >= weekAgo;
      });
    } else if (timeRange === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(notification => {
        const notifDate = new Date(notification.timestamp);
        return notifDate >= monthAgo;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        notification =>
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } else if (sortBy === "unread") {
      filtered.sort((a, b) => (b.read === false ? 1 : 0) - (a.read === false ? 1 : 0));
    }

    return filtered;
  }, [notifications, selectedFilter, timeRange, searchQuery, sortBy]);

  const unreadCount = notifications.filter(notification => !notification.read).length;
  const statCounts = {
    total: notifications.length,
    unread: unreadCount,
    alerts: notifications.filter(notification => notification.type === "alert").length,
    reports: notifications.filter(notification => notification.type === "report").length,
    system: notifications.filter(notification => notification.type === "system").length,
    customer: notifications.filter(notification => notification.type === "customer").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all your notifications in one place
        </p>
      </div>

      {/* Stats Cards */}
      <NotificationStats stats={statCounts} />

      {/* Filters and Actions */}
      <NotificationFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAllNotifications}
        unreadCount={unreadCount}
      />

      {/* Notification List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredNotifications.length > 0 ? (
        <NotificationList
          notifications={filteredNotifications}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />
      ) : (
        <EmptyState
          title="No notifications found"
          message="You don't have any notifications that match the current filters."
          icon="bell"
          action={
            searchQuery || selectedFilter !== "all" || timeRange !== "all" ? (
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setSelectedFilter("all");
                  setTimeRange("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            ) : null
          }
        />
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;