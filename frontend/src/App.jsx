import React from 'react';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar_Member from './Components/Navbar_Member';
import Navbar_All from './Components/Navbar_All';
import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import TeamMemberDashboardRefactored from './components/MemberDashboard';
import ChatPage from './components/ChatPage';
import AboutUs from './Components/AboutUs';

export default function App() {
  

  // TODO: Replace this with real auth logic
  const isAuthenticated = true; // Placeholder authentication check
  const [isDark, setIsDark] = useState(false);
    
    // Check for dark mode class on document and update local state
    useEffect(() => {
      const checkDarkMode = () => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
      };
      
      // Initial check
      checkDarkMode();
      
      // Set up a mutation observer to detect changes to the classList
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }, []);

  return (
    <Router>
      <Navbar_All /> {/* Persistent across all pages */}
      <main className={` ${
      isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-blue-50'
    }`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginSignup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <TeamMemberDashboardRefactored /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/chat"
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />}
          />

          {/* Fallback for unmatched routes */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </main>
    </Router>
  );
}
