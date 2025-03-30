// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  isLoading = false
}) => {
  // Variants
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-900',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-white',
    info: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 text-gray-700',
    text: 'bg-transparent hover:bg-gray-100 text-indigo-600 hover:text-indigo-700'
  };

  // Sizes
  const sizes = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
    xl: 'py-3 px-6 text-base'
  };

  // Generate classes
  const buttonClasses = `
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    inline-flex items-center justify-center font-medium rounded-md
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors ease-in-out duration-150
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;