import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import TeamMemberDashboardRefactored from './components/MemberDashboard';
import ChatPage from './components/ChatPage';

export default function App() {
  // TODO: Replace this with real auth logic
  const isAuthenticated = true; // Placeholder authentication check

  return (
    <Router>
      <Navbar /> {/* Persistent across all pages */}
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
