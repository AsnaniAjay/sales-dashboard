// src/components/ui/Modal.jsx
import React, { Fragment, useRef, useEffect } from 'react';
import { XIcon } from '@heroicons/react/outline';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
  staticBackdrop = false
}) => {
  const modalRef = useRef(null);
  
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && isOpen && !staticBackdrop) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, staticBackdrop]);
  
  // Handle outside clicks
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target) && closeOnOverlayClick && !staticBackdrop) {
      onClose();
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  if (!isOpen) return null;
  
  return (
    <Fragment>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleOverlayClick}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Modal Panel */}
          <div 
            ref={modalRef}
            className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 ${sizeClasses[size] || sizeClasses.md} w-full`}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="px-4 py-3 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                {title && (
                  <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="px-4 py-4 sm:px-6 overflow-y-auto max-h-[calc(100vh-14rem)]">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-end space-x-2">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;