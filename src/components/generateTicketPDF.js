import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateTicketPDF(bookingData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  let yPosition = height - 40;
  
  // Try to load and embed the logo image using fetch
  let logoImage = null;
  try {
    // Get the base URL from environment or use a default
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/logo.png`);
    const logoBuffer = await response.arrayBuffer();
    logoImage = await pdfDoc.embedPng(logoBuffer);
  } catch (error) {
    // console.error('Could not load logo.png:', error.message); 
    // Continue without logo
  }
  
  // Draw Logo if available
  if (logoImage) {
    const logoWidth = 70;
    const logoHeight = 70;
    page.drawImage(logoImage, {
      x: 50,
      y: height - 95,
      width: logoWidth,
      height: logoHeight,
    });
    
  } else {
    // If no logo, just draw the text
    page.drawText('SKYBOUNDQUEST', {
      x: 50,
      y: height - 50,
      size: 24,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  }

  // Booking Reference
  page.drawText('BOOKING REFERENCE', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.reference, {
    x: 50,
    y: yPosition - 20,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  // Divider
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 30;

  // FLIGHT DETAILS Section
  page.drawText('FLIGHT DETAILS', {
    x: 50,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 30;

  // Airline
  page.drawText('Airline:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.airline, {
    x: 150,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;

  // Flight Number
  page.drawText('Flight Number:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.flightNumber, {
    x: 150,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;

  // Passenger Name
  page.drawText('Passenger:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.passengerName, {
    x: 150,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Departure Section
  page.drawText('DEPARTURE', {
    x: 50,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0.2, 0.3, 0.5),
  });

  yPosition -= 20;

  page.drawText('Airport:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.departureAirport, {
    x: 120,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 18;

  page.drawText('Date:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.departureDate, {
    x: 120,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 18;

  page.drawText('Time:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.departureTime, {
    x: 120,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Flight Path Arrow - ASCII character to avoid encoding issues
  page.drawText('▼', {
    x: 80,
    y: yPosition,
    size: 16,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  yPosition -= 30;

  // Arrival Section
  page.drawText('ARRIVAL', {
    x: 50,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0.2, 0.5, 0.2),
  });

  yPosition -= 20;

  page.drawText('Airport:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.arrivalAirport, {
    x: 120,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 18;

  page.drawText('Time:', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.arrivalTime, {
    x: 120,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 40;

  // Duration
  page.drawText('FLIGHT DURATION', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.duration, {
    x: 50,
    y: yPosition - 18,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 60;

  // Divider
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 30;

  // Important Information
  page.drawText('IMPORTANT INFORMATION', {
    x: 50,
    y: yPosition,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;

  const importantInfo = [
    '• Please arrive at the airport at least 2 hours before departure',
    '• Valid government-issued ID is required for check-in',
    '• Check-in closes 45 minutes before departure',
    '• Carry-on baggage: 1 x 7kg',
    '• Checked baggage: 1 x 23kg',
  ];

  importantInfo.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 15;
  });

  yPosition -= 20;

  // Footer
  page.drawText('Thank you for choosing Skyboundquest!', {
    x: 50,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  yPosition -= 15;

  page.drawText('For assistance, contact us at support@skyboundquest.com', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.6, 0.6, 0.6),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}