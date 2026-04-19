'use client';

import { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, Search, AlertCircle, MapPin, Building } from 'lucide-react';
import { searchAirlines } from '@/lib/airlines';

export default function FlightTrackingForm({ onTrack, loading, error }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [airlineCode, setAirlineCode] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [airlineSuggestions, setAirlineSuggestions] = useState([]);
  const [showAirlineSuggestions, setShowAirlineSuggestions] = useState(false);
  const airlineRef = useRef(null);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (airlineRef.current && !airlineRef.current.contains(event.target)) {
        setShowAirlineSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAirlineSearch = (value) => {
    const suggestions = searchAirlines(value);
    setAirlineSuggestions(suggestions);
    setShowAirlineSuggestions(true);
    setAirline(value);
    setAirlineCode('');
  };

  const selectAirline = (selectedAirline) => {
    setAirline(`${selectedAirline.code} - ${selectedAirline.name}`);
    setAirlineCode(selectedAirline.code);
    setShowAirlineSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!airlineCode || !flightNumber || !flightDate) {
      return;
    }

    // Send 3 separate payloads: airlineCode, flightNumber, flightDate
    onTrack(airlineCode, flightNumber, flightDate);
  };

  return (
    <div className="w-full bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Airline Selection */}
        <div className="relative" ref={airlineRef}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Airline
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <Building size={20} />
            </div>
            <input
              type="text"
              placeholder="Search airline by name or code (e.g., Delta, DL)"
              value={airline}
              onChange={(e) => handleAirlineSearch(e.target.value)}
              onFocus={() => airline && setShowAirlineSuggestions(true)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 placeholder-gray-400"
              required
            />
          </div>
          {showAirlineSuggestions && airlineSuggestions.length > 0 && (
            <div className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
              {airlineSuggestions.map((airlineItem) => (
                <button
                  key={airlineItem.code}
                  type="button"
                  onClick={() => selectAirline(airlineItem)}
                  className="w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 transition-all duration-200 border-b border-gray-100 last:border-0 cursor-pointer group"
                >
                  <div className="font-bold text-gray-800 group-hover:text-indigo-600">{airlineItem.code} - {airlineItem.name}</div>
                  <div className="text-sm text-gray-500">{airlineItem.country}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Flight Number */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Flight Number
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <Plane size={20} />
            </div>
            <input
              type="text"
              placeholder="e.g., 33, 123, 456"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 placeholder-gray-400"
              required
            />
          </div>
        </div>

        {/* Flight Date */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Flight Date
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
              <Calendar size={20} />
            </div>
            <input
              type="date"
              max={today}
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-gray-800 cursor-pointer"
              required
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Select the departure date of the flight</p>
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
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-800 to-indigo-800 text-white py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg cursor-pointer transform hover:scale-[1.02]"
        >
          {loading ? (
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