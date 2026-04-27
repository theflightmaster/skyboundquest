// components/FlightCard.js
'use client';

import { useRouter } from 'next/navigation';
import { Clock, ArrowRight, Plane, Briefcase, Calendar, Armchair, Repeat, Tag, Building, Luggage } from 'lucide-react';
import { format, isValid } from 'date-fns';

export default function FlightCard({ flight }) {
  const router = useRouter();

  // Helper functions for date formatting - defined once at the top
  const formatTimeSafe = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, 'h:mm a'); // Returns "2:30 PM" instead of "14:30"
  } catch {
    return 'N/A';
  }
};
  
  const formatDateSafe = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };
  
  const formatFullDateSafe = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, 'yyyy-MM-dd');
    } catch {
      return 'N/A';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSelect = () => {
    // Extract ALL flight details properly
    const isRoundTrip = flight.type === 'round_trip';
    const primaryFlight = isRoundTrip ? flight.outbound : flight;
    
    // Get departure and arrival times
    const departureScheduled = primaryFlight?.departure?.scheduled;
    const arrivalScheduled = primaryFlight?.arrival?.scheduled;
    
    // Create a complete flight data object
    const selectedFlight = {
      id: flight.id,
      type: flight.type || 'one_way',
      
      // Flight identification
      flightNumber: primaryFlight?.flight?.iata || flight.flight?.iata || 'N/A',
      airlineName: primaryFlight?.airline?.name || flight.airline?.name || 'Airline',
      airlineCode: primaryFlight?.airline?.iata || flight.airline?.iata,
      
      // Departure details
      departure: {
        iata: primaryFlight?.departure?.iata || flight.departure?.iata || 'N/A',
        airport: primaryFlight?.departure?.airport || flight.departure?.airport || '',
        scheduled: departureScheduled,
        time: formatTimeSafe(departureScheduled),
        date: formatDateSafe(departureScheduled),
        fullDate: formatFullDateSafe(departureScheduled),
        terminal: primaryFlight?.departure?.terminal || flight.departure?.terminal || 'TBD',
        gate: primaryFlight?.departure?.gate || flight.departure?.gate || 'TBD',
      },
      
      // Arrival details
      arrival: {
        iata: primaryFlight?.arrival?.iata || flight.arrival?.iata || 'N/A',
        airport: primaryFlight?.arrival?.airport || flight.arrival?.airport || '',
        scheduled: arrivalScheduled,
        time: formatTimeSafe(arrivalScheduled),
        date: formatDateSafe(arrivalScheduled),
        fullDate: formatFullDateSafe(arrivalScheduled),
      },
      
      // Flight metrics
      duration: primaryFlight?.duration || flight.duration || 'N/A',
      duration_minutes: primaryFlight?.duration_minutes || flight.duration_minutes,
      stops: primaryFlight?.stops || flight.stops || 0,
      cabin_class: primaryFlight?.cabin_class || flight.cabin_class || 'Economy',
      
      // Price
      price: {
        amount: isRoundTrip ? flight.total_price?.amount : flight.price?.amount,
        currency: 'USD',
      },
      
      // For round-trip
      outbound: flight.outbound ? {
        ...flight.outbound,
        departure: {
          ...flight.outbound.departure,
          time: formatTimeSafe(flight.outbound.departure?.scheduled),
          date: formatDateSafe(flight.outbound.departure?.scheduled),
          fullDate: formatFullDateSafe(flight.outbound.departure?.scheduled),
        },
        arrival: {
          ...flight.outbound.arrival,
          time: formatTimeSafe(flight.outbound.arrival?.scheduled),
          date: formatDateSafe(flight.outbound.arrival?.scheduled),
          fullDate: formatFullDateSafe(flight.outbound.arrival?.scheduled),
        },
      } : null,
      
      return: flight.return ? {
        ...flight.return,
        departure: {
          ...flight.return.departure,
          time: formatTimeSafe(flight.return.departure?.scheduled),
          date: formatDateSafe(flight.return.departure?.scheduled),
          fullDate: formatFullDateSafe(flight.return.departure?.scheduled),
        },
        arrival: {
          ...flight.return.arrival,
          time: formatTimeSafe(flight.return.arrival?.scheduled),
          date: formatDateSafe(flight.return.arrival?.scheduled),
          fullDate: formatFullDateSafe(flight.return.arrival?.scheduled),
        },
      } : null,
    };
    
    // Log for debugging
    // console.log('Selected Flight Data:', {
    //   flightNumber: selectedFlight.flightNumber,
    //   departureTime: selectedFlight.departure.time,
    //   departureDate: selectedFlight.departure.date,
    //   arrivalTime: selectedFlight.arrival.time,
    // });
    
    const encoded = encodeURIComponent(JSON.stringify(selectedFlight));
    router.push(`/flights/${flight.id}?flight=${encoded}`);
  };

  // Get cabin class badge styling
  const getCabinBadge = (cabinClass) => {
    const cabin = cabinClass || flight.cabin_class || 'Economy';
    const styles = {
      'Economy': 'bg-green-100 text-green-700 border-green-200',
      'Premium Economy': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Premium_Economy': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Business': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'First': 'bg-amber-100 text-amber-700 border-amber-200',
    };
    const displayName = cabin.replace('_', ' ');
    return {
      className: styles[cabin] || styles['Economy'],
      displayName
    };
  };

  // Round trip display
  if (flight.type === 'round_trip') {
    const outbound = flight.outbound;
    const returnFlight = flight.return;
    const cabinBadge = getCabinBadge(flight.cabin_class);
    
    const outboundDepTime = formatTimeSafe(outbound.departure?.scheduled);
    const outboundArrTime = formatTimeSafe(outbound.arrival?.scheduled);
    const outboundDate = formatDateSafe(outbound.departure?.scheduled);
    
    const returnDepTime = formatTimeSafe(returnFlight?.departure?.scheduled);
    const returnArrTime = formatTimeSafe(returnFlight?.arrival?.scheduled);
    const returnDate = formatDateSafe(returnFlight?.departure?.scheduled);

    return (
      <div className="group bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
        {/* Header with airline and cabin */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-3 md:px-5 py-2 md:py-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Plane size={16} className="text-indigo-600 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm md:text-base">{outbound.airline.name}</p>
                <p className="text-xs text-gray-500">Flight {outbound.flight.iata}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cabinBadge.className}`}>
                <Armchair size={12} />
                <span className="hidden sm:inline">{cabinBadge.displayName}</span>
                <span className="sm:hidden">{cabinBadge.displayName.split(' ')[0]}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <Repeat size={12} />
                <span className="hidden sm:inline">Round Trip</span>
                <span className="sm:hidden">RT</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 md:p-5">
          {/* Outbound Flight */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Outbound</span>
              <span className="text-xs text-gray-400">{outboundDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  {/* Departure */}
                  <div className="text-center flex-1">
                    <p className="text-xl md:text-2xl font-bold text-gray-800">{outboundDepTime}</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-600">{outbound.departure.iata}</p>
                    <p className="hidden md:block text-xs text-gray-400 mt-1">{outbound.departure.airport?.split(',')[0]}</p>
                  </div>
                  
                  {/* Flight Path */}
                  <div className="flex-1 px-2 md:px-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <div className="bg-white px-1 md:px-2">
                          <Plane size={14} className="text-indigo-500 transform rotate-90 md:w-4 md:h-4" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-1 md:mt-2">
                      <p className="text-xs text-gray-500">{formatDuration(outbound.duration)}</p>
                      <p className="text-xs text-gray-400">{outbound.stops === 0 ? 'Direct' : `${outbound.stops} stop`}</p>
                    </div>
                  </div>
                  
                  {/* Arrival */}
                  <div className="text-center flex-1">
                    <p className="text-xl md:text-2xl font-bold text-gray-800">{outboundArrTime}</p>
                    <p className="text-xs md:text-sm font-semibold text-gray-600">{outbound.arrival.iata}</p>
                    <p className="hidden md:block text-xs text-gray-400 mt-1">{outbound.arrival.airport?.split(',')[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return Flight */}
          {returnFlight && (
            <div className="border-t pt-3 md:pt-4">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Return</span>
                <span className="text-xs text-gray-400">{returnDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <p className="text-lg md:text-xl font-bold text-gray-800">{returnDepTime}</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-600">{returnFlight.departure.iata}</p>
                    </div>
                    
                    <div className="flex-1 px-2 md:px-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <div className="bg-white px-1 md:px-2">
                            <Plane size={12} className="text-indigo-500 transform -rotate-90 md:w-3 md:h-3" />
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-1 md:mt-2">
                        <p className="text-xs text-gray-500">{formatDuration(returnFlight.duration)}</p>
                        <p className="text-xs text-gray-400">{returnFlight.stops === 0 ? 'Direct' : `${returnFlight.stops} stop`}</p>
                      </div>
                    </div>
                    
                    <div className="text-center flex-1">
                      <p className="text-lg md:text-xl font-bold text-gray-800">{returnArrTime}</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-600">{returnFlight.arrival.iata}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Price and Action */}
          <div className="border-t mt-3 md:mt-4 pt-3 md:pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-4">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Briefcase size={12} className="md:w-3.5 md:h-3.5" />
                <span className="text-xs">Carry-on</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Luggage size={12} className="md:w-3.5 md:h-3.5" />
                <span className="text-xs">1 bag</span>
              </div>
            </div>
            <div className="text-center sm:text-right">
              {flight.total_price?.amount ? (
                <>
                  <p className="text-xl md:text-2xl font-bold text-indigo-600">
                    ${flight.total_price.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">total for {flight.outbound.airline.name}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Price unavailable</p>
              )}
              <button
                onClick={handleSelect}
                className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                Select Flight
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // One-way display
  const depTime = formatTimeSafe(flight.departure?.scheduled);
  const arrTime = formatTimeSafe(flight.arrival?.scheduled);
  const flightDate = formatDateSafe(flight.departure?.scheduled);
  const cabinBadge = getCabinBadge(flight.cabin_class);

  return (
    <div className="group bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-3 md:px-5 py-2 md:py-3 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Plane size={16} className="text-indigo-600 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm md:text-base">{flight.airline.name}</p>
              <p className="text-xs text-gray-500">Flight {flight.flight.iata}</p>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${cabinBadge.className}`}>
              <Armchair size={12} />
              <span className="hidden sm:inline">{cabinBadge.displayName}</span>
              <span className="sm:hidden">{cabinBadge.displayName.split(' ')[0]}</span>
            </span>
            <span className="text-xs text-gray-400">{flightDate}</span>
          </div>
        </div>
      </div>

      <div className="p-3 md:p-5">
        {/* Flight Route */}
        <div className="flex items-center justify-between">
          {/* Departure */}
          <div className="flex-1 text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{depTime}</p>
            <p className="text-xs md:text-base font-semibold text-gray-600 mt-0.5 md:mt-1">{flight.departure.iata}</p>
            <p className="hidden md:block text-xs text-gray-400 mt-1">{flight.departure.airport?.split(',')[0]}</p>
          </div>
          
          {/* Flight Path */}
          <div className="flex-1 px-2 md:px-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                  <Plane size={14} className="text-indigo-500 md:w-4 md:h-4" />
                </div>
              </div>
            </div>
            <div className="text-center mt-1 md:mt-2">
              <p className="text-xs md:text-sm font-medium text-gray-600">{formatDuration(flight.duration)}</p>
              <p className="text-xs text-gray-400 mt-0.5 md:mt-1">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
            </div>
          </div>
          
          {/* Arrival */}
          <div className="flex-1 text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{arrTime}</p>
            <p className="text-xs md:text-base font-semibold text-gray-600 mt-0.5 md:mt-1">{flight.arrival.iata}</p>
            <p className="hidden md:block text-xs text-gray-400 mt-1">{flight.arrival.airport?.split(',')[0]}</p>
          </div>
        </div>

        {/* Price and Action */}
        <div className="mt-3 pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-4">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Briefcase size={12} className="md:w-3.5 md:h-3.5" />
              <span className="text-xs">Carry-on</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Luggage size={12} className="md:w-3.5 md:h-3.5" />
              <span className="text-xs">1 bag</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            {flight.price?.amount ? (
              <>
                <p className="text-xl md:text-2xl font-bold text-indigo-600">
                  ${flight.price.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">per passenger</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Price unavailable</p>
            )}
            <button
              onClick={handleSelect}
              className="mt-2 bg-gradient-to-r from-indigo-600 to-indigo-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}