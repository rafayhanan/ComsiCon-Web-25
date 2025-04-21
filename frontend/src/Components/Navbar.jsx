import React, { useState, useEffect } from 'react';
// Removed LoginSignup import as it wasn't used in the provided snippet
import { useNavigate } from 'react-router-dom';

// --- Imports for the new toggle ---
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  // Keep existing state for dark mode in Navbar
  const [isDark, setIsDark] = useState(false);

  // Keep existing effect to toggle the class on the root element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Optional: Persist preference (example using localStorage)
    // localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  // Optional: Load preference on initial mount
  // useEffect(() => {
  //   const savedMode = localStorage.getItem('darkMode');
  //   if (savedMode !== null) {
  //     setIsDark(JSON.parse(savedMode));
  //   }
  // }, []);

  // --- Handler function using Navbar's state setter ---
  const handleToggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    // Added dark mode classes for Navbar background/text
    <nav className="bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Adjusted dark mode text color for brand */}
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i>
            </span>
          </div>

          <ul className="flex items-center space-x-1 md:space-x-4">
            {/* Existing nav items... adjusted hover/text for dark mode */}
            <li className="group">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> </svg>
                <span className="hidden md:block">Home</span>
              </a>
            </li>
            <li className="group">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <span className="hidden md:block">Products</span>
                </a>
            </li>
             <li className="group">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="hidden md:block">About</span>
                </a>
            </li>
             <li className="group">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span className="hidden md:block">Contact</span>
                </a>
            </li>
             <li className="group">
                <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="hidden md:block">Cart</span>
                </a>
            </li>

            {/* Register Button - keeping its styles */}
            <li className="group">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login');}} className="flex items-center px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                    <span className="hidden md:block">Register</span>
                </a>
            </li>

            {/* --- New Dark Mode Toggle UI --- */}
            {/* Replace the old li content with this */}
            <li className="flex items-center"> {/* Use flex items-center directly on li */}
              <div className="flex items-center gap-2 px-2"> {/* Add some padding if needed */}
                <Sun className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-yellow-500'}`} />
                <Switch
                  id="dark-mode-switch-navbar" // Changed ID slightly to avoid potential conflicts
                  checked={isDark}
                  onCheckedChange={handleToggleDarkMode} // Use the handler with Navbar's state
                  aria-label="Toggle dark mode"
                />
                <Moon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-gray-500'}`} />
              </div>
            </li>
            {/* --- End New Dark Mode Toggle UI --- */}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;