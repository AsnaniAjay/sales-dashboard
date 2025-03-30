// src/components/notifications/NotificationStats.jsx
import React from 'react';
import { FaBell, FaExclamationTriangle, FaChartLine, FaServer, FaUsers } from 'react-icons/fa';

const NotificationStats = ({ stats }) => {
  const statCards = [
    {
      name: 'Total Notifications',
      value: stats.total,
      icon: FaBell,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLightColor: 'bg-blue-100'
    },
    {
      name: 'Unread',
      value: stats.unread,
      icon: FaExclamationTriangle,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgLightColor: 'bg-red-100'
    },
    {
      name: 'Alerts',
      value: stats.alerts,
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLightColor: 'bg-yellow-100'
    },
    {
      name: 'Reports',
      value: stats.reports,
      icon: FaChartLine,
      bgColor: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgLightColor: 'bg-indigo-100'
    },
    {
      name: 'System',
      value: stats.system,
      icon: FaServer,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLightColor: 'bg-purple-100'
    },
    {
      name: 'Customer',
      value: stats.customer,
      icon: FaUsers,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLightColor: 'bg-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.bgLightColor} rounded-md p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationStats;