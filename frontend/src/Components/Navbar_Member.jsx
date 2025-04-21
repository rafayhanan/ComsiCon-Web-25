import React, { useState, useEffect } from 'react';
// Use Link for navigation instead of useNavigate for simple links
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
// Import MessageSquare icon for the chat link
import { Sun, Moon, MessageSquare } from 'lucide-react';

function Navbar_Member() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleToggleDarkMode= () => {
    setIsDark(!isDark);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-200 sticky top-0 z-50"> {/* Added sticky positioning */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
             {/* Link the brand back to the dashboard or home */}
            <Link to="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i>
                </span>
            </Link>
          </div>

          <ul className="flex items-center space-x-1 md:space-x-2 lg:space-x-4"> {/* Adjusted spacing */}
            {/* Home Link (example assuming dashboard is home) */}
            <li className="group">
              <Link to="/dashboard" className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> </svg>
                <span className="hidden md:block">Dashboard</span>
              </Link>
            </li>

            {/* --- Add Chat Link --- */}
            <li className="group">
              <Link to="/chat" className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-300">
                <MessageSquare className="h-5 w-5 mr-1" />
                <span className="hidden md:block">Chat</span>
              </Link>
            </li>
            {/* --- End Chat Link --- */}

            {/* Other links (Products, About, etc.) - shortened for brevity */}
            {/* ... other nav items like Products, About, Contact ... */}

            {/* Register Button */}
            <li className="group">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login');}} className="flex items-center px-2 py-2 lg:px-3 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                <span className="hidden md:block">Register</span>
              </a>
            </li>

            {/* Dark Mode Toggle */}
            <li className="flex items-center pl-2"> {/* Added padding */}
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