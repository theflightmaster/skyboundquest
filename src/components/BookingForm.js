'use client';

import { useState } from 'react';
import PaymentButton from './PaymentButton';
import { User, Mail, Phone, MapPin, Plane, Calendar, Clock, Luggage, Briefcase, Tag } from 'lucide-react';
import { format } from 'date-fns';

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

  // Use the price from flight data
  // const totalAmount = flight?.price?.amount || flight?.total_price?.amount || 299;
  connst totalAmount = 20000;
  
  const formattedAmount = totalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Get airline name from API response
  const airlineName = flight?.airline?.name || flight?.outbound?.airline?.name || 'Airline';

  // Construct proper flight data structure for email
  const emailFlightData = {
    // For one-way flights
    flight: flight?.flight || flight?.outbound?.flight || {},
    airline: flight?.airline || flight?.outbound?.airline || {},
    departure: flight?.departure || flight?.outbound?.departure || {},
    arrival: flight?.arrival || flight?.outbound?.arrival || {},
    flight_date: flight?.flight_date || flight?.outbound?.flight_date || keyDetails?.departureDate,
    duration: flight?.duration || flight?.outbound?.duration || keyDetails?.duration,
    stops: flight?.stops || flight?.outbound?.stops || 0,
    // For round-trip flights
    outbound: flight?.outbound || null,
    return: flight?.return || null,
    type: flight?.type || 'one_way',
  };

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
            <div className="flex items-center gap-2">
              <Plane size={20} className="text-indigo-600" />
              <span className="font-semibold text-gray-800 text-base">Flight Summary</span>
            </div>
            
          </div>
          
          <div className="flex items-center justify-between mb-5">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">{keyDetails?.departureTime || '--:--'}</p>
              <p className="text-base font-semibold text-gray-600 mt-1">{flight?.departure?.iata || flight?.outbound?.departure?.iata || 'N/A'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{flight?.departure?.airport || flight?.outbound?.departure?.airport || ''}</p>
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
              {/* <div className="text-center mt-2">
                <p className="text-sm font-medium text-gray-600">{keyDetails?.duration || 'N/A'}</p>
              </div> */}
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">{keyDetails?.arrivalTime || '--:--'}</p>
              <p className="text-base font-semibold text-gray-600 mt-1">{flight?.arrival?.iata || flight?.outbound?.arrival?.iata || 'N/A'}</p>
              <p className="text-xs text-gray-400 mt-0.5">{flight?.arrival?.airport || flight?.outbound?.arrival?.airport || ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Departure Date</p>
                <p className="text-base font-semibold text-gray-800">{keyDetails?.departureDate || 'Date not available'}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Luggage size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Duration</p>
                <p className="text-base font-semibold text-gray-800">{keyDetails?.duration || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Tag size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Number</p>
                <p className="text-base font-semibold text-gray-800">{flight?.flight?.iata || flight?.outbound?.flight?.iata || keyDetails?.flightNumber || 'N/A'}</p>
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
            flightData={emailFlightData}
            keyDetails={keyDetails}
          />
        </div>
      </div>
    </div>
  );
}