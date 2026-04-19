import { Resend } from 'resend';
import TicketEmail from '@/emails/TicketEmail';
import { generateTicketPDF } from '@/components/generateTicketPDF';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendTicketEmail({
  to,
  passengerName,
  flightNumber,
  airline,
  departureAirport,
  arrivalAirport,
  departureTime,
  arrivalTime,
  departureDate,
  duration,
  bookingReference,
  amount,
  terminal,
  gate,
}) {
  try {
    // Generate PDF ticket
    const pdfBytes = await generateTicketPDF({
      reference: bookingReference,
      amount: amount,
      airline: airline,
      flightNumber: flightNumber,
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      duration: duration,
      passengerName: passengerName,
    });

    // Convert PDF to base64 for attachment
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    const { data, error } = await resend.emails.send({
      from: 'Skyboundquest <noreply@skyboundquest.com>',
      to: [to],
      subject: `Your Flight Ticket Confirmation - ${flightNumber}`,
      react: TicketEmail({
        passengerName,
        flightNumber,
        airline,
        departureAirport,
        arrivalAirport,
        departureTime,
        arrivalTime,
        departureDate,
        duration,
        bookingReference,
        amount,
        terminal,
        gate,
        baseUrl: BASE_URL,
      }),
      attachments: [
        {
          filename: `Ticket_${bookingReference}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}