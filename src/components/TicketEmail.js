import { Resend } from 'resend';
// Remove this: import TicketEmail from '@/components/TicketEmail';
import { generateTicketPDF } from '@/components/generateTicketPDF';

const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Check if Resend API key is configured
const isResendConfigured = RESEND_API_KEY && RESEND_API_KEY.startsWith('re_');

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
  console.log('=== SEND TICKET EMAIL FUNCTION CALLED ===');
  
  // Validate required fields
  if (!to) {
    console.error('❌ Missing recipient email');
    return { success: false, error: 'Missing recipient email' };
  }

  if (!isResendConfigured) {
    console.error('❌ Resend API key is not configured or invalid');
    return { success: false, error: 'Resend API key not configured' };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    
    console.log('Generating PDF ticket for:', bookingReference);
    
    const pdfBytes = await generateTicketPDF({
      reference: bookingReference,
      amount: amount,
      airline: airline || 'Skyboundquest Air',
      flightNumber: flightNumber || 'N/A',
      departureAirport: departureAirport || 'N/A',
      arrivalAirport: arrivalAirport || 'N/A',
      departureTime: departureTime || 'N/A',
      arrivalTime: arrivalTime || 'N/A',
      departureDate: departureDate || 'N/A',
      duration: duration || 'N/A',
      passengerName: passengerName || 'Valued Customer',
      terminal: terminal || 'TBD',
      gate: gate || 'TBD',
    });

    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    
    console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes');

    // Create HTML email content instead of using React component
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Flight Ticket Confirmation - ${flightNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
              background-color: #f6f9fc;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #1e3a5f;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .success-section {
              text-align: center;
              margin-bottom: 30px;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .success-title {
              color: #059669;
              font-size: 24px;
              font-weight: bold;
              margin: 10px 0;
            }
            .booking-info {
              background-color: #f0f9ff;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              text-align: center;
            }
            .label {
              font-size: 12px;
              color: #6b7280;
              margin: 0 0 5px 0;
            }
            .value {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              margin: 0 0 15px 0;
            }
            .flight-details {
              margin: 20px 0;
              padding: 15px;
              background-color: #f0fdf4;
              border-radius: 8px;
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
            .arrow {
              font-size: 20px;
              color: #6b7280;
            }
            hr {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background-color: #f9fafb;
              font-size: 12px;
              color: #6b7280;
            }
            .button {
              display: inline-block;
              background-color: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Skyboundquest Airlines</h1>
              <p style="color: #e5e7eb; margin-top: 5px;">Flight Ticket Confirmation</p>
            </div>
            
            <div class="content">
              <div class="success-section">
                <div class="success-icon">✅</div>
                <h2 class="success-title">Booking Confirmed!</h2>
                <p>Hi ${passengerName}, your flight has been successfully booked.</p>
              </div>
              
              <div class="booking-info">
                <p class="label">Booking Reference</p>
                <p class="value">${bookingReference}</p>
                <p class="label">Flight Number</p>
                <p class="value">${flightNumber}</p>
                <p class="label">Airline</p>
                <p class="value">${airline}</p>
              </div>
              
              <div class="flight-details">
                <h3 style="margin: 0 0 20px 0; text-align: center;">Flight Details</h3>
                
                <div class="flight-route">
                  <div class="airport">
                    <div style="font-size: 20px; font-weight: bold;">${departureTime}</div>
                    <div style="font-size: 14px; font-weight: 600;">${departureAirport}</div>
                  </div>
                  <div class="arrow">→</div>
                  <div class="airport">
                    <div style="font-size: 20px; font-weight: bold;">${arrivalTime}</div>
                    <div style="font-size: 14px; font-weight: 600;">${arrivalAirport}</div>
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px;">
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${departureDate}</p>
                  <p style="margin: 5px 0;"><strong>Duration:</strong> ${duration}</p>
                  <p style="margin: 5px 0;"><strong>Terminal:</strong> ${terminal} | <strong>Gate:</strong> ${gate}</p>
                </div>
              </div>
              
              <hr />
              
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 15px; text-align: center;">
                <p style="margin: 0;">📎 <strong>Your ticket is attached as a PDF file</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">
                  Open the attachment to view your complete ticket details
                </p>
              </div>
              
              <hr />
              
              <div style="text-align: center;">
                <p><strong>Need Assistance?</strong></p>
                <p>Contact us at <a href="mailto:support@skyboundquest.com" style="color: #2563eb;">support@skyboundquest.com</a></p>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Skyboundquest!</p>
              <p>© 2025 Skyboundquest. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Sending email via Resend...');
    
    const { data, error } = await resend.emails.send({
      from: 'Skyboundquest <noreply@skyboundquest.com>',
      to: [to],
      subject: `Your Flight Ticket Confirmation - ${flightNumber}`,
      html: emailHtml, // Use HTML instead of React component
      attachments: [
        {
          filename: `Ticket_${bookingReference}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('❌ Resend email sending error:', error);
      return { success: false, error: error };
    }

    console.log('✅✅✅ Email sent successfully to:', to);
    console.log('Email ID:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    console.error('Error stack:', error.stack);
    return { success: false, error: error.message };
  }
}