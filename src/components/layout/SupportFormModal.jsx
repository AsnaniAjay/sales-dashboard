import React, { useEffect } from 'react';
import SupportForm from '../help/SupportForm';
import { XIcon } from '@heroicons/react/outline';

const SupportFormModal = ({ isOpen, onClose }) => {
  // Close the modal when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle click outside the modal content to close it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // If not open, don't render anything
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/30 bg-opacity-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-auto animate-scale-in">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <SupportForm />
        </div>
      </div>
    </div>
  );
};

export default SupportFormModal;