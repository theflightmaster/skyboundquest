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

  const totalAmount = flight?.total_price?.amount || flight?.price?.amount || 299;
  
  const formattedAmount = totalAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Plane size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Complete Your Booking</h2>
            <p className="text-blue-100 text-sm">{flight.airline?.name}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Plane size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-800 text-base">Flight Summary</span>
            </div>
            <div className="flex items-center gap-1 bg-white/60 rounded-lg px-2 py-1">
              <Tag size={14} className="text-blue-600" />
              <span className="text-xs font-mono font-semibold text-gray-700">{flight.flight?.iata}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-5">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">{keyDetails?.departureTime || format(new Date(flight.departure?.scheduled), 'HH:mm')}</p>
              <p className="text-base font-semibold text-gray-600 mt-1">{flight.departure?.iata}</p>
              <p className="text-xs text-gray-400 mt-0.5">{flight.departure?.airport?.split(',')[0]}</p>
            </div>
            <div className="flex-1 px-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-gray-400"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-blue-50 px-2">
                    <Plane size={18} className="text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-medium text-gray-600">{keyDetails?.duration || `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`}</p>
              </div>
            </div>
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gray-800">{keyDetails?.arrivalTime || format(new Date(flight.arrival?.scheduled), 'HH:mm')}</p>
              <p className="text-base font-semibold text-gray-600 mt-1">{flight.arrival?.iata}</p>
              <p className="text-xs text-gray-400 mt-0.5">{flight.arrival?.airport?.split(',')[0]}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Calendar size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Departure Date</p>
                <p className="text-base font-semibold text-gray-800">{keyDetails?.departureDate || format(new Date(flight.flight_date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Luggage size={18} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Baggage Allowance</p>
                <p className="text-base font-semibold text-gray-800">{keyDetails?.baggage || '1 x 23kg'}</p>
                <p className="text-xs text-gray-400">Carry-on: {keyDetails?.carryon || '7kg'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Briefcase size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cabin Class</p>
                <p className="text-base font-semibold text-gray-800">{flight.cabin_class || 'Economy'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Flight Duration</p>
                <p className="text-base font-semibold text-gray-800">{keyDetails?.duration || `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`}</p>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <PaymentButton
            amount={totalAmount}
            email={formData.email}
            passengerData={formData}
            flightData={flight || flightData}
          />
        </div>
      </div>
    </div>
  );
}