// src/components/help/FAQSection.jsx
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className="ml-6 flex-shrink-0 text-gray-500">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 pr-12">
          <p className="text-gray-500">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [visibleFaqs, setVisibleFaqs] = useState(6);
  
  const faqs = [
    {
      question: "How do I filter data by date range?",
      answer: "You can use the date range picker in the top section of each dashboard page. Click on it to open a calendar where you can select start and end dates, or choose from preset ranges like 'Last 30 Days' or 'This Quarter'."
    },
    {
      question: "Can I export dashboard data?",
      answer: "Yes, most tables and charts have an export option. Look for the Export button (usually with a download icon) near the top-right corner of data tables. You can export in CSV format for further analysis in spreadsheet applications."
    },
    {
      question: "How often is the data updated?",
      answer: "The dashboard data is refreshed automatically every 30 minutes. You can also manually refresh by clicking the refresh button in the header. The last update time is shown in the dashboard footer."
    },
    {
      question: "How do I customize the dashboard layout?",
      answer: "Go to the Settings page and select the 'Appearance' tab. Here you can choose your default view, enable/disable dark mode, and configure which metrics appear on your main dashboard."
    },
    {
      question: "How are sales metrics calculated?",
      answer: "Revenue is calculated from the total of all completed transactions. Profit is calculated by subtracting estimated costs from revenue. Average order value is total revenue divided by number of orders."
    },
    {
      question: "Can I share reports with team members?",
      answer: "Yes, you can share reports by clicking the 'Share' button on any report page. You can generate a link or directly email the report to team members. You can also schedule automated reports to be sent on a regular basis."
    },
    {
      question: "How do I set up alerts for key metrics?",
      answer: "Navigate to the Alerts section under Settings. Here you can configure threshold-based alerts for any metric. For example, you can set up an alert to notify you when sales drop below a certain level or when customer acquisition cost exceeds a threshold."
    },
    {
      question: "Is it possible to segment customer data?",
      answer: "Yes, in the Customers section, you can create custom segments based on various criteria such as purchase behavior, demographics, or engagement metrics. These segments can then be used to filter data throughout the dashboard."
    },
    {
      question: "How do I interpret the sales forecast chart?",
      answer: "The sales forecast chart uses historical data and seasonal patterns to predict future performance. The solid line represents actual data, while the dotted line shows projected values. The shaded area indicates the prediction confidence interval."
    },
    {
      question: "Can I compare performance across different time periods?",
      answer: "Yes, most charts support period-over-period comparison. Use the comparison toggle in the filter section to enable this feature. You can compare current performance to previous periods like last month, same period last year, etc."
    },
    {
      question: "How do I track the source of new customers?",
      answer: "The Customer Acquisition report breaks down new customers by source channel. This report can be found in the Customers section and shows which marketing channels or referral sources are driving new customer acquisition."
    },
    {
      question: "Is there a mobile app available for the dashboard?",
      answer: "Yes, we offer mobile apps for iOS and Android. The mobile app provides access to key metrics and alerts while on the go. You can download it from the respective app stores by searching for 'InsightFlow Dashboard'."
    }
  ];

  const loadMore = () => {
    setVisibleFaqs(faqs.length);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Frequently Asked Questions</h2>
      <div className="divide-y divide-gray-200">
        {faqs.slice(0, visibleFaqs).map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
      
      {visibleFaqs < faqs.length && (
        <div className="mt-6 text-center">
          <button 
            onClick={loadMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Load More Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQSection;