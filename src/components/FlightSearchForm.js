'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plane, Calendar, Users, ArrowRight, Repeat, X, ChevronDown, Armchair } from 'lucide-react';
import { searchAirports } from '@/lib/airports';

export default function FlightSearchForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState('one_way');
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [formData, setFormData] = useState({
    departure: '',
    departureCode: '',
    arrival: '',
    arrivalCode: '',
    date: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'Economy',
  });
  const [loading, setLoading] = useState(false);
  const [departureSuggestions, setDepartureSuggestions] = useState([]);
  const [arrivalSuggestions, setArrivalSuggestions] = useState([]);
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState(false);
  
  const departureRef = useRef(null);
  const arrivalRef = useRef(null);
  const passengerRef = useRef(null);
  const cabinRef = useRef(null);

  const totalPassengers = formData.adults + formData.children + formData.infants;

  // Cabin class options with display names
  const cabinOptions = [
    { value: 'Economy', label: 'Economy Class' },
    { value: 'Premium_Economy', label: 'Premium Economy Class' },
    { value: 'Business', label: 'Business Class' },
    { value: 'First', label: 'First Class' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (departureRef.current && !departureRef.current.contains(event.target)) {
        setShowDepartureSuggestions(false);
      }
      if (arrivalRef.current && !arrivalRef.current.contains(event.target)) {
        setShowArrivalSuggestions(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(event.target)) {
        setShowPassengerDropdown(false);
      }
      if (cabinRef.current && !cabinRef.current.contains(event.target)) {
        setShowCabinDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAirportSearch = (value, type) => {
    const suggestions = searchAirports(value);
    
    if (type === 'departure') {
      setDepartureSuggestions(suggestions);
      setShowDepartureSuggestions(true);
      setFormData({ ...formData, departure: value, departureCode: '' });
    } else {
      setArrivalSuggestions(suggestions);
      setShowArrivalSuggestions(true);
      setFormData({ ...formData, arrival: value, arrivalCode: '' });
    }
  };

  const selectAirport = (airport, type) => {
    if (type === 'departure') {
      setFormData({ 
        ...formData, 
        departure: `${airport.code} - ${airport.city}`, 
        departureCode: airport.code 
      });
      setShowDepartureSuggestions(false);
    } else {
      setFormData({ 
        ...formData, 
        arrival: `${airport.code} - ${airport.city}`, 
        arrivalCode: airport.code 
      });
      setShowArrivalSuggestions(false);
    }
  };

  const updatePassengerCount = (type, delta) => {
    setFormData(prev => {
      const newValue = prev[type] + delta;
      if (type === 'adults' && (newValue < 1 || newValue > 9)) return prev;
      if ((type === 'children' || type === 'infants') && (newValue < 0 || newValue > 9)) return prev;
      if (type === 'infants' && newValue > prev.adults) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  // Get the departure code - check if it's a valid IATA code or needs conversion
  let departureCode = formData.departureCode;
  let arrivalCode = formData.arrivalCode;
  
  // If departureCode is empty, try to extract from the input value
  if (!departureCode && formData.departure) {
    // Check if the input looks like an IATA code (2-3 uppercase letters)
    const possibleCode = formData.departure.trim().toUpperCase();
    if (/^[A-Z]{2,3}$/.test(possibleCode)) {
      departureCode = possibleCode;
    } else {
      // Try to find airport by city name
      const searchTerm = formData.departure.toLowerCase();
      const foundAirport = airports.find(airport => 
        airport.city.toLowerCase() === searchTerm || 
        airport.name.toLowerCase().includes(searchTerm)
      );
      if (foundAirport) {
        departureCode = foundAirport.code;
      } else {
        // Fallback to first word or show error
        departureCode = formData.departure.split(' ')[0].toUpperCase();
      }
    }
  }
  
  // If arrivalCode is empty, try to extract from the input value
  if (!arrivalCode && formData.arrival) {
    const possibleCode = formData.arrival.trim().toUpperCase();
    if (/^[A-Z]{2,3}$/.test(possibleCode)) {
      arrivalCode = possibleCode;
    } else {
      const searchTerm = formData.arrival.toLowerCase();
      const foundAirport = airports.find(airport => 
        airport.city.toLowerCase() === searchTerm || 
        airport.name.toLowerCase().includes(searchTerm)
      );
      if (foundAirport) {
        arrivalCode = foundAirport.code;
      } else {
        arrivalCode = formData.arrival.split(' ')[0].toUpperCase();
      }
    }
  }
  
  // Validate that we have valid codes
  if (!departureCode || departureCode.length < 2) {
    toast.error('Please enter a valid departure airport (e.g., JFK, LOS, LHR)');
    setLoading(false);
    return;
  }
  
  if (!arrivalCode || arrivalCode.length < 2) {
    toast.error('Please enter a valid arrival airport (e.g., JFK, LOS, LHR)');
    setLoading(false);
    return;
  }
  
  const params = new URLSearchParams({
    departure: departureCode,
    arrival: arrivalCode,
    date: formData.date,
    adults: formData.adults.toString(),
    children: formData.children.toString(),
    infants: formData.infants.toString(),
    cabinClass: formData.cabinClass,
  });
  
  if (tripType === 'round_trip' && formData.returnDate) {
    params.append('returnDate', formData.returnDate);
  }
  
  router.push(`/flights/search?${params.toString()}`);
  setLoading(false);
};

  const handleSwap = () => {
    setFormData({
      ...formData,
      departure: formData.arrival,
      departureCode: formData.arrivalCode,
      arrival: formData.departure,
      arrivalCode: formData.departureCode,
    });
  };

  const clearDeparture = () => {
    setFormData({ ...formData, departure: '', departureCode: '' });
    setDepartureSuggestions([]);
    setShowDepartureSuggestions(true);
  };

  const clearArrival = () => {
    setFormData({ ...formData, arrival: '', arrivalCode: '' });
    setArrivalSuggestions([]);
    setShowArrivalSuggestions(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = formData.date || today;

  const getPassengerLabel = () => {
    const parts = [];
    if (formData.adults > 0) parts.push(`${formData.adults} Adult${formData.adults > 1 ? 's' : ''}`);
    if (formData.children > 0) parts.push(`${formData.children} Child${formData.children > 1 ? 'ren' : ''}`);
    if (formData.infants > 0) parts.push(`${formData.infants} Infant${formData.infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const getCabinLabel = () => {
    const option = cabinOptions.find(opt => opt.value === formData.cabinClass);
    return option ? option.label : 'Economy Class';
  };

  return (
    <div className="w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-visible border border-gray-100">
      {/* Trip Type Selector */}
      <div className="flex bg-gray-100/50 p-1 rounded-2xl mx-6 mt-6">
        <button
          type="button"
          onClick={() => setTripType('one_way')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
            tripType === 'one_way'
              ? 'bg-gradient-to-r from-indigo-800 to-indigo-800 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          One Way
        </button>
        <button
          type="button"
          onClick={() => setTripType('round_trip')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            tripType === 'round_trip'
              ? 'bg-gradient-to-r from-indigo-800 to-indigo-800 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Repeat size={18} />
          Round Trip
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8">
        {/* Airport Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Departure */}
          <div className="relative" ref={departureRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <Plane size={20} />
              </div>
              <input
                type="text"
                placeholder="City or airport (e.g., JFK, London)"
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 placeholder-gray-400"
                value={formData.departure}
                onChange={(e) => handleAirportSearch(e.target.value, 'departure')}
                onFocus={() => formData.departure && setShowDepartureSuggestions(true)}
                required
              />
              {formData.departure && (
                <button
                  type="button"
                  onClick={clearDeparture}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {showDepartureSuggestions && (
              <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
                {departureSuggestions.length > 0 ? (
                  departureSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => selectAirport(airport, 'departure')}
                      className="w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-0 cursor-pointer group"
                    >
                      <div className="font-bold text-gray-800 group-hover:text-indigo-600">{airport.code} - {airport.city}</div>
                      <div className="text-sm text-gray-500">{airport.name}, {airport.country}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4 text-gray-500 text-sm">No airports found</div>
                )}
              </div>
            )}
          </div>

          {/* Arrival */}
          <div className="relative" ref={arrivalRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <Plane size={20} className="transform rotate-90" />
              </div>
              <input
                type="text"
                placeholder="City or airport (e.g., LHR, Paris)"
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 placeholder-gray-400"
                value={formData.arrival}
                onChange={(e) => handleAirportSearch(e.target.value, 'arrival')}
                onFocus={() => formData.arrival && setShowArrivalSuggestions(true)}
                required
              />
              {formData.arrival && (
                <button
                  type="button"
                  onClick={clearArrival}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {showArrivalSuggestions && (
              <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
                {arrivalSuggestions.length > 0 ? (
                  arrivalSuggestions.map((airport) => (
                    <button
                      key={airport.code}
                      type="button"
                      onClick={() => selectAirport(airport, 'arrival')}
                      className="w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-0 cursor-pointer group"
                    >
                      <div className="font-bold text-gray-800 group-hover:text-indigo-600">{airport.code} - {airport.city}</div>
                      <div className="text-sm text-gray-500">{airport.name}, {airport.country}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4 text-gray-500 text-sm">No airports found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dates, Passengers, and Cabin Class */}
        {tripType === 'round_trip' ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Departure</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  min={today}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 cursor-pointer"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="relative group animate-fadeIn">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Return</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  min={minReturnDate}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 cursor-pointer"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  required={tripType === 'round_trip'}
                />
              </div>
            </div>

            <div className="relative" ref={passengerRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Travelers</label>
              <button
                type="button"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="w-full flex items-center justify-between px-4 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-500 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-gray-700">{getPassengerLabel()}</span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${showPassengerDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showPassengerDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 animate-slideDown">
                  {/* Passenger dropdown content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><div className="font-semibold text-gray-800">Adults</div><div className="text-xs text-gray-500">Age 12+</div></div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updatePassengerCount('adults', -1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.adults <= 1}>-</button>
                        <span className="font-semibold w-6 text-center">{formData.adults}</span>
                        <button type="button" onClick={() => updatePassengerCount('adults', 1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.adults >= 9}>+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div><div className="font-semibold text-gray-800">Children</div><div className="text-xs text-gray-500">Age 2-11</div></div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updatePassengerCount('children', -1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.children <= 0}>-</button>
                        <span className="font-semibold w-6 text-center">{formData.children}</span>
                        <button type="button" onClick={() => updatePassengerCount('children', 1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.children >= 9}>+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div><div className="font-semibold text-gray-800">Infants</div><div className="text-xs text-gray-500">Under 2</div></div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updatePassengerCount('infants', -1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer" disabled={formData.infants <= 0}>-</button>
                        <span className="font-semibold w-6 text-center">{formData.infants}</span>
                        <button type="button" onClick={() => updatePassengerCount('infants', 1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer" disabled={formData.infants >= formData.adults}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">Total: <span className="font-bold text-gray-900">{totalPassengers}</span> passenger{totalPassengers !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin Class Selection */}
            <div className="relative" ref={cabinRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Armchair size={16} />
                Cabin Class
              </label>
              <button
                type="button"
                onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                className="w-full flex items-center justify-between px-4 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-500 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cabinOptions.find(opt => opt.value === formData.cabinClass)?.icon}</span>
                  <span className="text-gray-700">{getCabinLabel()}</span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${showCabinDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCabinDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                  {cabinOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, cabinClass: option.value });
                        setShowCabinDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all flex items-center gap-3 cursor-pointer ${
                        formData.cabinClass === option.value ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        <div className="text-xs text-gray-500">
                          {option.value === 'Economy'}
                          {option.value === 'Premium_Economy'}
                          {option.value === 'Business'}
                          {option.value === 'First'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Departure</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  min={today}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 cursor-pointer"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="relative" ref={passengerRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Travelers</label>
              <button
                type="button"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="w-full flex items-center justify-between px-4 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-500 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-gray-700">{getPassengerLabel()}</span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${showPassengerDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showPassengerDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl p-5 animate-slideDown">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div><div className="font-semibold text-gray-800">Adults</div><div className="text-xs text-gray-500">Age 12+</div></div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updatePassengerCount('adults', -1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.adults <= 1}>-</button>
                        <span className="font-semibold w-6 text-center">{formData.adults}</span>
                        <button type="button" onClick={() => updatePassengerCount('adults', 1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.adults >= 9}>+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div><div className="font-semibold text-gray-800">Children</div><div className="text-xs text-gray-500">Age 2-11</div></div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updatePassengerCount('children', -1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.children <= 0}>-</button>
                        <span className="font-semibold w-6 text-center">{formData.children}</span>
                        <button type="button" onClick={() => updatePassengerCount('children', 1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer" disabled={formData.children >= 9}>+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div><div className="font-semibold text-gray-800">Infants</div><div className="text-xs text-gray-500">Under 2</div></div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updatePassengerCount('infants', -1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer" disabled={formData.infants <= 0}>-</button>
                        <span className="font-semibold w-6 text-center">{formData.infants}</span>
                        <button type="button" onClick={() => updatePassengerCount('infants', 1)} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-all cursor-pointer" disabled={formData.infants >= formData.adults}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">Total: <span className="font-bold text-gray-900">{totalPassengers}</span> passenger{totalPassengers !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Cabin Class Selection for One Way */}
            <div className="relative" ref={cabinRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Armchair size={16} />
                Cabin Class
              </label>
              <button
                type="button"
                onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                className="w-full flex items-center justify-between px-4 py-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-500 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cabinOptions.find(opt => opt.value === formData.cabinClass)?.icon}</span>
                  <span className="text-gray-700">{getCabinLabel()}</span>
                </div>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${showCabinDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCabinDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                  {cabinOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, cabinClass: option.value });
                        setShowCabinDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all flex items-center gap-3 cursor-pointer ${
                        formData.cabinClass === option.value ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{option.label}</div>
                        <div className="text-xs text-gray-500">
                          {option.value === 'Economy'}
                          {option.value === 'Premium_Economy'}
                          {option.value === 'Business'}
                          {option.value === 'First'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-800 to-indigo-800 text-white py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg cursor-pointer transform hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Searching for flights...
            </>
          ) : (
            <>
              <Search size={20} />
              Search Flights
            </>
          )}
        </button>

        {/* Trust Badge */}
        {/* <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <span className="inline-block w-1 h-1 bg-green-500 rounded-full"></span>
            Secure booking
            <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
            Best price guarantee
            <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
            24/7 support
          </p>
        </div> */}
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
}