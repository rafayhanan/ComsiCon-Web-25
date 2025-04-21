import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar_All from './Components/Navbar_All';
import HomePage from './components/HomePage'; // HomePage will now handle login/signup
// Remove the import for LoginSignup
// import LoginSignup from './components/LoginSignup';
import ManagerDashboard from './components/ManagerDashboard';
import ChatPage from './components/ChatPage';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import axios from 'axios'; // Import axios for the initial auth check

export default function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false); // New state to track if the initial auth check is done

  // Function to handle user authentication
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle user logout
  const handleLogout = () => {
    // Clear user session data from local storage first
    localStorage.removeItem('token'); // Ensure this matches the key used in HomePage
    localStorage.removeItem('user'); // Ensure this matches the key used in HomePage
    delete axios.defaults.headers.common['Authorization']; // Clear axios default header
    setIsAuthenticated(false); // Set authentication state to false
    // Navigation to '/' will happen automatically because the user is no longer authenticated
  };

  // Dark mode effect (can keep it here or in Navbar, having it in App affects the main background)
  useEffect(() => {
    const checkDarkMode = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Initial authentication check when App mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          // Set default authorization header for this check
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Verify token by getting current user
          const response = await axios.get('http://localhost:5000/api/auth/me');

          if (response.data.user) {
            setIsAuthenticated(true); // Set authenticated state
          } else {
             // Token invalid according to backend
             handleLogout(); // Clear local storage and set state to false
          }
        } catch (err) {
          // Error verifying token
          console.error('Auth check error:', err.response?.data || err.message);
          handleLogout(); // Clear local storage and set state to false
        } finally {
           setAuthCheckComplete(true); // Mark auth check as complete
        }
      } else {
         // No token in local storage
         setIsAuthenticated(false);
         setAuthCheckComplete(true); // Mark auth check as complete
      }
    };

    checkAuthStatus();
  }, []); // Run only once on mount

  // Render a loading state or null until auth check is complete
  if (!authCheckComplete) {
      return <div>Loading...</div>; // Or a splash screen component
  }


  return (
    <Router>
      {/* Pass isAuthenticated and handleLogout to Navbar_All */}
      <Navbar_All isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main className={`min-h-screen ${
        isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-blue-50'
      }`}>
        <Routes>
          {/* The root path "/" now renders HomePage, which includes the auth form */}
          {/* Pass onLogin and isAuthenticated to HomePage */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />

          {/* Remove the separate /login route */}
          {/* <Route path="/login" element={<LoginSignup onLogin={handleLogin} />} /> */}

          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <ManagerDashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="/chat"
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />}
          />

          {/* Redirect to the home/login page for unmatched routes if not authenticated */}
           <Route path="*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}