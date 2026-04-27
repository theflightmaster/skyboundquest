'use client';

import { Plane, Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export default function FlightTrackingCard({ trackingResult, onReset }) {
  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString || timeString === '--:--' || timeString === 'N/A') {
      return '--:--';
    }
    
    // If it's already in HH:MM format, return as is
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    try {
      // Try to parse as date string
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    } catch (e) {
      // If parsing fails, return original
      return timeString;
    }
    
    return timeString;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') {
      return 'Date not available';
    }
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (e) {
      return dateString;
    }
    
    return dateString;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'landed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'today': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'upcoming': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'In Air';
      case 'landed': return 'Landed';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      case 'scheduled': return 'Scheduled';
      case 'completed': return 'Completed';
      case 'today': return 'Today\'s Flight';
      case 'upcoming': return 'Upcoming Flight';
      default: return 'Confirmed';
    }
  };

  // Format times and dates for display
  const departureTime = formatTime(trackingResult.departure?.scheduled || trackingResult.departure?.time);
  const arrivalTime = formatTime(trackingResult.arrival?.scheduled || trackingResult.arrival?.time);
  
  // Format departure and arrival dates
  const departureDate = formatDate(trackingResult.departure?.date || trackingResult.flight_date);
  const arrivalDate = formatDate(trackingResult.arrival?.date || trackingResult.flight_date);
  
  const formattedDate = formatDate(trackingResult.flight_date);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-indigo-100">Flight Status</p>
              <p className="text-2xl font-bold text-white">{trackingResult.flight?.iata}</p>
              <p className="text-sm text-indigo-100">{trackingResult.airline?.name}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(trackingResult.flight_status)}`}>
            {getStatusText(trackingResult.flight_status)}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Booking Reference */}
        {trackingResult.booking_reference && (
          <div className="mb-6 bg-indigo-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-indigo-600" />
              <div>
                <p className="text-xs text-indigo-600 font-semibold">BOOKING REFERENCE</p>
                <p className="text-lg font-bold text-indigo-900">{trackingResult.booking_reference}</p>
              </div>
            </div>
          </div>
        )}

        {/* Passenger Name */}
        {trackingResult.passenger_name && (
          <div className="mb-6 bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-semibold">PASSENGER</p>
            <p className="text-lg font-bold text-gray-800">{trackingResult.passenger_name}</p>
          </div>
        )}

        {/* Flight Route */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-gray-800">{departureTime}</p>
            <p className="text-lg font-semibold text-gray-600 mt-1">{trackingResult.departure?.iata}</p>
            <p className="text-sm text-gray-500 mt-1">{departureDate}</p>
            <p className="text-sm text-gray-400 mt-1">{trackingResult.departure?.airport}</p>
            {/* {trackingResult.departure?.terminal && (
              <p className="text-xs text-indigo-600 mt-2">Terminal: {trackingResult.departure.terminal}</p>
            )}
            {trackingResult.departure?.gate && (
              <p className="text-xs text-indigo-600">Gate: {trackingResult.departure.gate}</p>
            )} */}
          </div>
          
          <div className="flex-1 px-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-white px-3 py-1 rounded-full">
                  <Plane size={20} className="text-indigo-500" />
                </div>
              </div>
            </div>
            {trackingResult.duration && (
              <p className="text-center text-sm text-gray-500 mt-2">Duration: {trackingResult.duration}</p>
            )}
          </div>
          
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-gray-800">{arrivalTime}</p>
            <p className="text-lg font-semibold text-gray-600 mt-1">{trackingResult.arrival?.iata}</p>
            <p className="text-sm text-gray-500 mt-1">{arrivalDate}</p>
            <p className="text-sm text-gray-400 mt-1">{trackingResult.arrival?.airport}</p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Flight Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Flight Date</span>
                <span className="font-semibold text-gray-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Airline</span>
                <span className="font-semibold text-gray-800">{trackingResult.airline?.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Flight Number</span>
                <span className="font-semibold text-gray-800">{trackingResult.flight?.iata}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Terminal & Gate</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Departure Terminal</span>
                <span className="font-semibold text-gray-800">{trackingResult.departure?.terminal || 'TBD'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Departure Gate</span>
                <span className="font-semibold text-gray-800">{trackingResult.departure?.gate || 'TBD'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Arrival Terminal</span>
                <span className="font-semibold text-gray-800">{trackingResult.arrival?.terminal || 'TBD'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-semibold cursor-pointer"
          >
            Track Another Flight
          </button>
          <a
            href="/"
            className="flex-1 bg-gradient-to-r from-indigo-800 to-indigo-800 text-white py-3 rounded-xl hover:shadow-lg transition font-semibold text-center cursor-pointer"
          >
            Back to Home
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}