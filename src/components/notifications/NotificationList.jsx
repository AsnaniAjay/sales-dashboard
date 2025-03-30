// src/components/notifications/NotificationList.jsx
import React from 'react';
import { FaRegDotCircle, FaCheck, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import NotificationCard from './NotificationCard';

const NotificationList = ({ notifications, onMarkAsRead, onDelete }) => {
  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateString;
    
    if (date.toDateString() === today.toDateString()) {
      dateString = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateString = 'Yesterday';
    } else {
      dateString = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    if (!groups[dateString]) {
      groups[dateString] = [];
    }
    
    groups[dateString].push(notification);
    
    return groups;
  }, {});

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {Object.entries(groupedNotifications).map(([date, notifs]) => (
        <div key={date} className="border-b border-gray-200 last:border-b-0">
          <div className="bg-gray-50 px-4 py-2">
            <h3 className="text-sm font-medium text-gray-500">{date}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {notifs.map((notification) => (
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;