// In /app/api/payment/initialize/route.js

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, amount, flightData, passengerData, keyDetails } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: email and amount are required' },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `FLIGHT-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Prepare complete booking data - ensure all data is properly stringified
    const completeBookingData = {
      flight: flightData,
      passenger: passengerData,
      details: keyDetails,
      bookingDate: new Date().toISOString(),
    };

    // Prepare payment data for Paystack
    const paymentData = {
      email,
      // amount: Math.round(amount * 100),
      amount: 20000 * 100,
      reference,
      callback_url: `${BASE_URL}/api/payment/verify`,
      metadata: {
        // Store as strings to avoid any serialization issues
        booking_data: JSON.stringify(completeBookingData),
        flight_data: JSON.stringify(flightData),
        passenger_data: JSON.stringify(passengerData),
        key_details: JSON.stringify(keyDetails),
        custom_fields: [
          {
            display_name: "Passenger Name",
            variable_name: "passenger_name",
            value: passengerData.fullName
          },
          {
            display_name: "Flight Number",
            variable_name: "flight_number",
            value: flightData?.flight?.iata || flightData?.outbound?.flight?.iata || 'N/A'
          },
          {
            display_name: "Airline",
            variable_name: "airline",
            value: flightData?.airline?.name || flightData?.outbound?.airline?.name || 'N/A'
          },
          {
            display_name: "Departure Date",
            variable_name: "departure_date",
            value: keyDetails?.departureDate || flightData?.flight_date || flightData?.outbound?.flight_date || 'N/A'
          },
          {
            display_name: "Departure Time",
            variable_name: "departure_time",
            value: keyDetails?.departureTime || 'N/A'
          },
          {
            display_name: "Arrival Time",
            variable_name: "arrival_time",
            value: keyDetails?.arrivalTime || 'N/A'
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
      // console.error('Paystack initialization error:', data.message);
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
    // console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment. Please try again.' },
      { status: 500 }
    );
  }
}