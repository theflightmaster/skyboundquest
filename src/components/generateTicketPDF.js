import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateTicketPDF(bookingData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  
  // Header Background
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width: width,
    height: 120,
    color: rgb(0.2, 0.3, 0.5),
  });

  // Title
  page.drawText('SKYBOUNDQUEST', {
    x: 50,
    y: height - 50,
    size: 24,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('FLIGHT TICKET', {
    x: 50,
    y: height - 80,
    size: 14,
    font: font,
    color: rgb(0.9, 0.9, 0.9),
  });

  // Booking Reference
  page.drawText('BOOKING REFERENCE', {
    x: 50,
    y: height - 160,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.reference, {
    x: 50,
    y: height - 180,
    size: 16,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Amount
  page.drawText('TOTAL AMOUNT', {
    x: 400,
    y: height - 160,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(`$${bookingData.amount}`, {
    x: 400,
    y: height - 180,
    size: 16,
    font: fontBold,
    color: rgb(0, 0.5, 0.2),
  });

  // Divider
  page.drawLine({
    start: { x: 50, y: height - 210 },
    end: { x: width - 50, y: height - 210 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Flight Details
  page.drawText('FLIGHT DETAILS', {
    x: 50,
    y: height - 240,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText('Airline:', {
    x: 50,
    y: height - 270,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.airline, {
    x: 150,
    y: height - 270,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText('Flight Number:', {
    x: 50,
    y: height - 290,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.flightNumber, {
    x: 150,
    y: height - 290,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Route
  page.drawText('DEPARTURE', {
    x: 50,
    y: height - 330,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.departureAirport, {
    x: 50,
    y: height - 350,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText(bookingData.departureTime, {
    x: 50,
    y: height - 375,
    size: 12,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  page.drawText('→', {
    x: 250,
    y: height - 350,
    size: 20,
    font: fontBold,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText('ARRIVAL', {
    x: 350,
    y: height - 330,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.arrivalAirport, {
    x: 350,
    y: height - 350,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  page.drawText(bookingData.arrivalTime, {
    x: 350,
    y: height - 375,
    size: 12,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Duration
  page.drawText('Duration:', {
    x: 50,
    y: height - 410,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.duration, {
    x: 120,
    y: height - 410,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Passenger Details
  page.drawText('PASSENGER DETAILS', {
    x: 50,
    y: height - 460,
    size: 14,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  page.drawText('Name:', {
    x: 50,
    y: height - 490,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  page.drawText(bookingData.passengerName, {
    x: 120,
    y: height - 490,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  // Footer
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const currentPage = pdfDoc.getPage(i);
    currentPage.drawText('Thank you for choosing Skyboundquest!', {
      x: 50,
      y: 50,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}