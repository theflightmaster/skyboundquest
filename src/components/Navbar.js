'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Plane, Home, BookOpen, Phone, MapPin, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTrackFlight = () => {
    // If on homepage, scroll to the tracking section
    if (pathname === '/') {
      const trackingSection = document.getElementById('track-flight');
      if (trackingSection) {
        trackingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on any other page, navigate to homepage with hash
      router.push('/#track-flight');
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-24">
            {/* Logo - Left Side */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition cursor-pointer">
              <img src="/logo.png" alt="Logo" className="w-50" />  
            </Link>

            {/* Right Side - Track Flight Button & Support */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleTrackFlight}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-800 to-indigo-800 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                <MapPin size={18} />
                <span className=" font-medium">Track Flight</span>
              </button>
              <div className="hidden md:flex items-center space-x-2 text-gray-600">
                <Phone size={16} />
                <span className="font-medium">24/7 Support</span>
              </div>
              
              {/* Hamburger Menu Button - Mobile */}
              <button
                onClick={toggleMenu}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                {isMenuOpen ? <X size={24} className="text-gray-600" /> : <Menu size={24} className="text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
            onClick={toggleMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 right-0 w-64 bg-white shadow-2xl z-50 md:hidden rounded-bl-2xl animate-slideInRight">
            <div className="flex flex-col p-4 space-y-2">
              {/* <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition cursor-pointer"
                onClick={toggleMenu}
              >
                <Home size={20} />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/flights/search"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition cursor-pointer"
                onClick={toggleMenu}
              >
                <Plane size={20} />
                <span className="font-medium">Flights</span>
              </Link>
              <Link
                href="/bookings"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition cursor-pointer"
                onClick={toggleMenu}
              >
                <BookOpen size={20} />
                <span className="font-medium">My Bookings</span>
              </Link> */}
              <button
                onClick={handleTrackFlight}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition cursor-pointer w-full text-left"
              >
                <MapPin size={20} />
                <span className="font-medium">Track Flight</span>
              </button>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex items-center gap-3 px-4 py-3 text-gray-500">
                <Phone size={20} />
                <span className="">24/7 Support</span>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}