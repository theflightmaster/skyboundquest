// components/BookingForm.js - Complete updated version with formatted duration
'use client';

import { useState } from 'react';
import PaymentButton from './PaymentButton';
import { User, Mail, Phone, MapPin, Plane, Calendar, Clock, Tag } from 'lucide-react';

export default function BookingForm({ flight, flightData, keyDetails }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    passportNumber: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper function to format duration in hours and minutes
  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    
    // If it's already a formatted string like "2h 30m", return as is
    if (typeof duration === 'string' && (duration.includes('h') || duration.includes('m'))) {
      return duration;
    }
    
    // Convert to number if it's a string
    const minutes = typeof duration === 'string' ? parseInt(duration) : duration;
    
    // Check if it's a valid number
    if (isNaN(minutes) || minutes <= 0) return 'N/A';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (mins > 0) {
      return `${mins}m`;
    }
    
    return 'N/A';
  };

  // Extract flight information from props
  const isRoundTrip = flight?.type === 'round_trip' || flight?.outbound !== null;
  const primaryFlight = isRoundTrip ? flight?.outbound : flight;
  
  // Get all flight details with proper fallbacks
  const airlineName = flight?.airlineName || 
                      flight?.airline?.name || 
                      primaryFlight?.airline?.name || 
                      keyDetails?.airline || 
                      'Airline';
  
  const flightNumber = flight?.flightNumber || 
                       flight?.flight?.iata || 
                       primaryFlight?.flight?.iata || 
                       keyDetails?.flightNumber || 
                       'N/A';
  
  const departureAirport = flight?.departure?.iata || 
                           primaryFlight?.departure?.iata || 
                           keyDetails?.departureAirport || 
                           'N/A';
  
  const arrivalAirport = flight?.arrival?.iata || 
                         primaryFlight?.arrival?.iata || 
                         keyDetails?.arrivalAirport || 
                         'N/A';
  
  const departureTime = flight?.departure?.time || 
                        primaryFlight?.departure?.time || 
                        keyDetails?.departureTime || 
                        'N/A';
  
  const arrivalTime = flight?.arrival?.time || 
                      primaryFlight?.arrival?.time || 
                      keyDetails?.arrivalTime || 
                      'N/A';
  
  const departureDate = flight?.departure?.date || 
                        primaryFlight?.departure?.date || 
                        keyDetails?.departureDate || 
                        'N/A';
  
  // Format the duration properly
  const rawDuration = flight?.duration || 
                      primaryFlight?.duration || 
                      keyDetails?.duration || 
                      'N/A';
  const formattedDuration = formatDuration(rawDuration);
  
  const terminal = flight?.departure?.terminal || 
                   primaryFlight?.departure?.terminal || 
                   keyDetails?.terminal || 
                   'TBD';
  
  const gate = flight?.departure?.gate || 
               primaryFlight?.departure?.gate || 
               keyDetails?.gate || 
               'TBD';
  
  const totalAmount = flight?.price?.amount || 
                      flight?.total_price?.amount || 
                      keyDetails?.price || 
                      299;

  // Construct complete flight data for email
  const completeFlightData = {
    flightNumber: flightNumber,
    airline: {
      name: airlineName,
      iata: flight?.airlineCode || primaryFlight?.airline?.iata,
    },
    departure: {
      iata: departureAirport,
      airport: primaryFlight?.departure?.airport || flight?.departure?.airport || '',
      scheduled: primaryFlight?.departure?.scheduled,
      time: departureTime,
      date: departureDate,
      terminal: terminal,
      gate: gate,
    },
    arrival: {
      iata: arrivalAirport,
      airport: primaryFlight?.arrival?.airport || flight?.arrival?.airport || '',
      scheduled: primaryFlight?.arrival?.scheduled,
      time: arrivalTime,
      date: departureDate,
    },
    duration: formattedDuration,
    duration_minutes: primaryFlight?.duration_minutes,
    stops: flight?.stops || primaryFlight?.stops || 0,
    cabin_class: flight?.cabin_class || primaryFlight?.cabin_class || 'Economy',
    price: {
      amount: totalAmount,
      currency: 'USD',
    },
    type: flight?.type || 'one_way',
  };

  // Key details for email and display
  const emailKeyDetails = {
    flightNumber: flightNumber,
    airline: airlineName,
    airlineCode: flight?.airlineCode,
    departureAirport: departureAirport,
    arrivalAirport: arrivalAirport,
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    departureDate: departureDate,
    duration: formattedDuration,
    terminal: terminal,
    gate: gate,
    cabinClass: completeFlightData.cabin_class,
    price: totalAmount,
    departureAirportFull: primaryFlight?.departure?.airport || '',
    arrivalAirportFull: primaryFlight?.arrival?.airport || '',
  };

  // Log for debugging
  // console.log('BookingForm - Flight Data:', completeFlightData);
  // console.log('BookingForm - Key Details:', emailKeyDetails);
  // console.log('BookingForm - Formatted Duration:', formattedDuration);

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Plane size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Complete Your Booking</h2>
            <p className="text-indigo-100 text-sm">{airlineName}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-50 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            {/* <div className="flex items-center gap-2">
              <Plane size={20} className="text-indigo-600" />
              <span className="font-semibold text-gray-800 text-base">Flight Summary</span>
            </div> */}
          </div>
          
          <div className="flex items-center justify-between mb-5">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">{departureTime}</p>
              <p className="text-base font-semibold text-gray-600 mt-1">{departureAirport}</p>
              <p className="text-xs text-gray-400 mt-0.5">{primaryFlight?.departure?.airport || ''}</p>
            </div>
            <div className="flex-1 px-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-gray-400"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-indigo-50 px-2">
                    <Plane size={18} className="text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">{arrivalTime}</p>
              <p className="text-base font-semibold text-gray-600 mt-1">{arrivalAirport}</p>
              <p className="text-xs text-gray-400 mt-0.5">{primaryFlight?.arrival?.airport || ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Departure Date</p>
                <p className="text-sm font-semibold text-gray-800">{departureDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Duration</p>
                <p className="text-sm font-semibold text-gray-800">{formattedDuration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Tag size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Number</p>
                <p className="text-sm font-semibold text-gray-800">{flightNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name (as on passport)"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="passportNumber"
              placeholder="Passport Number"
              value={formData.passportNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <PaymentButton
            amount={totalAmount}
            email={formData.email}
            passengerData={formData}
            flightData={completeFlightData}
            keyDetails={emailKeyDetails}
          />
        </div>
      </div>
    </div>
  );
} 