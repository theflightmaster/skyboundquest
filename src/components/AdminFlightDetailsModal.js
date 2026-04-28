'use client';

import { X, Plane, Calendar, Clock, MapPin, Users, ArrowRight, RotateCcw, Ticket, User, Phone, Mail, DollarSign } from 'lucide-react';

export default function AdminFlightDetailsModal({ booking, onClose }) {
  const { flight, passenger, returnFlight, bookingReference, amount, transactionId, bookingDate, paidAt } = booking;

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-800 to-indigo-800 px-6 md:px-8 py-6 text-white rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Flight Details</h2>
              <p className="text-indigo-100 mt-1">Booking Reference: {bookingReference}</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Passenger Information */}
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-indigo-600" />
              <h3 className="font-bold text-gray-800">Passenger Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">{passenger.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{passenger.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{passenger.phone}</p>
                </div>
              </div>
              {passenger.passportNumber && (
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Passport Number</p>
                    <p className="font-medium text-gray-800">{passenger.passportNumber}</p>
                  </div>
                </div>
              )}
              {passenger.address && (
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">{passenger.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flight Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plane size={20} className="text-indigo-600" />
              <h3 className="font-bold text-gray-800">Flight Information</h3>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              {/* Airline and Flight Number */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Airline</p>
                  <p className="font-bold text-gray-800">{flight.airline.name} ({flight.airline.iata})</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Flight Number</p>
                  <p className="font-bold text-gray-800">{`${flight.airline.iata}${flight.flightNumber}`}</p>
                </div>
              </div>

              {/* Route */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex-1 text-center md:text-left">
                  <p className="text-2xl font-bold text-gray-800">{flight.departureAirport.iata}</p>
                  <p className="text-sm text-gray-600 mt-1">{flight.departureAirport.airport}</p>
                  <p className="text-xs text-gray-500">{flight.departureAirport.city}, {flight.departureAirport.country}</p>
                  <div className="mt-2">
                    <p className="font-semibold text-gray-800">{formatTime(flight.departureTime)}</p>
                    <p className="text-xs text-gray-500">{formatDate(flight.departureDateRaw || flight.departureDate)}</p>
                    {flight.terminal && (
                      <p className="text-xs text-gray-500 mt-1">Terminal: {flight.terminal}</p>
                    )}
                    {flight.gate && (
                      <p className="text-xs text-gray-500">Gate: {flight.gate}</p>
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
                  <p className="text-2xl font-bold text-gray-800">{flight.arrivalAirport.iata}</p>
                  <p className="text-sm text-gray-600 mt-1">{flight.arrivalAirport.airport}</p>
                  <p className="text-xs text-gray-500">{flight.arrivalAirport.city}, {flight.arrivalAirport.country}</p>
                  <div className="mt-2">
                    <p className="font-semibold text-gray-800">{formatTime(flight.arrivalTime)}</p>
                    <p className="text-xs text-gray-500">{formatDate(flight.arrivalDateRaw || flight.arrivalDate)}</p>
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
                  <p className="font-medium text-gray-800 capitalize">{flight.flightType?.replace('_', ' ') || 'One Way'}</p>
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
                    <p className="font-bold text-gray-800">{`${returnFlight.airline.iata}${returnFlight.flightNumber}`}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-2xl font-bold text-gray-800">{returnFlight.departureAirport.iata}</p>
                    <p className="text-sm text-gray-600 mt-1">{returnFlight.departureAirport.airport}</p>
                    <div className="mt-2">
                      <p className="font-semibold text-gray-800">{formatTime(returnFlight.departureTime)}</p>
                      <p className="text-xs text-gray-500">{formatDate(returnFlight.departureDateRaw || returnFlight.departureDate)}</p>
                      {returnFlight.terminal && (
                        <p className="text-xs text-gray-500 mt-1">Terminal: {returnFlight.terminal}</p>
                      )}
                      {returnFlight.gate && (
                        <p className="text-xs text-gray-500">Gate: {returnFlight.gate}</p>
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
                    <p className="text-2xl font-bold text-gray-800">{returnFlight.arrivalAirport.iata}</p>
                    <p className="text-sm text-gray-600 mt-1">{returnFlight.arrivalAirport.airport}</p>
                    <div className="mt-2">
                      <p className="font-semibold text-gray-800">{formatTime(returnFlight.arrivalTime)}</p>
                      <p className="text-xs text-gray-500">{formatDate(returnFlight.arrivalDateRaw || returnFlight.arrivalDate)}</p>
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
                <p className="font-mono font-bold text-gray-800">{bookingReference}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm text-gray-800">{transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="font-bold text-gray-800">${amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Booking Date</p>
                <p className="text-sm text-gray-800">{formatDate(bookingDate)}</p>
              </div>
              {paidAt && (
                <div>
                  <p className="text-xs text-gray-500">Payment Date</p>
                  <p className="text-sm text-gray-800">{formatDate(paidAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}