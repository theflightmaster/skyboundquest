import { NextResponse } from 'next/server';
import { getFlightByNumber } from '@/lib/flightapi';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flightNumber');
  const airlineCode = searchParams.get('airlineCode');
  const date = searchParams.get('date');

  if (!flightNumber || !airlineCode || !date) {
    return NextResponse.json(
      { error: 'Flight number, airline code, and date are required' },
      { status: 400 }
    );
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    );
  }

  try {
    const flight = await getFlightByNumber({ 
      flightNumber, 
      airlineCode: airlineCode.toUpperCase(), 
      date 
    });

    if (!flight) {
      return NextResponse.json(
        { error: 'Flight not found. Please check the flight number and date.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: flight 
    });
  } catch (error) {
    console.error('Flight tracking error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch flight information. Please try again.' },
      { status: 500 }
    );
  }
}