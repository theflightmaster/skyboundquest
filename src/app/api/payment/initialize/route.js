import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper function to generate unique alphanumeric reference
async function generateUniqueReference() {
  await dbConnect(); // Ensure database connection
  
  let isUnique = false;
  let reference = '';
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    attempts++;
    
    // Generate 6 character alphanumeric string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    reference = result;
    
    // Check if reference exists in database
    const existingBooking = await Booking.findOne({ bookingReference: reference }).select('_id');
    if (!existingBooking) {
      isUnique = true;
    }
  }
  
  if (!isUnique) {
    // Fallback: Use timestamp-based reference
    const timestamp = Date.now().toString(36).toUpperCase();
    reference = timestamp.substring(0, 6);
    while (reference.length < 6) {
      reference = '0' + reference;
    }
  }
  
  return reference;
}

export async function POST(request) {
  try {
    // Connect to database first
    await dbConnect();
    
    const body = await request.json();
    const { email, amount, passengerData, flightData, keyDetails } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: email and amount are required' },
        { status: 400 }
      );
    }

    // Generate unique 6-character alphanumeric reference
    const reference = await generateUniqueReference();

    // Ensure keyDetails has all required fields
    const enrichedKeyDetails = {
      flightNumber: keyDetails?.flightNumber || flightData?.flightNumber || 'N/A',
      airline: keyDetails?.airline || flightData?.airline?.name || 'N/A',
      airlineCode: keyDetails?.airlineCode || flightData?.airline?.iata,
      departureAirport: keyDetails?.departureAirport || flightData?.departure?.iata || 'N/A',
      arrivalAirport: keyDetails?.arrivalAirport || flightData?.arrival?.iata || 'N/A',
      departureTime: keyDetails?.departureTime || flightData?.departure?.time || 'N/A',
      arrivalTime: keyDetails?.arrivalTime || flightData?.arrival?.time || 'N/A',
      departureDate: keyDetails?.departureDate || flightData?.departure?.date || 'N/A',
      duration: keyDetails?.duration || flightData?.duration || 'N/A',
      terminal: keyDetails?.terminal || flightData?.departure?.terminal || 'TBD',
      gate: keyDetails?.gate || flightData?.departure?.gate || 'TBD',
      cabinClass: keyDetails?.cabinClass || flightData?.cabin_class || 'Economy',
      departureAirportFull: keyDetails?.departureAirportFull || flightData?.departure?.airport || '',
      arrivalAirportFull: keyDetails?.arrivalAirportFull || flightData?.arrival?.airport || '',
    };

    const paymentData = {
      email,
      amount: Math.round(20000 * 100),
      reference,
      callback_url: `${BASE_URL}/api/payment/verify`,
      metadata: {
        flight_data: JSON.stringify(flightData),
        passenger_data: JSON.stringify(passengerData),
        key_details: JSON.stringify(enrichedKeyDetails),
        custom_fields: [
          {
            display_name: "Passenger Name",
            variable_name: "passenger_name",
            value: passengerData.fullName
          },
          {
            display_name: "Flight Number",
            variable_name: "flight_number",
            value: enrichedKeyDetails.flightNumber
          },
          {
            display_name: "Airline",
            variable_name: "airline",
            value: enrichedKeyDetails.airline
          },
          {
            display_name: "Departure Airport",
            variable_name: "departure_airport",
            value: enrichedKeyDetails.departureAirport
          },
          {
            display_name: "Arrival Airport",
            variable_name: "arrival_airport",
            value: enrichedKeyDetails.arrivalAirport
          },
          {
            display_name: "Departure Date",
            variable_name: "departure_date",
            value: enrichedKeyDetails.departureDate
          },
          {
            display_name: "Departure Time",
            variable_name: "departure_time",
            value: enrichedKeyDetails.departureTime
          },
          {
            display_name: "Arrival Time",
            variable_name: "arrival_time",
            value: enrichedKeyDetails.arrivalTime
          },
          {
            display_name: "Duration",
            variable_name: "duration",
            value: enrichedKeyDetails.duration
          },
          {
            display_name: "Terminal",
            variable_name: "terminal",
            value: enrichedKeyDetails.terminal
          },
          {
            display_name: "Gate",
            variable_name: "gate",
            value: enrichedKeyDetails.gate
          }
        ]
      }
    };

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Paystack initialization error:', data.message);
      return NextResponse.json(
        { error: data.message || 'Payment initialization failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    );
  }
}