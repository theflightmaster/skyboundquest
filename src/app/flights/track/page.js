'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plane, MapPin, Calendar, Clock, ArrowRight, X, Menu } from 'lucide-react';
import Footer from '@/components/Footer';
import FlightTrackingForm from '@/components/FlightTrackingForm';
import FlightTrackingCard from '@/components/FlightTrackingCard';

export default function TrackFlightPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get parameters from URL on initial load
  useEffect(() => {
    const urlFlightNumber = searchParams.get('flightNumber');
    const urlAirlineCode = searchParams.get('airlineCode');
    const urlDate = searchParams.get('date');

    if (urlFlightNumber && urlAirlineCode && urlDate) {
      // Auto-search when coming from external link
      handleTrack(urlAirlineCode, urlFlightNumber, urlDate);
    }
  }, [searchParams]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleTrack = async (airlineCode, flightNumber, flightDate) => {
    setLoading(true);
    setError(null);
    setTrackingResult(null);

    try {
      const response = await fetch(`/api/flights/track?flightNumber=${flightNumber}&airlineCode=${airlineCode}&date=${flightDate}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Flight not found');
      }

      setTrackingResult(data.data);
      
      // Update URL without reload
      router.push(`/flights/track?flightNumber=${flightNumber}&airlineCode=${airlineCode}&date=${flightDate}`, { scroll: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setTrackingResult(null);
    setError(null);
    router.push('/flights/track', { scroll: false });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Tracking Form Sidebar Content Component
  const TrackingSidebarContent = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-20">
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-5 py-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-white" />
          <h3 className="font-bold text-lg text-white">Track New Flight</h3>
        </div>
        <p className="text-indigo-100 text-sm mt-1">Enter flight details to track</p>
      </div>
      <div className="p-5">
        <FlightTrackingForm onTrack={handleTrack} loading={loading} error={error} />
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-4 md:px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Flight Tracking</h1>
                <p className="text-indigo-100 text-sm mt-1">
                  {trackingResult ? 'Current flight status' : 'Real-time flight information'}
                </p>
              </div>
              {/* Mobile Filter Button - Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all cursor-pointer"
              >
                <Menu size={18} />
                <span className="text-sm">New Search</span>
              </button>
            </div>
          </div>
          
          {trackingResult && (
            <div className="p-4 md:p-6">
              <div className="flex flex-wrap gap-4 md:gap-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Plane size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Flight</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">{trackingResult.flight?.iata}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">{formatDate(trackingResult.flight_date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Route</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                      {trackingResult.departure?.iata} → {trackingResult.arrival?.iata}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Tracking Form Sidebar */}
          <div className="hidden lg:block lg:w-96 flex-shrink-0">
            <TrackingSidebarContent />
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto animate-slideInRight">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-indigo-600" />
                      <h3 className="font-bold text-lg text-gray-800">Track New Flight</h3>
                    </div>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <FlightTrackingForm onTrack={(airlineCode, flightNumber, flightDate) => {
                    handleTrack(airlineCode, flightNumber, flightDate);
                    setIsMobileMenuOpen(false);
                  }} loading={loading} error={error} />
                </div>
              </div>
            </>
          )}

          {/* Results Area */}
          <div className="flex-1">
            {!trackingResult && !loading && !error && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane size={40} className="text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Flight Tracked Yet</h3>
                <p className="text-gray-500 text-sm">
                  Enter a flight number on the left to see real-time status, departure and arrival times, gates, and more
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-indigo-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Plane size={24} className="text-indigo-600 animate-bounce" />
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold mt-6">Tracking Flight...</p>
                  <p className="text-gray-400 text-sm mt-2">Fetching real-time flight information</p>
                </div>
              </div>
            )}

            {error && !loading && !trackingResult && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane size={32} className="text-red-500" />
                </div>
                <p className="text-red-700 font-semibold">{error}</p>
                <p className="text-red-600 text-sm mt-2">Please check the flight number and date and try again.</p>
              </div>
            )}

            {trackingResult && !loading && (
              <FlightTrackingCard trackingResult={trackingResult} onReset={handleNewSearch} />
            )}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
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
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}