'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Download, Home, BookOpen, Mail, Plane, ArrowRight, Receipt } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookingRef, setBookingRef] = useState(null);
  const [amount, setAmount] = useState(null);
  
  const reference = searchParams.get('reference');
  const amountParam = searchParams.get('amount');

  useEffect(() => {
    if (!reference) {
      router.push('/');
      return;
    }

    setBookingRef(reference);
    setAmount(amountParam);
    setLoading(false);
    
    toast.success('Payment successful! Your booking is confirmed.');
  }, [reference, amountParam, router]);

  // Screenshot prevention - silent mode (no notifications)
  useEffect(() => {
    // Disable right-click globally
    const disableRightClick = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts for screenshots
    const disableKeyboardShortcuts = (e) => {
      // Prevent Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Ctrl+P (Print)
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
      }
      // Prevent Windows + Shift + S (Snipping Tool)
      if (e.metaKey && e.shiftKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      // Prevent Cmd + Shift + 3/4 (Mac screenshots)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
        e.preventDefault();
        return false;
      }
    };

    // Add CSS to prevent selection and printing (silent)
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body {
          display: none !important;
        }
      }
      * {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      /* Prevent selection on mobile */
      img, div, p, h1, h2, h3, span {
        -webkit-tap-highlight-color: transparent;
      }
    `;
    document.head.appendChild(style);

    // Prevent screenshot on mobile via touch events
    const preventTouchScreenshot = (e) => {
      // Prevent three-finger tap on mobile
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        return false;
      }
    };

    // Detect and prevent volume down + power button combo (Android screenshot)
    let lastVolumeDown = 0;
    const detectVolumeButton = (e) => {
      if (e.key === 'VolumeDown' || e.keyCode === 175) {
        const now = Date.now();
        if (now - lastVolumeDown < 500) {
          e.preventDefault();
          return false;
        }
        lastVolumeDown = now;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('keydown', detectVolumeButton);
    document.addEventListener('touchstart', preventTouchScreenshot);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('keydown', detectVolumeButton);
      document.removeEventListener('touchstart', preventTouchScreenshot);
      document.head.removeChild(style);
    };
  }, []);

  const handleDownloadTicket = () => {
    toast.success('Ticket download started');
    // Implement ticket download logic here
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Plane size={24} className="text-blue-600 animate-bounce" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-semibold">Verifying your payment...</p>
          <p className="text-gray-400 text-sm mt-1">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 py-12"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-24">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
                <p className="text-green-100">Your flight booking has been confirmed</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Booking Reference */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-blue-600 font-medium flex items-center gap-2 justify-center md:justify-start">
                    <Receipt size={14} />
                    Booking Reference
                  </p>
                  <p className="text-2xl font-mono font-bold text-blue-900">{bookingRef}</p>
                </div>
                <div className="w-px h-12 bg-blue-200 hidden md:block"></div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-blue-600 font-medium">Total Amount Paid</p>
                  <p className="text-2xl font-bold text-blue-900">${(amount || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <button
                onClick={handleDownloadTicket}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-medium cursor-pointer"
              >
                <Download size={18} />
                Download Ticket
              </button> */}
              
              <Link
                href="#"
                className="flex items-center justify-center gap-2 bg-gray-600 text-white py-3 rounded-xl hover:bg-gray-700 transition-all font-medium text-center"
              >
                <BookOpen size={18} />
                My Bookings
              </Link>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition-all font-medium text-center"
              >
                <Home size={18} />
                Back to Home
              </Link>
            </div>

            {/* Email Notice */}
            <div className="mt-6 pt-6 border-t text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Mail size={16} />
                <span>A confirmation email has been sent to your registered email address</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Plane size={32} className="text-blue-600 animate-bounce" />
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}