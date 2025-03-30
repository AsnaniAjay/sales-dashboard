// src/components/notifications/NotificationCard.jsx
import React from 'react';
import { FaRegDotCircle, FaCheck, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const NotificationCard = ({ notification, onMarkAsRead, onDelete }) => {
  const { id, title, message, type, read, timestamp, link } = notification;
  
  // Function to get notification icon and color based on type
  const getNotificationTypeInfo = (type) => {
    switch(type) {
      case 'alert':
        return { 
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          label: 'Alert'
        };
      case 'report':
        return { 
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          label: 'Report'
        };
      case 'system':
        return { 
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          label: 'System'
        };
      case 'customer':
        return { 
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          label: 'Customer'
        };
      default:
        return { 
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          label: 'Notification'
        };
    }
  };

  const typeInfo = getNotificationTypeInfo(type);
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <div className={`p-4 ${read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 transition-colors duration-150`}>
      <div className="flex items-start">
        <div className={`mr-3 mt-1 ${typeInfo.color}`}>
          <FaRegDotCircle className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              {title}
              <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
            </h4>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{message}</p>
          
          <div className="mt-3 flex justify-between items-center">
            <div className="flex space-x-3">
              {!read && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  onClick={() => onMarkAsRead(id)}
                >
                  <FaCheck className="h-3 w-3 mr-1" />
                  Mark as read
                </button>
              )}
              <button 
                className="text-xs text-gray-600 hover:text-red-600 flex items-center"
                onClick={() => onDelete(id)}
              >
                <FaTrash className="h-3 w-3 mr-1" />
                Delete
              </button>
            </div>
            
            {link && (
              <a 
                href={link}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                View details
                <FaExternalLinkAlt className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;