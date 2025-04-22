'use client';

function ContactUs() {
  return (
    <footer className="bg-blue-50 px-6 py-16 text-gray-800">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-blue-900">Contact Us</h2>
      </div>

      {/* Three-column layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 text-center md:text-left gap-10">
        {/* Left - Get in Touch */}
        <div>
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Get in Touch</h3>
          <p>Email: <a href="mailto:teamup@example.com" className="text-indigo-600 hover:underline">teamup@example.com</a></p>
          <p>Phone: <a href="tel:+123456789" className="text-indigo-600 hover:underline">+1 234 567 89</a></p>
        </div>

        {/* Center - Follow Us */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Follow Us</h3>
          <ul className="space-y-1">
            <li><a href="https://www.facebook.com" target="_blank" className="text-indigo-600 hover:underline">Facebook</a></li>
            <li><a href="https://www.twitter.com" target="_blank" className="text-indigo-600 hover:underline">Twitter</a></li>
            <li><a href="https://www.instagram.com" target="_blank" className="text-indigo-600 hover:underline">Instagram</a></li>
          </ul>
        </div>

        {/* Right - Newsletter */}
        <div className="md:text-right">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Newsletter</h3>
          <p className="mb-2">Subscribe for updates:</p>
          <form className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
            />
            <button 
              type="submit" 
              className="bg-blue-900 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-16 border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} TeamUp. All rights reserved.
      </div>
    </footer>
  );
}

export default ContactUs;
