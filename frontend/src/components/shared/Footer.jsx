import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white">
      {/* Upper Section */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between py-6 px-6 md:px-12 gap-8 text-center md:text-left">
        
        {/* About Us */}
        <div className="w-full md:w-1/3">
          <h1 className="text-xl font-semibold">About Us</h1>
          <p className="text-gray-400 text-sm mt-2">
            We are dedicated to providing top-quality service and valuable information. 
            Our mission is to enrich lives through exceptional and unforgettable experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/3">
          <h1 className="text-xl font-semibold">Quick Links</h1>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link>
            </li>
            <li>
              <Link to="/news" className="text-gray-400 hover:text-white transition">News Articles</Link>
            </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="w-full md:w-1/3">
          <h1 className="text-xl font-semibold">Contact Us</h1>
          <div className="mt-2 text-gray-400">
            <p>Pal Niche ki Dhani, CRPF ke samne,</p>
            <p>Ramgarh Road, Jaipur</p>
            <p>Rajasthan-302028</p>
            <p className="mt-2">
              📞 <a href="tel:+917851805650" className="hover:text-white">
                +91 7851805650
              </a>
            </p>
          </div>
        </div>

      </div>

      {/* Lower Section */}
      <div className="border-t border-gray-700 text-center py-6 text-gray-400 text-sm">
        <h1 className="text-lg font-semibold">Follow Us On</h1>
        <div className="flex justify-center gap-4 mt-3">
          <Link to="https://www.instagram.com/mayank_saini_l/" target="_blank" className="hover:text-white transition">
            <i className="fab fa-instagram"></i> Instagram
          </Link>
          <Link to="https://www.facebook.com/profile.php?id=61556185926525" target="_blank" className="hover:text-white transition">
            <i className="fab fa-facebook"></i> Facebook
          </Link>
          <Link to="https://www.linkedin.com/in/mayank-saini-47b508259/" target="_blank" className="hover:text-white transition">
            <i className="fab fa-linkedin"></i> LinkedIn
          </Link>
          <Link to="https://x.com/MayankSaini007P" target="_blank" className="hover:text-white transition">
            <i className="fab fa-twitter"></i> Twitter
          </Link>
        </div>

        <p className="mt-4">© {new Date().getFullYear()} TrendSphere. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
