// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Create Context
const NotificationContext = createContext();

// Sample notification data - replace with API calls in production
const sampleNotifications = [
  {
    id: 1,
    title: "New sales report available",
    message: "March 2025 sales report is now available for review.",
    type: "report",
    read: false,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    link: "/reports/sales/march-2025"
  },
  {
    id: 2,
    title: "Revenue milestone reached",
    message: "Congratulations! You've reached the $100k revenue milestone for this quarter.",
    type: "alert",
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: "/dashboard"
  },
  {
    id: 3,
    title: "System maintenance",
    message: "Scheduled system maintenance on April 2, from 2 AM to 4 AM UTC.",
    type: "system",
    read: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    link: "/system-status"
  },
  {
    id: 4,
    title: "New customer signup",
    message: "Enterprise client Acme Corp has just signed up for the premium plan.",
    type: "customer",
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    link: "/customers/acme-corp"
  },
  {
    id: 5,
    title: "Product inventory alert",
    message: "The 'Wireless Headphones' product is running low on inventory (5 units left).",
    type: "alert",
    read: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    link: "/products/inventory"
  },
  {
    id: 6,
    title: "New feature launched",
    message: "We've just launched the new dashboard analytics feature. Check it out!",
    type: "system",
    read: false,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    link: "/features/analytics"
  },
  {
    id: 7,
    title: "Payment processed",
    message: "A payment of $2,500 has been processed for invoice #INV-2025-0342.",
    type: "report",
    read: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    link: "/invoices/INV-2025-0342"
  },
  {
    id: 8,
    title: "Customer support request",
    message: "New support ticket opened by John Smith regarding subscription renewal.",
    type: "customer",
    read: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    link: "/support/tickets/123"
  },
  {
    id: 9,
    title: "Weekly performance summary",
    message: "Your weekly sales performance summary is now available.",
    type: "report",
    read: false,
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
    link: "/reports/performance"
  },
  {
    id: 10,
    title: "Security alert",
    message: "There have been multiple failed login attempts on your account.",
    type: "alert",
    read: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    link: "/settings/security"
  }
];

// Provider Component
export const NotificationProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // Initialize from localStorage or sample data
  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        setNotifications(sampleNotifications);
        localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
      }
    };
    
    loadNotifications();
  }, []);
  
  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Fetch notifications (simulated API call)
  const fetchNotifications = useCallback(async () => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        } else {
          setNotifications(sampleNotifications);
        }
        resolve();
      }, 1000); // Simulate network delay
    });
  }, []);
  
// src/context/NotificationContext.jsx (continued)

  // Mark a notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Delete a notification
  const deleteNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(), // Simple ID generation
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.read).length;
  }, [notifications]);

  // Context value
  const value = {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    getUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;