// src/components/common/EmptyState.jsx
import React from 'react';
import { 
  FaBell, 
  FaSearch, 
  FaExclamationTriangle, 
  FaFileAlt, 
  FaUsers, 
  FaShoppingCart,
  FaMoneyBillWave,
  FaQuestionCircle,
  FaCog,
  FaExclamationCircle
} from 'react-icons/fa';

const EmptyState = ({ 
  title = "No data found", 
  message = "There's no data to display at the moment.",
  icon = "default",
  action = null
}) => {
  // Map of icon types to their React components
  const iconMap = {
    default: FaExclamationTriangle,
    bell: FaBell,
    search: FaSearch,
    file: FaFileAlt,
    users: FaUsers,
    cart: FaShoppingCart,
    money: FaMoneyBillWave,
    question: FaQuestionCircle,
    settings: FaCog,
    error: FaExclamationCircle
  };

  // Get the icon component, or default if not found
  const IconComponent = iconMap[icon] || iconMap.default;

  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
          <IconComponent className="h-8 w-8 text-gray-500" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          {message}
        </p>
        {action && (
          <div className="mt-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;