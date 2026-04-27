// components/generateTicketPDF.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateTicketPDF(bookingData) {
  // Create safe defaults for all required fields
  const safeData = {
    reference: bookingData?.reference || 'N/A',
    amount: bookingData?.amount || '0.00',
    airline: bookingData?.airline || 'Skyboundquest Air',
    flightNumber: bookingData?.flightNumber || 'N/A',
    departureAirport: bookingData?.departureAirport || 'N/A',
    arrivalAirport: bookingData?.arrivalAirport || 'N/A',
    departureTime: bookingData?.departureTime || 'N/A',
    arrivalTime: bookingData?.arrivalTime || 'N/A',
    departureDate: bookingData?.departureDate || new Date().toLocaleDateString(),
    duration: bookingData?.duration || 'N/A',
    passengerName: bookingData?.passengerName || 'Valued Customer',
    terminal: bookingData?.terminal || 'TBD',
    gate: bookingData?.gate || 'TBD',
  };

  // console.log('Generating PDF with safe data:', safeData);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();
  let yPosition = height - 50;
  
  // Try to load and embed the logo image
  let logoImage = null;
  try {
    // Fetch the logo from the public directory
    const logoUrl = 'https://skyboundquest.com/logo.png';
    const response = await fetch(logoUrl);
    if (response.ok) {
      const logoBuffer = await response.arrayBuffer();
      // Try to embed as PNG first, fallback to JPG
      try {
        logoImage = await pdfDoc.embedPng(logoBuffer);
      } catch {
        logoImage = await pdfDoc.embedJpg(logoBuffer);
      }
    }
  } catch (error) {
    console.error('Could not load logo:', error.message);
  }
  
  // Draw Logo if available
  if (logoImage) {
    const logoWidth = 90;
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
    page.drawImage(logoImage, {
      x: 50,
      y: height - logoHeight - 30,
      width: logoWidth,
      height: logoHeight,
    });
    
    // Draw company name next to logo
    page.drawText('', {
      x: 50 + logoWidth + 15,
      y: height - 55,
      size: 20,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  } else {
    // If no logo, just draw the text centered
    page.drawText('SKYBOUNDQUEST', {
      x: 50,
      y: height - 50,
      size: 24,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  }

  // Draw ticket label
  page.drawText('E-TICKET / BOARDING PASS', {
    x: width - 150,
    y: height - 40,
    size: 9,
    font: fontOblique,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Reset yPosition after logo
  yPosition = height - 110;

  // Divider Line
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 1,
    color: rgb(0.2, 0.2, 0.2),
  });

  yPosition -= 25;

  // Booking Reference Section
  page.drawText('BOOKING REFERENCE', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(safeData.reference, {
    x: 50,
    y: yPosition - 15,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 45;

  // Divider
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 30;

  // FLIGHT DETAILS Section
  page.drawText('FLIGHT DETAILS', {
    x: 50,
    y: yPosition,
    size: 11,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 25;

  // Passenger Info Row
  page.drawText('PASSENGER', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(safeData.passengerName, {
    x: 50,
    y: yPosition - 14,
    size: 11,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Flight Info Row
  page.drawText('FLIGHT', {
    x: 250,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(safeData.flightNumber, {
    x: 250,
    y: yPosition - 14,
    size: 11,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Airline Info Row
  page.drawText('AIRLINE', {
    x: 400,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(safeData.airline, {
    x: 400,
    y: yPosition - 14,
    size: 11,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  // Departure Section Box
  page.drawRectangle({
    x: 50,
    y: yPosition - 80,
    width: 240,
    height: 80,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 0.5,
  });

  page.drawText('DEPARTURE', {
    x: 60,
    y: yPosition - 15,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(safeData.departureAirport.split(' - ')[0] || safeData.departureAirport, {
    x: 60,
    y: yPosition - 35,
    size: 22,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(safeData.departureAirport.split(' - ')[1] || '', {
    x: 60,
    y: yPosition - 55,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText(safeData.departureTime, {
    x: 60,
    y: yPosition - 72,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Arrow between departure and arrival
  const arrowX = 300;
  const arrowY = yPosition - 40;
  
  page.drawLine({
    start: { x: arrowX, y: arrowY },
    end: { x: arrowX + 20, y: arrowY },
    thickness: 1.5,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  page.drawLine({
    start: { x: arrowX + 20, y: arrowY },
    end: { x: arrowX + 15, y: arrowY - 3 },
    thickness: 1.5,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  page.drawLine({
    start: { x: arrowX + 20, y: arrowY },
    end: { x: arrowX + 15, y: arrowY + 3 },
    thickness: 1.5,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Arrival Section Box
  page.drawRectangle({
    x: 325,
    y: yPosition - 80,
    width: 240,
    height: 80,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 0.5,
  });

  page.drawText('ARRIVAL', {
    x: 335,
    y: yPosition - 15,
    size: 9,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(safeData.arrivalAirport.split(' - ')[0] || safeData.arrivalAirport, {
    x: 335,
    y: yPosition - 35,
    size: 22,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText(safeData.arrivalAirport.split(' - ')[1] || '', {
    x: 335,
    y: yPosition - 55,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText(safeData.arrivalTime, {
    x: 335,
    y: yPosition - 72,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 95;

  // Flight Details Row
  page.drawText('DATE', {
    x: 50,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(safeData.departureDate, {
    x: 50,
    y: yPosition - 14,
    size: 10,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText('DURATION', {
    x: 200,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.4, 0.4, 0.4),
  });
  page.drawText(safeData.duration, {
    x: 200,
    y: yPosition - 14,
    size: 10,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // page.drawText('TERMINAL', {
  //   x: 350,
  //   y: yPosition,
  //   size: 8,
  //   font: font,
  //   color: rgb(0.4, 0.4, 0.4),
  // });
  // page.drawText(safeData.terminal, {
  //   x: 350,
  //   y: yPosition - 14,
  //   size: 10,
  //   font: fontBold,
  //   color: rgb(0, 0, 0),
  // });

  // page.drawText('GATE', {
  //   x: 480,
  //   y: yPosition,
  //   size: 8,
  //   font: font,
  //   color: rgb(0.4, 0.4, 0.4),
  // });
  // page.drawText(safeData.gate, {
  //   x: 480,
  //   y: yPosition - 14,
  //   size: 10,
  //   font: fontBold,
  //   color: rgb(0, 0, 0),
  // });

  yPosition -= 55;

  // Divider
  page.drawLine({
    start: { x: 50, y: yPosition },
    end: { x: width - 50, y: yPosition },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });

  yPosition -= 25;

  // Important Information Section
  page.drawText('IMPORTANT INFORMATION', {
    x: 50,
    y: yPosition,
    size: 10,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;

  const importantInfo = [
    '• Please arrive at the airport at least 2 hours before departure',
    '• Valid government-issued ID or passport is required for check-in',
    '• Check-in closes 45 minutes before scheduled departure time',
    '• Carry-on baggage allowance: 1 x 7kg (55cm x 35cm x 25cm)',
    '• Checked baggage allowance: 1 x 23kg',
    '• Online check-in available 24 hours before departure',
  ];

  importantInfo.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: 8,
      font: font,
      color: rgb(0.3, 0.3, 0.3),
    });
    yPosition -= 14;
  });

  yPosition -= 25;

  // Barcode placeholder (visual only)
  const barcodeY = yPosition;
  for (let i = 0; i < 30; i++) {
    const barHeight = 20;
    const barWidth = 3;
    const barX = 50 + (i * 8);
    page.drawRectangle({
      x: barX,
      y: barcodeY,
      width: barWidth,
      height: barHeight,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  yPosition -= 35;

  // Footer
  page.drawText(safeData.reference, {
    x: width / 2,
    y: yPosition,
    size: 8,
    font: fontOblique,
    color: rgb(0.5, 0.5, 0.5),
  });

  yPosition -= 15;

  page.drawText('Thank you for choosing Skyboundquest!', {
    x: width / 2,
    y: yPosition,
    size: 9,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  yPosition -= 15;

  page.drawText('For assistance, contact us at support@skyboundquest.com', {
    x: width / 2,
    y: yPosition,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}