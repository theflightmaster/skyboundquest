'use client';

import Link from 'next/link';
import { Plane } from 'lucide-react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaHeart
} from 'react-icons/fa';
import { 
  MdChevronRight,
  MdLocationOn,
  MdPhone,
  MdEmail
} from 'react-icons/md';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            {/* <div className="flex items-center gap-2 mb-4">
              <Plane className="text-blue-500" size={24} />
              <span className="text-xl font-bold text-white">Skyboundquest</span>
            </div> */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your trusted partner for finding and booking flights worldwide. We make travel simple, affordable, and enjoyable.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/flights/search" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-2 text-sm">
                  <MdChevronRight size={14} />
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center">
              &copy; {currentYear} Skyboundquest. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              {/* &copy; {currentYear} Skyboundquest. All rights reserved. */}
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}