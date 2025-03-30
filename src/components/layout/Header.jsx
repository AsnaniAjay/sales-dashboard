// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaCheck,
  FaTrash,
  FaRegDotCircle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const Header = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const { user } = useAuth(); // Get user from Auth context

  // Use the notification context
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
  } = useNotifications();

  // Get only the 5 most recent notifications for the dropdown
  const recentNotifications = notifications.slice(0, 5);
  // Get the unread count from the context
  const unreadCount = getUnreadCount();

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Function to get notification icon color based on type
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "alert":
        return "text-yellow-500";
      case "report":
        return "text-blue-500";
      case "system":
        return "text-red-500";
      case "customer":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and hamburger */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 lg:hidden"
              aria-label="Open sidebar"
            >
              <FaBars className="h-5 w-5" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-1 sm:ml-0">
              <img className="h-8 w-auto" src="/insight.png" alt="Workflow" />
              <span className="ml-2 text-xl font-semibold text-gray-800 hidden sm:block">
                InsightFlow
              </span>
            </div>
          </div>

          {/* Center/Right - Search on desktop, hidden on mobile unless toggled */}
          <div
            className={`${
              showSearch
                ? "flex absolute inset-x-0 top-0 h-16 px-2 items-center bg-white z-20"
                : "hidden"
            } sm:flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end`}
          >
            {showSearch && (
              <button
                onClick={toggleSearch}
                className="p-2 mr-2 text-gray-500 sm:hidden"
                aria-label="Close search"
              >
                <FaBars className="h-5 w-5" />
              </button>
            )}
            <div className="w-full sm:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          {/* Right side - Icons and profile */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {!showSearch && (
              <button
                onClick={toggleSearch}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none sm:hidden"
                aria-label="Show search"
              >
                <FaSearch className="h-5 w-5" />
              </button>
            )}

            {/* Notifications with dropdown */}
            <div className="relative" ref={notificationRef}>
              <button
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleNotifications}
                aria-label="Show notifications"
              >
                <FaBell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs text-blue-600 hover:text-blue-800"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {recentNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 ${
                              notification.read ? "bg-white" : "bg-blue-50"
                            }`}
                          >
                            <div className="flex">
                              <div
                                className={`mr-3 mt-1 ${getNotificationTypeColor(
                                  notification.type
                                )}`}
                              >
                                <FaRegDotCircle className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {notification.time ||
                                    formatDistanceToNow(
                                      new Date(notification.timestamp),
                                      { addSuffix: true }
                                    )}
                                </p>
                                <div className="mt-2 flex">
                                  {!notification.read && (
                                    <button
                                      className="mr-3 text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                      onClick={() =>
                                        markAsRead(notification.id)
                                      }
                                    >
                                      <FaCheck className="h-3 w-3 mr-1" />
                                      Mark as read
                                    </button>
                                  )}
                                  <button
                                    className="text-xs text-gray-600 hover:text-red-600 flex items-center"
                                    onClick={() =>
                                      deleteNotification(notification.id)
                                    }
                                  >
                                    <FaTrash className="h-3 w-3 mr-1" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200">
                    <a
                      href="/notifications"
                      className="block text-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Profile section */}
            <div className="relative">
              <div className="flex items-center">
                <a
                  href="/settings"
                  className="rounded-full text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                  aria-label="Go to profile settings"
                >
                  <FaUserCircle className="h-7 w-7" />
                </a>

                <span className="ml-2 hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || "John Doe"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
