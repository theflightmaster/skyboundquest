// app/flights/[id]/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import { Plane, ArrowLeft } from 'lucide-react';
import { format, isValid } from 'date-fns';
import Link from 'next/link';
import Footer from '@/components/Footer';

function FlightDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const flightId = params.id;
  const flightDataParam = searchParams.get('flight');

  // Helper function to safely format dates
  const safeFormatDate = (dateString, formatString, fallback = 'N/A') => {
    if (!dateString) return fallback;
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return fallback;
      return format(date, formatString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return fallback;
    }
  };

  useEffect(() => {
    // Prioritize the flight data passed from FlightCard
    if (flightDataParam) {
      try {
        const parsedFlight = JSON.parse(decodeURIComponent(flightDataParam));
        // console.log('Flight data received from FlightCard:', parsedFlight);
        setFlight(parsedFlight);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing flight data from URL:', error);
        // Only fetch if parsing fails
        fetchFlightDetails();
      }
    } else {
      // Only fetch if no data was passed in URL
      // console.log('No flight data in URL, fetching from API');
      fetchFlightDetails();
    }
  }, [flightId, flightDataParam]);

  const fetchFlightDetails = async () => {
    try {
      const response = await fetch(`/api/flights/${flightId}`);
      const data = await response.json();
      setFlight(data.data);
    } catch (error) {
      console.error('Error fetching flight details:', error);
    } finally {
      setLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-bounce">
            <Plane size={24} className="text-blue-600" />
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-700 font-semibold">Loading flight details...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait while we fetch your flight information</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Flight Not Found</h1>
          <p className="text-gray-500 mb-6">The flight you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Determine the primary flight data (for one-way or round-trip)
  const isRoundTrip = flight.type === 'round_trip';
  const primaryFlight = isRoundTrip ? flight.outbound : flight;
  
  // Use the already formatted data from FlightCard if available
  // Otherwise, format it safely
  const departureTime = flight.departure?.time || 
                        primaryFlight?.departure?.time || 
                        safeFormatDate(primaryFlight?.departure?.scheduled || flight.departure?.scheduled, 'HH:mm', '--:--');
  
  const arrivalTime = flight.arrival?.time || 
                      primaryFlight?.arrival?.time || 
                      safeFormatDate(primaryFlight?.arrival?.scheduled || flight.arrival?.scheduled, 'HH:mm', '--:--');
  
  const departureDate = flight.departure?.date || 
                        primaryFlight?.departure?.date || 
                        safeFormatDate(primaryFlight?.departure?.scheduled || flight.departure?.scheduled || flight.flight_date, 'EEE, MMM dd, yyyy', 'Date not available');
  
  // Get duration
  let durationFormatted = flight.duration || primaryFlight?.duration || 'N/A';
  if (typeof durationFormatted === 'number' || !isNaN(parseInt(durationFormatted))) {
    const durationNum = typeof durationFormatted === 'number' ? durationFormatted : parseInt(durationFormatted);
    if (!isNaN(durationNum)) {
      const hours = Math.floor(durationNum / 60);
      const minutes = durationNum % 60;
      durationFormatted = `${hours}h ${minutes}m`;
    }
  }
  
  // Prepare key details for the booking form
  const keyDetails = {
    duration: durationFormatted,
    baggage: flight.arrival?.baggage || flight.baggage || '1 x 23kg',
    carryon: flight.carryon || '7kg',
    stops: primaryFlight?.stops || flight.stops || 0,
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    departureDate: departureDate,
    flightNumber: flight.flightNumber || primaryFlight?.flight?.iata || flight.flight?.iata || 'N/A',
    airline: flight.airlineName || primaryFlight?.airline?.name || flight.airline?.name || 'Airline',
    departureAirport: flight.departure?.iata || primaryFlight?.departure?.iata || 'N/A',
    arrivalAirport: flight.arrival?.iata || primaryFlight?.arrival?.iata || 'N/A',
    terminal: flight.departure?.terminal || primaryFlight?.departure?.terminal || 'TBD',
    gate: flight.departure?.gate || primaryFlight?.departure?.gate || 'TBD',
    airlineCode: flight.airlineCode || primaryFlight?.airline?.iata,
    departureAirportFull: flight.departure?.airport || primaryFlight?.departure?.airport || '',
    arrivalAirportFull: flight.arrival?.airport || primaryFlight?.arrival?.airport || '',
    cabinClass: flight.cabin_class || primaryFlight?.cabin_class || 'Economy',
    price: flight.price?.amount || primaryFlight?.price?.amount,
  };

  // console.log('Flight details prepared for booking form:', keyDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl mb-24">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Search Results</span>
        </button>

        <BookingForm flight={flight} flightData={flight} keyDetails={keyDetails} />
      </div>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Plane size={32} className="text-blue-600 animate-bounce" />
          </div>
        </div>
      </div>
    }>
      <FlightDetails />
    </Suspense>
  );
}