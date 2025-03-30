import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  CogIcon, 
  QuestionMarkCircleIcon,
  TrendingUpIcon
} from '@heroicons/react/outline';
import SupportFormModal from './SupportFormModal';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define navigation items
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Sales Analytics', href: '/sales-analysis', icon: ChartBarIcon },
    { name: 'Revenue', href: '/revenue', icon: CurrencyDollarIcon },
    { name: 'Marketing ROI', href: '/marketing-roi', icon: TrendingUpIcon },
    { name: 'Products', href: '/products', icon: ShoppingBagIcon },
    { name: 'Customers', href: '/customers', icon: UserGroupIcon },
  ];

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: CogIcon },
    { name: 'Help', href: '/help', icon: QuestionMarkCircleIcon },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 
          overflow-y-auto transition-transform duration-300 ease-in-out 
          transform lg:static lg:inset-0 lg:z-auto`}
        style={{ 
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white text-xl font-bold">InsightFlow</span>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`${
                location.pathname === item.href
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
            >
              <item.icon
                className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="px-2 mt-10">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Support
          </h3>
          <nav className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-base font-medium rounded-md"
              >
                <item.icon
                  className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-2 mt-10 pb-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Need assistance?</h4>
            <p className="text-sm text-gray-300">Contact our support team for help with your dashboard.</p>
            <button 
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded text-sm hover:bg-indigo-500 transition-colors"
              onClick={openModal}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={closeModal}
        ></div>
      )}

      {/* Support Form Modal */}
      <SupportFormModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Sidebar;