// src/components/help/SearchHelp.jsx
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchHelp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search data
  const helpTopics = [
    {
      title: "Filtering dashboard data",
      category: "Usage",
      content: "Learn how to use filters to drill down into your sales data...",
      path: "#filtering"
    },
    {
      title: "Exporting reports",
      category: "Data",
      content: "Step-by-step guide to exporting data from any dashboard view...",
      path: "#exporting"
    },
    {
      title: "Understanding KPIs",
      category: "Metrics",
      content: "Detailed explanation of all Key Performance Indicators used in the dashboard...",
      path: "#kpis"
    },
    {
      title: "Setting up alerts",
      category: "Configuration",
      content: "How to configure email and in-app alerts for important metrics...",
      path: "#alerts"
    },
    {
      title: "Customizing the dashboard",
      category: "Personalization",
      content: "Customize your dashboard layout, colors, and displayed metrics...",
      path: "#customization"
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = helpTopics.filter(topic => 
        topic.title.toLowerCase().includes(query) || 
        topic.content.toLowerCase().includes(query) ||
        topic.category.toLowerCase().includes(query)
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Search Help Topics</h2>
      
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm"
            placeholder="Search for help topics..."
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-indigo-600 hover:text-indigo-700 text-sm">Search</span>
            )}
          </button>
        </div>
      </form>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Results ({searchResults.length})
          </h3>
          <ul className="divide-y divide-gray-200">
            {searchResults.map((result, index) => (
              <li key={index} className="py-3">
                <a href={result.path} className="block hover:bg-gray-50">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-indigo-600">{result.title}</p>
                    <p className="text-xs text-gray-500">{result.category}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{result.content}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="mt-6 text-center py-4">
          <p className="text-gray-500">No results found for "{searchQuery}"</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term or browse the categories below</p>
        </div>
      )}
    </div>
  );
};

export default SearchHelp;