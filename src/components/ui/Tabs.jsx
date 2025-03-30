import React, { useState, useEffect } from 'react';

const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills', // Use 'pills' for pill style
  fullWidth = false,
  size = 'md',
  className = '',
  contentClassName = ''
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeTab !== undefined) {
      const index = tabs.findIndex(tab => tab.id === activeTab);
      setActiveIndex(index !== -1 ? index : 0);
    }
  }, [activeTab, tabs]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onChange) {
      onChange(tabs[index].id);
    }
  };

  const tabVariants = {
    pills: {
      container: 'flex space-x-1 overflow-x-auto no-scrollbar', // Added scrolling
      tab: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 whitespace-nowrap py-2 px-4 font-medium text-sm rounded-full flex-shrink-0', // Added flex-shrink-0
      activeTab: 'bg-indigo-600 text-white whitespace-nowrap py-2 px-4 font-medium text-sm rounded-full flex-shrink-0', // Added flex-shrink-0
      content: 'mt-4'
    },
    buttons: {
      container: 'bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar', // Added scrolling
      tab: 'text-gray-500 hover:text-gray-700 whitespace-nowrap py-2 px-4 font-medium text-sm flex-shrink-0', // Added flex-shrink-0
      activeTab: 'bg-white text-gray-900 shadow whitespace-nowrap py-2 px-4 font-medium text-sm rounded-md flex-shrink-0', // Added flex-shrink-0
      content: 'mt-4'
    }
  };

  const selectedVariant = tabVariants[variant] || tabVariants.pills;

  return (
    <div className={className}>
      <div className={selectedVariant.container}>
        <nav 
          className={`
            ${fullWidth ? 'flex w-full' : 'flex space-x-4'} 
            overflow-x-auto no-scrollbar
          `} 
          aria-label="Tabs"
        >
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => handleTabClick(index)}
              className={`
                ${index === activeIndex ? selectedVariant.activeTab : selectedVariant.tab}
                cursor-pointer
                ${fullWidth ? 'flex-1 text-center' : ''}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center justify-center">
                {tab.icon && <span className={`${tab.label ? 'mr-2' : ''}`}>{tab.icon}</span>}
                {tab.label}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className={`${selectedVariant.content} ${contentClassName}`}>
        {tabs[activeIndex] && tabs[activeIndex].content}
      </div>
    </div>
  );
};

export default Tabs;