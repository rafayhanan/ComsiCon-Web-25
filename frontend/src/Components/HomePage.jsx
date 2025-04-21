import { useState, useEffect } from 'react';
import HomePage1 from '../assets/HomePage1.jpg';
import HomePage2 from '../assets/HomePage2.jpg';
import { Card, CardContent } from '@/components/ui/card';
import AboutUs from './AboutUs'; 
import ContactUs from './ContactUs';
import LoginSignup from './LoginSignup';

function HomePage() {
  const images = [HomePage1, HomePage2];
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={`bg-blue-50 `}>
      <section id='home' className="min-h-screen flex flex-col items-center justify-center space-y-6 px-8 py-12">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16">
          {/* Left Side - Image and Welcome */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-blue-600 mb-4 mt-10">
              Welcome to,  <h1 className="text-5xl text-blue-600">Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i></h1>
            </h1>
            <div className="w-full max-w-lg h-[400px] overflow-hidden rounded-2xl shadow-xl mx-auto lg:mx-0 mt-3">
              <img
                src={images[index]}
                alt="Slider"
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
          </div>

          {/* Right Side - Signup Card */}
          <div className="flex-1 max-w-md w-full bg-blue-50">
            
                <LoginSignup />
              
          </div>
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