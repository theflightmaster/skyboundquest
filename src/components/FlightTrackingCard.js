'use client';

import { Plane, Calendar, Clock, MapPin } from 'lucide-react';

export default function FlightTrackingCard({ trackingResult, onReset }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'landed': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'In Air';
      case 'landed': return 'Landed';
      case 'delayed': return 'Delayed';
      case 'cancelled': return 'Cancelled';
      default: return 'Scheduled';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {/* <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Plane size={24} className="text-white" />
            </div> */}
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
        {/* Flight Route */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-gray-800">
              {trackingResult.departure?.scheduled 
                ? new Date(trackingResult.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </p>
            <p className="text-lg font-semibold text-gray-600 mt-1">{trackingResult.departure?.iata}</p>
            <p className="text-sm text-gray-400 mt-1">{trackingResult.departure?.airport}</p>
            {trackingResult.departure?.actual && (
              <p className="text-xs text-green-600 mt-2">
                Actual: {new Date(trackingResult.departure.actual).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
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
            <p className="text-center text-sm text-gray-500 mt-2">Flight Path</p>
          </div>
          
          <div className="text-center flex-1">
            <p className="text-3xl font-bold text-gray-800">
              {trackingResult.arrival?.scheduled 
                ? new Date(trackingResult.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '--:--'}
            </p>
            <p className="text-lg font-semibold text-gray-600 mt-1">{trackingResult.arrival?.iata}</p>
            <p className="text-sm text-gray-400 mt-1">{trackingResult.arrival?.airport}</p>
            {trackingResult.arrival?.actual && (
              <p className="text-xs text-green-600 mt-2">
                Actual: {new Date(trackingResult.arrival.actual).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              {/* <Calendar size={18} className="text-indigo-600" /> */}
              Flight Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Flight Date</span>
                <span className="font-semibold text-gray-800">{trackingResult.flight_date}</span>
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
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              {/* <MapPin size={18} className="text-amber-600" /> */}
              Terminal & Gate
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Departure Terminal</span>
                <span className="font-semibold text-gray-800">{trackingResult.departure?.terminal || 'TBD'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Departure Gate</span>
                <span className="font-semibold text-gray-800">{trackingResult.departure?.gate || 'TBD'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">Arrival Terminal</span>
                <span className="font-semibold text-gray-800">{trackingResult.arrival?.terminal || 'TBD'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Baggage Claim</span>
                <span className="font-semibold text-gray-800">{trackingResult.arrival?.baggage || 'TBD'}</span>
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
