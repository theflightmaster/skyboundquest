import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Currency } from 'lucide-react';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, amount, flightData, passengerData } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: email and amount are required' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `FLIGHT-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Prepare payment data for Paystack - Using Redirect method
    const paymentData = {
      email,
      amount: Math.round(amount * 100), // Convert to kobo/cents (integer)
      // currency: 'USD',
      reference,
      callback_url: `${BASE_URL}/api/payment/verify`,
      metadata: {
        flight_data: flightData,
        passenger_data: passengerData,
        custom_fields: [
          {
            display_name: "Flight Details",
            variable_name: "flight_data",
            value: JSON.stringify(flightData)
          },
          {
            display_name: "Passenger Details",
            variable_name: "passenger_data",
            value: JSON.stringify(passengerData)
          }
        ]
      }
    };

    // Initialize payment with Paystack API from backend (SECURE)
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

    // Return the authorization URL to redirect the user
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