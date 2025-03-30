// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import providers
import { DashboardProvider } from './context/DashboardContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Import pages
import Dashboard from './pages/Dashboard';
import SalesAnalysis from './pages/SalesAnalysis';
import ProductPerformance from './pages/ProductPerformance';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Customers from './pages/Customers';
import RevenuePage from './pages/RevenuePage';
import NotificationsPage from './pages/NotificationsPage';
import MarketingROIDashboard from './pages/MarketingROIDashboard';

import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <DashboardProvider>
            <Routes>
              {/* Dashboard is the default route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Main dashboard pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sales-analysis" element={<SalesAnalysis />} />
              <Route path="/products" element={<ProductPerformance />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/revenue" element={<RevenuePage/>} />
              <Route path="/notifications" element={<NotificationsPage />} />
              
              {/* Marketing ROI Dashboard */}
              <Route path="/marketing-roi" element={<MarketingROIDashboard />} />
              
              {/* Fallback route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </DashboardProvider>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;