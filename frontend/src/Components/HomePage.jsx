import { useState, useEffect } from 'react';
import HomePage1 from '../assets/HomePage1.jpg';
import HomePage2 from '../assets/HomePage2.jpg';
import { Card, CardContent } from '@/components/ui/card';
import AboutUs from './AboutUs'; 
import ContactUs from './ContactUs';


function HomePage() {
  const images = [ HomePage1, HomePage2,];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-gradient-to-br from-blue-50 to-indigo-100">
    <section className="min-h-screen flex flex-col items-center justify-center space-y-6 p-6">
        <h1 className="text-3xl font-bold text-blue-600">
        Welcome to <span className="text-4xl text-blue-600">Team<i className='text-blue-600/50 dark:text-sky-400/50'>UP</i></span>
        </h1>

        <div className="w-[640px] h-[400px] overflow-hidden rounded-2xl shadow-xl">
        <img
            src={images[index]}
            alt="Slider"
            className="w-full h-full object-cover transition-all duration-500"
        />
        </div>
    </section>
    {/* About Us Section */}
    <AboutUs />

    {/* Contact Us Section (footer-like) */}
    <ContactUs />
    </main>
  );
}

export default HomePage;
