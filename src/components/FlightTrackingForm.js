'use client';

import { useState, useRef } from 'react';
import { Plane, Calendar, Search, AlertCircle, Ticket } from 'lucide-react';
import FlightTrackingCard from './FlightTrackingCard';

export default function FlightTrackingForm() {
  const [bookingReference, setBookingReference] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (bookingReference) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/flights/track?bookingReference=${bookingReference.toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track flight');
      }

      if (data.success && data.data) {
        setTrackingResult(data.data);
      } else {
        throw new Error('No flight information found');
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bookingReference) {
      setError('Please enter your booking reference');
      return;
    }

    if (bookingReference.length !== 6) {
      setError('Booking reference should be 6 characters');
      return;
    }

    handleTrack(bookingReference);
  };

  const handleReset = () => {
    setTrackingResult(null);
    setError(null);
    setBookingReference('');
  };

  // If we have a tracking result, show the card
  if (trackingResult) {
    return <FlightTrackingCard trackingResult={trackingResult} onReset={handleReset} />;
  }

  return (
    <div className="w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Booking Reference Input */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Booking Reference
          </label>
          <div className="relative group">
            {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <Ticket size={20} />
            </div> */}
            <input
              type="text"
              placeholder="Enter your booking reference (e.g., ABC123)"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
              className="w-full pl-5 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 placeholder-gray-400 uppercase"
              required
              maxLength={6}
            />
          </div>
         
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-800 to-indigo-800 text-white py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg cursor-pointer transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Tracking Flight...
            </>
          ) : (
            <>
              <Search size={20} />
              Track Flight
            </>
          )}
        </button>
      </form>
    </div>
  );
}