import { NextResponse } from 'next/server';
import { searchFlightsByCabin } from '@/lib/flightapi';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const departure = searchParams.get('departure');
  const arrival = searchParams.get('arrival');
  const date = searchParams.get('date');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const infants = searchParams.get('infants') || '0';
  const cabinClass = searchParams.get('cabinClass') || 'Economy';

  if (!departure || !arrival || !date) {
    return NextResponse.json(
      { error: 'departure, arrival, and date are required' },
      { status: 400 }
    );
  }

  try {
    const flights = await searchFlightsByCabin({
      departure_iata: departure.toUpperCase(),
      arrival_iata: arrival.toUpperCase(),
      flight_date: date,
      return_date: returnDate || null,
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants),
      cabin_class: cabinClass,
      currency: 'USD',
    });

    return NextResponse.json({ 
      success: true, 
      data: flights,
      tripType: returnDate ? 'round_trip' : 'one_way',
      cabinClass: cabinClass,
      passengers: {
        adults: parseInt(adults),
        children: parseInt(children),
        infants: parseInt(infants),
        total: parseInt(adults) + parseInt(children) + parseInt(infants)
      }
    });
  } catch (error) {
    console.error('Flight search error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch flights. Please try again.' },
      { status: 500 }
    );
  }
}