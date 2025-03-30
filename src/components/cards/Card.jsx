// src/components/cards/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  title = null, 
  titleIcon = null,
  footer = null,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            {titleIcon && <span className="mr-2">{titleIcon}</span>}
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          </div>
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4 sm:p-6'}>
        {children}
      </div>
      
      {footer && (
        <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;