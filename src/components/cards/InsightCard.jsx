// src/components/cards/InsightCard.jsx
import React from 'react';
import { 
  LightningBoltIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  ExclamationIcon,
  InformationCircleIcon
} from '@heroicons/react/solid';

const InsightCard = ({ 
  title, 
  description, 
  type = 'info', // 'positive', 'negative', 'warning', 'info', 'custom'
  icon,
  action,
  actionText,
  customColor,
  onActionClick,
  highlight
}) => {
  // Predefined types with styles
  const typeStyles = {
    positive: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      actionBg: 'bg-green-100 hover:bg-green-200',
      actionText: 'text-green-700',
      defaultIcon: <TrendingUpIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
    },
    negative: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
      actionBg: 'bg-red-100 hover:bg-red-200',
      actionText: 'text-red-700',
      defaultIcon: <TrendingDownIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800',
      actionBg: 'bg-yellow-100 hover:bg-yellow-200',
      actionText: 'text-yellow-700',
      defaultIcon: <ExclamationIcon className="h-5 w-5 text-yellow-600" aria-hidden="true" />
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      actionBg: 'bg-blue-100 hover:bg-blue-200',
      actionText: 'text-blue-700',
      defaultIcon: <InformationCircleIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
    },
    custom: {
      bgColor: customColor?.bgColor || 'bg-gray-50',
      borderColor: customColor?.borderColor || 'border-gray-100',
      iconBg: customColor?.iconBg || 'bg-gray-100',
      iconColor: customColor?.iconColor || 'text-gray-600',
      textColor: customColor?.textColor || 'text-gray-800',
      actionBg: customColor?.actionBg || 'bg-gray-100 hover:bg-gray-200',
      actionText: customColor?.actionText || 'text-gray-700',
      defaultIcon: <LightningBoltIcon className="h-5 w-5 text-gray-600" aria-hidden="true" />
    }
  };
  
  const style = typeStyles[type];
  
  // Highlight specific text in the description
  const renderDescription = () => {
    if (!highlight) return description;
    
    const parts = description.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={i} className="font-semibold">{part}</span> : 
            part
        )}
      </>
    );
  };
  
  return (
    <div className={`rounded-lg shadow ${style.bgColor} ${style.borderColor} border overflow-hidden`}>
      <div className="p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <div className={`${style.iconBg} p-2 rounded-full`}>
              {icon || style.defaultIcon}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${style.textColor}`}>{title}</h3>
            <div className={`mt-2 text-sm ${style.textColor}`}>
              <p>{renderDescription()}</p>
            </div>
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${style.actionBg} ${style.actionText} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-${type}-500`}
                  onClick={onActionClick}
                >
                  {actionText || 'Learn more'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;