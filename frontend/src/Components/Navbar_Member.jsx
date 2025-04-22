import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, MessageSquare, LogOut } from 'lucide-react';
import axios from 'axios';

function Navbar_Member({ onLogout }) {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);

  // Load user info from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Remove the authorization header
    delete axios.defaults.headers.common['Authorization'];

    // Call the logout handler from parent component
    if (onLogout) {
      onLogout();
    }

    // Navigate to home page
    navigate('/', { replace: true });
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Link the brand back to the dashboard */}
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i>
              </span>
            </Link>
          </div>

          <ul className="flex items-center space-x-1 md:space-x-2 lg:space-x-4">
            {/* Dashboard Link */}
            <li className="group">
              <Link to="/dashboard" className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden md:block">Dashboard</span>
              </Link>
            </li>

            {/* Chat Link */}
            <li className="group">
              <Link to="/chat" className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <MessageSquare className="h-5 w-5 mr-1" />
                <span className="hidden md:block">Chat</span>
              </Link>
            </li>

            {/* About Us Link */}
            <li className="group">
              <Link to="/about" className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden md:block">About</span>
              </Link>
            </li>

            {/* Contact Us Link */}
            <li className="group">
              <Link to="/contact" className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden md:block">Contact</span>
              </Link>
            </li>

            {/* Logout Button */}
            <li className="group">
              <button
                onClick={handleLogout}
                className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                <LogOut className="h-5 w-5 mr-1" />
                <span className="hidden md:block">Logout</span>
              </button>
            </li>

            {/* User display if available */}
            {user && (
              <li className="hidden md:block px-2 py-1 text-sm font-medium">
                <span className="text-blue-600 dark:text-blue-400">
                  {user.fullName || user.email}
                </span>
              </li>
            )}

            {/* Dark Mode Toggle */}
            <li className="flex items-center pl-2">
              <div className="flex items-center gap-2">
                <Sun className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-yellow-500'}`} />
                <Switch
                  id="dark-mode-switch-navbar"
                  checked={isDark}
                  onCheckedChange={handleToggleDarkMode}
                  aria-label="Toggle dark mode"
                />
                <Moon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar_Member;