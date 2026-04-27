// lib/sendEmail.js
import { Resend } from 'resend';
import { generateTicketPDF } from '@/components/generateTicketPDF';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

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
    // console.log('Preparing to send email with data:', {
    //   to,
    //   passengerName,
    //   flightNumber,
    //   airline,
    //   departureAirport,
    //   arrivalAirport,
    //   departureTime,
    //   arrivalTime,
    //   departureDate,
    //   duration,
    //   bookingReference,
    //   amount,
    //   terminal,
    //   gate,
    // });

    // Generate PDF ticket with all fields
    const pdfBytes = await generateTicketPDF({
      reference: bookingReference,
      amount: amount,
      airline: airline,
      flightNumber: flightNumber,
      departureAirport: departureAirport,
      arrivalAirport: arrivalAirport,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      departureDate: departureDate,
      duration: duration,
      passengerName: passengerName,
      terminal: terminal,
      gate: gate,
    });

    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Flight Ticket Confirmation - ${flightNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
              background-color: #f3f4f6;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #ffffff;
              padding: 30px 20px;
              text-align: center;
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              max-width: 180px;
              height: auto;
              margin: 0 auto;
              display: block;
            }
            .content {
              padding: 30px;
            }
            .success-section {
              text-align: center;
              margin-bottom: 30px;
            }
            .success-title {
              color: #059669;
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
            }
            .card {
              background-color: #f9fafb;
              border-radius: 10px;
              padding: 20px;
              margin-bottom: 20px;
              border: 1px solid #e5e7eb;
            }
            .flight-details {
              margin: 20px 0;
              padding: 20px;
              background-color: #f9fafb;
              border-radius: 10px;
              border: 1px solid #e5e7eb;
            }
            .flight-route {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 15px 0;
            }
            .airport {
              text-align: center;
              flex: 1;
            }
            .airport-code {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            .flight-time {
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              margin: 5px 0;
            }
            .flight-date {
              font-size: 12px;
              color: #6b7280;
            }
            .info-row {
              display: flex;
              gap-row: 5px;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .info-label {
              font-size: 13px;
              color: #6b7280;
            }
            .info-value {
              font-size: 13px;
              font-weight: 600;
              color: #1f2937;
            }
            .attachment-notice {
              background-color: #fef3c7;
              border-radius: 10px;
              padding: 15px;
              text-align: center;
              border: 1px solid #fde68a;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f9fafb;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://skyboundquest.com/logo.png" alt="Skyboundquest Logo" class="logo" />
            </div>
            
            <div class="content">
              <div class="success-section">
                <p style="color: #4b5563;">Hi ${passengerName}, your flight has been successfully booked.</p>
              </div>
              
              <div class="card">
                <div class="info-row">
                  <span class="info-label">Booking Reference: </span>
                  <span class="info-value">${bookingReference}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Flight Number: </span>
                  <span class="info-value">${flightNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Airline: </span>
                  <span class="info-value">${airline}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Amount Paid: </span>
                  <span class="info-value">$${amount}</span>
                </div>
              </div>

              <div class="flight-details">
                <div class="flight-route">
                  <div class="airport">
                    <div class="airport-code">${departureAirport.split(' - ')[0] || departureAirport}</div>
                    <div class="flight-time">${departureTime}</div>
                    <div class="flight-date">${departureDate}</div>
                  </div>
                  <div class="arrow" style="font-size: 24px; color: #9ca3af; margin: 0 10px;">→</div>
                  <div class="airport">
                    <div class="airport-code">${arrivalAirport.split(' - ')[0] || arrivalAirport}</div>
                    <div class="flight-time">${arrivalTime}</div>
                    <div class="flight-date">${departureDate}</div>
                  </div>
                </div>
                <hr style="margin: 15px 0;" />
                <div class="info-row">
                  <span class="info-label">Duration: </span>
                  <span class="info-value">${duration}</span>
                </div>
              </div>
              
              <hr />
              
              <div class="attachment-notice">
                <p style="margin: 0; font-size: 14px;">📎 <strong>Your ticket is attached as a PDF file</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">
                  Open the attachment to view your complete ticket details
                </p>
              </div>
              
              <hr />
              
              <div style="text-align: center;">
                <p style="margin: 0 0 5px 0;"><strong>Need Assistance?</strong></p>
                <p style="margin: 0;">
                  Contact us at <a href="mailto:support@skyboundquest.com" style="color: #2563eb; text-decoration: none;">support@skyboundquest.com</a>
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 5px 0;">Thank you for choosing Skyboundquest!</p>
              <p style="margin: 0; font-size: 11px;">© 2025 Skyboundquest. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Skyboundquest <noreply@skyboundquest.com>',
      to: [to],
      subject: `Your Flight Ticket Confirmation - ${flightNumber}`,
      html: emailHtml,
      attachments: [
        {
          filename: `Ticket_${bookingReference}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('Resend email sending error:', error);
      return { success: false, error: error };
    }

    // console.log('Email sent successfully to:', to);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}