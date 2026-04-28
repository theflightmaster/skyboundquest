import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bookingReference = searchParams.get('bookingReference');

  if (!bookingReference) {
    return NextResponse.json(
      { error: 'Booking reference is required' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Find booking by reference
    const booking = await Booking.findOne({ bookingReference: bookingReference.toUpperCase() });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found. Please check your booking reference.' },
        { status: 404 }
      );
    }

    // Format the tracking data from the database
    const trackingData = {
      flight: {
        flightNumber: booking.flight.flightNumber,
        fullFlightNumber: `${booking.flight.airline.iata || ''}${booking.flight.flightNumber}`,
        airline: {
          name: booking.flight.airline.name,
          iata: booking.flight.airline.iata,
        },
        departure: {
          airport: booking.flight.departureAirport.airport,
          iata: booking.flight.departureAirport.iata,
          city: booking.flight.departureAirport.city,
          country: booking.flight.departureAirport.country,
          time: booking.flight.departureTime,
          date: booking.flight.departureDate,
          terminal: booking.flight.terminal,
          gate: booking.flight.gate,
        },
        arrival: {
          airport: booking.flight.arrivalAirport.airport,
          iata: booking.flight.arrivalAirport.iata,
          city: booking.flight.arrivalAirport.city,
          country: booking.flight.arrivalAirport.country,
          time: booking.flight.arrivalTime,
          date: booking.flight.departureDate, // Same date for arrival
        },
        duration: booking.flight.duration,
        cabinClass: booking.flight.cabinClass,
        flightType: booking.flight.flightType,
        stops: booking.flight.stops,
      },
      passenger: {
        fullName: booking.passenger.fullName,
        email: booking.passenger.email,
        phone: booking.passenger.phone,
      },
      booking: {
        reference: booking.bookingReference,
        amount: booking.amount,
        bookingDate: booking.bookingDate,
        paidAt: booking.paidAt,
      },
      transactionId: booking.transactionId,
    };

    // Add return flight if exists
    if (booking.returnFlight && booking.returnFlight.flightNumber) {
      trackingData.returnFlight = {
        flightNumber: booking.returnFlight.flightNumber,
        fullFlightNumber: `${booking.returnFlight.airline.iata || ''}${booking.returnFlight.flightNumber}`,
        airline: {
          name: booking.returnFlight.airline.name,
          iata: booking.returnFlight.airline.iata,
        },
        departure: {
          airport: booking.returnFlight.departureAirport.airport,
          iata: booking.returnFlight.departureAirport.iata,
          time: booking.returnFlight.departureTime,
          date: booking.returnFlight.departureDate,
          terminal: booking.returnFlight.terminal,
          gate: booking.returnFlight.gate,
        },
        arrival: {
          airport: booking.returnFlight.arrivalAirport.airport,
          iata: booking.returnFlight.arrivalAirport.iata,
          time: booking.returnFlight.arrivalTime,
          date: booking.returnFlight.departureDate,
        },
        duration: booking.returnFlight.duration,
        stops: booking.returnFlight.stops,
      };
    }

    return NextResponse.json({ 
      success: true, 
      data: trackingData 
    });
  } catch (error) {
    console.error('Flight tracking error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch flight information. Please try again.' },
      { status: 500 }
    );
  }
}