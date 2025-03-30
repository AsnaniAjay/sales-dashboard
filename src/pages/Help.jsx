// src/pages/Help.jsx
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import SearchHelp from '../components/help/SearchHelp';
import FAQSection from '../components/help/FAQSection';
import SupportForm from '../components/help/SupportForm';
import DocumentationLinks from '../components/help/DocumentationLinks';
import { FaHeadset, FaQuestion, FaBook, FaSearch } from 'react-icons/fa';
import StatCard from '../components/cards/StatCard';

const Help = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
        <p className="mt-1 text-sm text-gray-600">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Documentation Articles"
          value={125}
          icon={<FaBook className="h-6 w-6 text-indigo-600" />}
        />
        <StatCard
          title="FAQs"
          value={48}
          icon={<FaQuestion className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Avg. Response Time"
          value="2.4h"
          icon={<FaHeadset className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Knowledge Base"
          value="324"
          icon={<FaSearch className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* Search Section */}
      <div className="mb-6">
        <SearchHelp />
      </div>

      {/* Documentation Links - Full width */}
      <div className="mb-6">
        <DocumentationLinks />
      </div>

      {/* FAQ Section & Contact Form - Side by side on large screens */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <FAQSection />
        </div>
        <div>
          <SupportForm />
        </div>
      </div>
    </DashboardLayout>
  );
};


export default Help;