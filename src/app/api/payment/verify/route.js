import { NextResponse } from 'next/server';
import { sendTicketEmail } from '@/lib/sendEmail';
import { generateTicketPDF } from '@/components/generateTicketPDF';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    const paymentRef = reference || trxref;

    if (!paymentRef) {
      return NextResponse.redirect(
        `${BASE_URL}/payment/cancel?error=missing_reference`
      );
    }

    // Verify payment with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${paymentRef}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.status) {
      console.error('Paystack verification error:', data.message);
      return NextResponse.redirect(
        `${BASE_URL}/payment/cancel?error=verification_failed`
      );
    }

    if (data.data.status === 'success') {
      // Extract booking data from metadata
      const metadata = data.data.metadata;
      const flightData = metadata?.flight_data || {};
      const passengerData = metadata?.passenger_data || {};
      
      const bookingData = {
        reference: paymentRef,
        amount: data.data.amount / 100,
        status: 'confirmed',
        paymentStatus: 'success',
        customerEmail: data.data.customer.email,
        customerName: passengerData.fullName,
        paidAt: data.data.paid_at,
        flightData: flightData,
        passengerData: passengerData,
        transactionId: data.data.id,
      };

      // Prepare email data
      const emailData = {
        to: bookingData.customerEmail,
        passengerName: bookingData.passengerName,
        flightNumber: flightData.flight?.iata || 'N/A',
        airline: flightData.airline?.name || 'N/A',
        departureAirport: flightData.departure?.iata || 'N/A',
        arrivalAirport: flightData.arrival?.iata || 'N/A',
        departureTime: flightData.departure?.scheduled 
          ? new Date(flightData.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'N/A',
        arrivalTime: flightData.arrival?.scheduled
          ? new Date(flightData.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'N/A',
        departureDate: flightData.flight_date || 'N/A',
        duration: flightData.duration 
          ? `${Math.floor(flightData.duration / 60)}h ${flightData.duration % 60}m`
          : 'N/A',
        bookingReference: paymentRef,
        amount: bookingData.amount,
        terminal: flightData.departure?.terminal || 'TBD',
        gate: flightData.departure?.gate || 'TBD',
      };

      // Send email notification with ticket
      const emailResult = await sendTicketEmail(emailData);
      
      if (emailResult.success) {
        console.log('Email sent successfully to:', bookingData.customerEmail);
      } else {
        console.error('Failed to send email:', emailResult.error);
      }

      // Optionally generate and attach PDF (if you want to add PDF attachment)
      // const pdfBytes = await generateTicketPDF({
      //   reference: paymentRef,
      //   amount: bookingData.amount,
      //   airline: flightData.airline?.name,
      //   flightNumber: flightData.flight?.iata,
      //   departureAirport: flightData.departure?.iata,
      //   arrivalAirport: flightData.arrival?.iata,
      //   departureTime: emailData.departureTime,
      //   arrivalTime: emailData.arrivalTime,
      //   duration: emailData.duration,
      //   passengerName: bookingData.passengerName,
      // });

      // Redirect to success page
      const successUrl = new URL(`${BASE_URL}/payment/success`);
      successUrl.searchParams.set('reference', paymentRef);
      successUrl.searchParams.set('amount', bookingData.amount);
      
      return NextResponse.redirect(successUrl.toString());
    } else {
      return NextResponse.redirect(
        `${BASE_URL}/payment/cancel?error=payment_failed`
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(
      `${BASE_URL}/payment/cancel?error=verification_error`
    );
  }
}