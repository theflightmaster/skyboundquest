// app/api/payment/verify/route.js
import { NextResponse } from 'next/server';
import { sendTicketEmail } from '@/lib/sendEmail';
import Booking from '@/models/Booking';
import dbConnect from '@/lib/mongodb';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.redirect(`${BASE_URL}/payment/cancel?error=missing_reference`);
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.redirect(`${BASE_URL}/payment/cancel?error=payment_failed`);
    }

    // Payment is successful - extract metadata
    const metadata = data.data.metadata;
    let flightData = {}, passengerData = {}, keyDetails = {};

    try {
      flightData = metadata?.flight_data ? JSON.parse(metadata.flight_data) : {};
      passengerData = metadata?.passenger_data ? JSON.parse(metadata.passenger_data) : {};
      keyDetails = metadata?.key_details ? JSON.parse(metadata.key_details) : {};
    } catch (error) {
      console.error('Error parsing metadata:', error);
    }

    // Extract flight number - remove airline code if present
    let rawFlightNumber = keyDetails.flightNumber || flightData?.flightNumber || flightData?.flight?.iata || 'N/A';
    let airlineCode = keyDetails.airlineCode || flightData?.airline?.iata || flightData?.airlineCode || '';
    
    // Clean flight number: remove airline code if it's at the beginning
    let cleanFlightNumber = rawFlightNumber;
    if (airlineCode && rawFlightNumber.startsWith(airlineCode)) {
      cleanFlightNumber = rawFlightNumber.substring(airlineCode.length);
    }
    // Remove any non-numeric characters from flight number (keep only numbers)
    cleanFlightNumber = cleanFlightNumber.replace(/\D/g, '');
    
    // If no numbers found, use the original
    if (!cleanFlightNumber) {
      cleanFlightNumber = rawFlightNumber;
    }
    
    // Construct full flight number for display
    const fullFlightNumber = `${airlineCode}${cleanFlightNumber}`;

    // Prepare booking data for database
    const bookingData = {
      bookingReference: reference,
      transactionId: data.data.id.toString(),
      paymentStatus: 'success',
      amount: flightData?.price?.amount,
      paidAt: new Date(data.data.paid_at),
      passenger: {
        fullName: passengerData.fullName || 'N/A',
        email: data.data.customer.email,
        phone: passengerData.phone || 'N/A',
        passportNumber: passengerData.passportNumber || 'N/A',
        address: passengerData.address || '',
      },
      flight: {
        flightNumber: cleanFlightNumber,
        airline: {
          name: keyDetails.airline || flightData?.airline?.name || flightData?.airlineName || 'Skyboundquest Air',
          iata: airlineCode,
          code: airlineCode,
        },
        departureAirport: {
          iata: keyDetails.departureAirport || flightData?.departure?.iata || 'N/A',
          airport: keyDetails.departureAirportFull || flightData?.departure?.airport || keyDetails.departureAirport || 'N/A',
          city: flightData?.departure?.city || '',
          country: flightData?.departure?.country || '',
        },
        arrivalAirport: {
          iata: keyDetails.arrivalAirport || flightData?.arrival?.iata || 'N/A',
          airport: keyDetails.arrivalAirportFull || flightData?.arrival?.airport || keyDetails.arrivalAirport || 'N/A',
          city: flightData?.arrival?.city || '',
          country: flightData?.arrival?.country || '',
        },
        departureTime: keyDetails.departureTime || flightData?.departure?.time || 'N/A',
        departureTimeRaw: flightData?.departure?.scheduled ? new Date(flightData.departure.scheduled) : null,
        arrivalTime: keyDetails.arrivalTime || flightData?.arrival?.time || 'N/A',
        arrivalTimeRaw: flightData?.arrival?.scheduled ? new Date(flightData.arrival.scheduled) : null,
        departureDate: keyDetails.departureDate || flightData?.departure?.date || 'N/A',
        departureDateRaw: flightData?.departure?.fullDate ? new Date(flightData.departure.fullDate) : 
                         (flightData?.departure?.scheduled ? new Date(flightData.departure.scheduled) : null),
        duration: keyDetails.duration || flightData?.duration || 'N/A',
        durationMinutes: flightData?.duration_minutes || null,
        terminal: keyDetails.terminal || flightData?.departure?.terminal || 'TBD',
        gate: keyDetails.gate || flightData?.departure?.gate || 'TBD',
        stops: flightData?.stops || 0,
        cabinClass: keyDetails.cabinClass || flightData?.cabin_class || 'Economy',
        flightType: flightData?.type || 'one_way',
      },
      flightData: flightData,
      bookingDate: new Date(),
      emailSent: false,
    };

    // Add return flight data if round trip
    if (flightData?.type === 'round_trip' && flightData?.return) {
      let returnRawFlightNumber = flightData.return.flight?.iata || 'N/A';
      let returnCleanFlightNumber = returnRawFlightNumber;
      if (airlineCode && returnRawFlightNumber.startsWith(airlineCode)) {
        returnCleanFlightNumber = returnRawFlightNumber.substring(airlineCode.length);
      }
      returnCleanFlightNumber = returnCleanFlightNumber.replace(/\D/g, '');
      if (!returnCleanFlightNumber) {
        returnCleanFlightNumber = returnRawFlightNumber;
      }
      
      bookingData.returnFlight = {
        flightNumber: returnCleanFlightNumber,
        airline: {
          name: flightData.return.airline?.name || 'N/A',
          iata: airlineCode,
        },
        departureAirport: {
          iata: flightData.return.departure?.iata || 'N/A',
          airport: flightData.return.departure?.airport || 'N/A',
        },
        arrivalAirport: {
          iata: flightData.return.arrival?.iata || 'N/A',
          airport: flightData.return.arrival?.airport || 'N/A',
        },
        departureTime: flightData.return.departure?.time || 'N/A',
        departureTimeRaw: flightData.return.departure?.scheduled ? new Date(flightData.return.departure.scheduled) : null,
        arrivalTime: flightData.return.arrival?.time || 'N/A',
        arrivalTimeRaw: flightData.return.arrival?.scheduled ? new Date(flightData.return.arrival.scheduled) : null,
        departureDate: flightData.return.departure?.date || 'N/A',
        departureDateRaw: flightData.return.departure?.fullDate ? new Date(flightData.return.departure.fullDate) : 
                         (flightData.return.departure?.scheduled ? new Date(flightData.return.departure.scheduled) : null),
        duration: flightData.return.duration || 'N/A',
        durationMinutes: flightData.return.duration_minutes || null,
        terminal: flightData.return.departure?.terminal || 'TBD',
        gate: flightData.return.departure?.gate || 'TBD',
        stops: flightData.return.stops || 0,
      };
    }

    // Save booking to database
    try {
      const booking = new Booking(bookingData);
      await booking.save();
      // console.log('Booking saved successfully:', booking.bookingReference);
    } catch (dbError) {
      console.error('Error saving booking to database:', dbError);
      // Continue with the flow even if DB save fails - we don't want to block the user
    }

    // Send email with ticket
    try {
      const emailData = {
        to: bookingData.passenger.email,
        passengerName: bookingData.passenger.fullName,
        flightNumber: fullFlightNumber,
        airline: bookingData.flight.airline.name,
        departureAirport: `${bookingData.flight.departureAirport.iata} - ${bookingData.flight.departureAirport.airport}`,
        arrivalAirport: `${bookingData.flight.arrivalAirport.iata} - ${bookingData.flight.arrivalAirport.airport}`,
        departureTime: bookingData.flight.departureTime,
        arrivalTime: bookingData.flight.arrivalTime,
        departureDate: bookingData.flight.departureDate,
        duration: bookingData.flight.duration,
        bookingReference: reference,
        amount: bookingData.amount,
        terminal: bookingData.flight.terminal,
        gate: bookingData.flight.gate,
      };

      await sendTicketEmail(emailData);
      
      // Update email sent status in database if booking was saved
      if (bookingData._id) {
        await Booking.updateOne(
          { bookingReference: reference },
          { emailSent: true, emailSentAt: new Date() }
        );
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    // Redirect to success page
    const successUrl = new URL(`${BASE_URL}/payment/success`);
    successUrl.searchParams.set('reference', reference);
    successUrl.searchParams.set('amount', (data.data.amount / 100).toFixed(2));
    
    return NextResponse.redirect(successUrl.toString());
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(`${BASE_URL}/payment/cancel?error=verification_error`);
  }
}