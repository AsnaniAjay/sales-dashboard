import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Drawer = ({ 
  isOpen, 
  onClose, 
  children, 
  title = 'Filters',
  position = 'right'
}) => {
  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div 
        className={`
          absolute 
          h-full 
          w-80 
          bg-white 
          shadow-xl 
          transform 
          transition-transform 
          duration-300 
          ease-in-out
          ${position === 'right' ? 'right-0' : 'left-0'}
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;