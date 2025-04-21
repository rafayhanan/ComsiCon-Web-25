import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar_Member from './Components/Navbar_Member';
import Navbar_All from './Components/Navbar_All';
import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import TeamMemberDashboardRefactored from './components/MemberDashboard';
import ChatPage from './components/ChatPage';

export default function App() {
  // TODO: Replace this with real auth logic
  const isAuthenticated = true; // Placeholder authentication check

  return (
    <Router>
      <Navbar_All /> {/* Persistent across all pages */}
      <main>
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
