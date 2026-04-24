'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import { Plane, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Footer from '@/components/Footer';

function FlightDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  const flightId = params.id;
  const flightDataParam = searchParams.get('flight');

  useEffect(() => {
    if (flightDataParam) {
      try {
        const parsedFlight = JSON.parse(decodeURIComponent(flightDataParam));
        setFlight(parsedFlight);
        setLoading(false);
      } catch (error) {
        fetchFlightDetails();
      }
    } else {
      fetchFlightDetails();
    }
  }, [flightId]);

  const fetchFlightDetails = async () => {
    try {
      const response = await fetch(`/api/flights/${flightId}`);
      const data = await response.json();
      setFlight(data.data);
    } catch (error) {
      // console.error('Error fetching flight details:', error);
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

  // Prepare key details for the booking form
  const keyDetails = {
    duration: `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m`,
    baggage: flight.arrival?.baggage || '1 x 23kg',
    carryon: '7kg',
    stops: flight.stops,
    departureTime: format(new Date(flight.departure?.scheduled), 'HH:mm'),
    arrivalTime: format(new Date(flight.arrival?.scheduled), 'HH:mm'),
    departureDate: format(new Date(flight.flight_date), 'EEE, MMM dd, yyyy'),
  };

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