import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Receive isAuthenticated and onLogout props from App.jsx
function Navbar_All({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
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

  // Function to handle logout
  const handleLogout = () => {
    // Call the onLogout prop first to update the central state in App.jsx
    if (onLogout) {
        onLogout();
    }

    // Local storage clearing and axios header clearing are now handled in App.jsx's handleLogout
    // navigate to the home/login page
    navigate('/');
  };

  return (
    // Added conditional dark mode classes
    <nav className={`bg-white shadow-md ${isDark ? 'dark:bg-gray-800' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Added dark mode text colors */}
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i></span>
          </div>

          <ul className="flex items-center space-x-1 md:space-x-4">
            {/* Added dark mode text colors */}
            <li className="group">
              {/* Use Link for client-side navigation */}
              <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:text-indigo-800 dark:text-blue-400 dark:hover:text-indigo-600">
                {/* Home icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden md:block">Home</span>
              </Link>
            </li>


            {/* Added dark mode text colors */}
            <li className="group">
               {/* Use Link for client-side navigation */}
              <Link to="/about" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:text-indigo-800 dark:text-blue-400 dark:hover:text-indigo-600">
                {/* About icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden md:block">About</span>
              </Link>
            </li>

            {/* Added dark mode text colors */}
            <li className="group">
              {/* Use Link for client-side navigation */}
              <Link to="/contact" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:text-indigo-800 dark:text-blue-400 dark:hover:text-indigo-600">
                {/* Contact icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 11-10 10 10 10 0 0110-10zm-1 14h2v2h-2zm0-6h2v4h-2z" />
                </svg>
                <span className="hidden md:block">Contact</span>
              </Link>
            </li>

            {/* Conditionally render Logout or Login/Signup based on isAuthenticated */}
            {isAuthenticated ? (
              <li className="group">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:text-red-800 dark:text-red-400 dark:hover:text-red-600 focus:outline-none"
                >
                  {/* Logout icon (optional) */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden md:block">Logout</span>
                </button>
              </li>
            ) : (
              <li className="group">
                 {/* Use Link for client-side navigation */}
                 {/* Changed the Link destination to the root path "/" */}
                <Link to="/" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 rounded-md hover:text-indigo-800 dark:text-blue-400 dark:hover:text-indigo-600">
                   {/* Login icon (optional) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H9" />
                    </svg>
                  <span className="hidden md:block">Login/Signup</span>
                </Link>
              </li>
            )}


            <li className='group'>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={isDark}
                  onChange={() => {
                    setIsDark(!isDark);
                    // Ensure the dark class is toggled on the html element
                    document.documentElement.classList.toggle('dark', !isDark);
                  }}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  );
}

export default Navbar_All;