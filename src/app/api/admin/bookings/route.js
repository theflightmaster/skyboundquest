import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

// GET - Fetch all bookings
export async function GET(request) {
  try {
    await dbConnect();
    
    const bookings = await Booking.find({})
      .sort({ bookingDate: -1 })
      .lean();

    // Transform data for easier display
    const transformedBookings = bookings.map(booking => ({
      ...booking,
      _id: booking._id.toString(),
      flight: {
        ...booking.flight,
        fullFlightNumber: `${booking.flight.airline.iata || ''}${booking.flight.flightNumber}`,
      }
    }));

    return NextResponse.json({
      success: true,
      bookings: transformedBookings,
      count: transformedBookings.length,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
      booking: deletedBooking,
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}