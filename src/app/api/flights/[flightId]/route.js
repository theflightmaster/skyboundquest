import { NextResponse } from 'next/server';
import { getFlightByNumber } from '@/lib/flightapi';

export async function GET(request, { params }) {
  const { flightId } = params;

  if (!flightId) {
    return NextResponse.json({ error: 'Flight ID is required' }, { status: 400 });
  }

  // Expect format: AIRLINECODE-FLIGHTNUMBER-YYYY-MM-DD  e.g. "DL-33-2026-04-10"
  const parts = flightId.split('-');
  if (parts.length < 4) {
    return NextResponse.json(
      { error: 'Invalid flight ID format. Use AIRLINECODE-NUMBER-YYYY-MM-DD' },
      { status: 400 }
    );
  }

  const airlineCode = parts[0];
  const flightNumber = parts[1];
  const date = parts.slice(2).join('-'); // YYYY-MM-DD

  try {
    const flight = await getFlightByNumber({ flightNumber, airlineCode, date });

    return NextResponse.json({ success: true, data: flight });
  } catch (error) {
    console.error('Flight detail error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch flight details.' },
      { status: 500 }
    );
  }
}