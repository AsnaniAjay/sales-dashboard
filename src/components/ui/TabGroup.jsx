// src/components/ui/TabGroup.jsx
import React from 'react';

const TabGroup = ({ 
  tabs = [], 
  activeTab, 
  onChange = () => {}, 
  variant = 'default' 
}) => {
  // Variants for different tab styles
  const variants = {
    default: {
      wrapper: 'flex border-b border-gray-200',
      tab: 'py-2 px-4 text-sm font-medium',
      active: 'text-indigo-600 border-b-2 border-indigo-500',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
    },
    pills: {
      wrapper: 'flex space-x-1',
      tab: 'py-2 px-3 text-sm font-medium rounded-md',
      active: 'bg-indigo-600 text-white',
      inactive: 'text-gray-500 bg-gray-100 hover:bg-gray-200'
    },
    simple: {
      wrapper: 'flex space-x-4',
      tab: 'py-1 px-2 text-sm font-medium',
      active: 'text-indigo-600 border-b-2 border-indigo-500',
      inactive: 'text-gray-500 hover:text-gray-700'
    },
    minimal: {
      wrapper: 'flex space-x-4',
      tab: 'py-1 px-2 text-sm font-medium',
      active: 'text-indigo-600 font-medium',
      inactive: 'text-gray-500 hover:text-gray-700'
    }
  };
  
  // Get styles for the current variant
  const styles = variants[variant] || variants.default;

  return (
    <div className={styles.wrapper}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.active : styles.inactive
          } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
          onClick={() => onChange(tab.id)}
        >
          <div className="flex items-center flex-col md:flex-row ">
            {tab.icon && <span className="md:mr-2 mb-2 md:mb-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default TabGroup;