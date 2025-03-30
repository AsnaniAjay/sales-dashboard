// src/components/help/DocumentationLinks.jsx
import React from 'react';
import { FaBook, FaVideo, FaInfoCircle, FaDownload, FaUserGraduate } from 'react-icons/fa';

const DocumentationLinks = () => {
  const documentationSections = [
    {
      title: "User Guide",
      description: "Comprehensive documentation on how to use all dashboard features",
      icon: <FaBook className="h-6 w-6 text-indigo-500" />,
      link: "#user-guide"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers and integrators",
      icon: <FaInfoCircle className="h-6 w-6 text-green-500" />,
      link: "#api-docs"
    },
    {
      title: "Feature Tutorials",
      description: "Step-by-step walkthroughs of key dashboard features",
      icon: <FaVideo className="h-6 w-6 text-blue-500" />,
      link: "#tutorials"
    },
    {
      title: "Data Dictionary",
      description: "Definitions of all metrics and data points used in the dashboard",
      icon: <FaBook className="h-6 w-6 text-purple-500" />,
      link: "#data-dictionary"
    },
    {
      title: "Export Templates",
      description: "Templates for exporting and reporting dashboard data",
      icon: <FaDownload className="h-6 w-6 text-yellow-500" />,
      link: "#export-templates"
    },
    {
      title: "Training Resources",
      description: "Additional training materials for dashboard mastery",
      icon: <FaUserGraduate className="h-6 w-6 text-red-500" />,
      link: "#training"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-5">Documentation & Resources</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documentationSections.map((section, index) => (
          <a 
            key={index} 
            href={section.link}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex"
          >
            <div className="flex-shrink-0 mr-4">
              {section.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{section.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default DocumentationLinks;