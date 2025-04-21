import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar_Member from './Components/Navbar_Member';
import Navbar_All from './Components/Navbar_All';
import HomePage from './components/HomePage';
import LoginSignup from './components/LoginSignup';
import TeamMemberDashboardRefactored from './components/MemberDashboard';
import ChatPage from './components/ChatPage';
import ManagerDashboard from './components/ManagerDashboard';

export default function App() {
  // TODO: Replace this with real auth logic
  const isAuthenticated = true; // Placeholder authentication check

  return (
    <ManagerDashboard />
  );
}
