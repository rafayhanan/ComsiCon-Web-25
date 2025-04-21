import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import HomePage1 from '../assets/HomePage1.jpg';
import HomePage2 from '../assets/HomePage2.jpg';
import { Card, CardContent } from '@/components/ui/card'; // Keep if used in HomePage structure, otherwise remove
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
// Remove the import for LoginSignup as it will be integrated
// import LoginSignup from './LoginSignup';

// Receive onLogin prop from App.jsx
function HomePage({ onLogin, isAuthenticated }) {
  const navigate = useNavigate(); // Initialize useNavigate

  // --- State and Logic from LoginSignup.jsx ---
  const [action, setAction] = useState('Sign Up');
  // isDark state is already in HomePage, will keep the one in HomePage
  const [isDark, setIsDark] = useState(false); // Keep HomePage's dark mode state

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // --- End State and Logic from LoginSignup.jsx ---


  // Image slider effect (existing HomePage logic)
  const images = [HomePage1, HomePage2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode effect (existing HomePage logic)
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

  // --- Logic from LoginSignup.jsx integrated into HomePage ---

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  // Handle successful authentication (for both login and register)
  const handleAuthSuccess = (data) => {
    // Store token and user info in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Set default authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

    // Show success message (optional on immediate redirect)
    setSuccess(data.message);

    // Call the onLogin handler passed from App.jsx to update central state
    if (onLogin) onLogin();

    // Redirect to the dashboard after successful login/signup
    // Using replace: true prevents going back to the login page with the back button
    navigate('/dashboard', { replace: true });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (action === 'Sign Up') {
        // Register new user
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          fullName: formData.name,
          email: formData.email,
          password: formData.password
        });

        handleAuthSuccess(response.data);
      } else {
        // Login existing user
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        handleAuthSuccess(response.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'An error occurred. Please try again.'
      );
      console.error('Auth error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google auth
  const handleGoogleAuth = () => {
    // Implement Google authentication logic here
    console.log('Google auth clicked');
    // After successful Google auth, call handleAuthSuccess with user data and token
    // handleAuthSuccess({ token: 'google_token', user: { ... } });
  };
  // --- End Logic from LoginSignup.jsx integrated into HomePage ---


  // If authenticated, redirect to dashboard immediately when HomePage is accessed
  // This handles cases where a logged-in user tries to go to the root path "/"
  useEffect(() => {
      if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
      }
  }, [isAuthenticated, navigate]); // Rerun effect if isAuthenticated or navigate changes


  return (
    // Use the dark mode state for the main background
    <main className={`min-h-screen ${
        isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-blue-50'
      }`}>
      <section id='home' className="min-h-screen flex flex-col items-center justify-center space-y-6 px-8 py-12">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16">
          {/* Left Side - Image and Welcome */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4 mt-10"> {/* Added dark mode text */}
              Welcome to, <span className="text-blue-600 dark:text-blue-400">Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i></span> {/* Adjusted TeamUP styling */}
            </h1>
            <div className="w-full max-w-lg h-[400px] overflow-hidden rounded-2xl shadow-xl mx-auto lg:mx-0 mt-3">
              <img
                src={images[index]}
                alt="Slider"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>

          {/* Right Side - Integrated Login/Signup Form */}
          {/* Only show the form if not authenticated */}
          {!isAuthenticated && (
            <div className="flex-1 max-w-md w-full">
              <div className={`w-full ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              } rounded-xl shadow-xl p-8 border`}>
                <div className="mb-6 text-center">
                  <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {action === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
                  </h1>
                  <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {action === 'Sign Up' ? 'Join our community today' : 'Sign in to your account'}
                  </p>
                </div>

                {/* Success message */}
                {success && (
                  <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-200">
                    {success}
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {action === 'Sign Up' && (
                    <div>
                      <label htmlFor="name" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>Name</label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-700'
                        }`}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-700'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} block mb-1`}>Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-700'
                      }`}
                      required
                      minLength={6}
                    />
                  </div>

                  {action === 'Sign Up' ? (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className={`flex items-center justify-center w-full py-3 px-4 border rounded-lg shadow-sm font-medium transition-colors ${
                          isDark ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}>
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.871-1.742-4.373-2.815-7.035-2.815-5.747 0-10.404 4.657-10.404 10.404s4.657 10.404 10.404 10.404c8.106 0 9.886-7.766 9.073-12.361h-8.773z" fill={isDark ? "#555555" : "#dddddd"}/>
                        </svg>
                        Continue with Google
                      </button>
                    </div>
                  ) : (
                    <div className="mt-4 text-sm text-center">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Forgot Password? </span>
                      <span className="text-blue-600 cursor-pointer hover:underline font-medium">Reset it here</span>
                    </div>
                  )}

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors shadow-md ${
                        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        action === 'Sign Up' ? 'Create Account' : 'Sign In'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center text-sm">
                  {action === 'Sign Up' ? (
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Already have an account?{' '}
                      <span
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => setAction('Log In')}
                      >
                        Sign In
                      </span>
                    </p>
                  ) : (
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      Don't have an account?{' '}
                      <span
                        className="text-blue-600 font-medium cursor-pointer hover:underline"
                        onClick={() => setAction('Sign Up')}
                      >
                        Create one
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div id="about">
        <AboutUs />
      </div>

      {/* Contact Us Section (footer-like) */}
      <div id='contact'>
        <ContactUs />
      </div>
    </main>
  );
}

export default HomePage;