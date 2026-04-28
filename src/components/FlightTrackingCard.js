'use client';

import { Plane, Calendar, Clock, MapPin, Users, ArrowRight, RotateCcw, Ticket, User, Phone, Mail } from 'lucide-react';

export default function FlightTrackingCard({ trackingResult, onReset }) {
  const { flight, passenger, booking, returnFlight, transactionId } = trackingResult;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString && !timeString) return 'N/A';
    return `${formatDate(dateString)} at ${formatTime(timeString)}`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-6 md:px-8 py-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Flight Details</h2>
            <p className="text-indigo-100 mt-1">Booking Reference: {booking.reference}</p>
          </div>
          <button
            onClick={onReset}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <RotateCcw size={16} />
            Track Another
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Passenger Information */}
        <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-5 border border-indigo-100">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-gray-800">Passenger Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{passenger.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{passenger.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{passenger.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Information */}
        <div>
          {/* <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-gray-800">Flight Information</h3>
          </div> */}
          
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
            {/* Airline and Flight Number */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Airline</p>
                <p className="font-bold text-gray-800">{flight.airline.name} ({flight.airline.iata})</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Flight Number</p>
                <p className="font-bold text-gray-800">{flight.fullFlightNumber}</p>
              </div>
            </div>

            {/* Route */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex-1 text-center md:text-left">
                <p className="text-2xl font-bold text-gray-800">{flight.departure.iata}</p>
                <p className="text-sm text-gray-600 mt-1">{flight.departure.airport}</p>
                <p className="text-xs text-gray-500">{flight.departure.city}, {flight.departure.country}</p>
                <div className="mt-2">
                  <p className="font-semibold text-gray-800">{formatTime(flight.departure.time)}</p>
                  <p className="text-xs text-gray-500">{formatDate(flight.departure.date)}</p>
                  {flight.departure.terminal && (
                    <p className="text-xs text-gray-500 mt-1">Terminal: {flight.departure.terminal}</p>
                  )}
                  {flight.departure.gate && (
                    <p className="text-xs text-gray-500">Gate: {flight.departure.gate}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Plane size={24} className="text-indigo-600 rotate-90 md:rotate-0" />
                <div className="text-xs text-gray-500 mt-2">{flight.duration}</div>
                {flight.stops > 0 && (
                  <div className="text-xs text-gray-500">{flight.stops} stop(s)</div>
                )}
              </div>

              <div className="flex-1 text-center md:text-right">
                <p className="text-2xl font-bold text-gray-800">{flight.arrival.iata}</p>
                <p className="text-sm text-gray-600 mt-1">{flight.arrival.airport}</p>
                <p className="text-xs text-gray-500">{flight.arrival.city}, {flight.arrival.country}</p>
                <div className="mt-2">
                  <p className="font-semibold text-gray-800">{formatTime(flight.arrival.time)}</p>
                  <p className="text-xs text-gray-500">{formatDate(flight.arrival.date)}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Cabin Class</p>
                <p className="font-medium text-gray-800">{flight.cabinClass}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Type</p>
                <p className="font-medium text-gray-800 capitalize">{flight.flightType.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Return Flight Information (if round trip) */}
        {returnFlight && returnFlight.flightNumber && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <RotateCcw size={20} className="text-indigo-600" />
              <h3 className="font-bold text-gray-800">Return Flight Information</h3>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              {/* Airline and Flight Number */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Airline</p>
                  <p className="font-bold text-gray-800">{returnFlight.airline.name} ({returnFlight.airline.iata})</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Flight Number</p>
                  <p className="font-bold text-gray-800">{returnFlight.fullFlightNumber}</p>
                </div>
              </div>

              {/* Route */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-2xl font-bold text-gray-800">{returnFlight.departure.iata}</p>
                  <p className="text-sm text-gray-600 mt-1">{returnFlight.departure.airport}</p>
                  <div className="mt-2">
                    <p className="font-semibold text-gray-800">{formatTime(returnFlight.departure.time)}</p>
                    <p className="text-xs text-gray-500">{formatDate(returnFlight.departure.date)}</p>
                    {returnFlight.departure.terminal && (
                      <p className="text-xs text-gray-500 mt-1">Terminal: {returnFlight.departure.terminal}</p>
                    )}
                    {returnFlight.departure.gate && (
                      <p className="text-xs text-gray-500">Gate: {returnFlight.departure.gate}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <ArrowRight size={24} className="text-indigo-600" />
                  <div className="text-xs text-gray-500 mt-2">{returnFlight.duration}</div>
                  {returnFlight.stops > 0 && (
                    <div className="text-xs text-gray-500">{returnFlight.stops} stop(s)</div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-right">
                  <p className="text-2xl font-bold text-gray-800">{returnFlight.arrival.iata}</p>
                  <p className="text-sm text-gray-600 mt-1">{returnFlight.arrival.airport}</p>
                  <div className="mt-2">
                    <p className="font-semibold text-gray-800">{formatTime(returnFlight.arrival.time)}</p>
                    <p className="text-xs text-gray-500">{formatDate(returnFlight.arrival.date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={18} className="text-indigo-600" />
            <h4 className="font-semibold text-gray-800">Booking Details</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Booking Reference</p>
              <p className="font-mono font-bold text-gray-800">{booking.reference}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Transaction ID</p>
              <p className="font-mono text-sm text-gray-800">{transactionId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="font-bold text-gray-800">${booking.amount.
                  toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Booking Date</p>
              <p className="text-sm text-gray-800">{formatDate(booking.bookingDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}