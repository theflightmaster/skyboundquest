import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

export default function TicketEmail({
  passengerName = 'John Doe',
  flightNumber = 'DL33',
  airline = 'Delta Airlines',
  departureAirport = 'JFK',
  arrivalAirport = 'LAX',
  departureTime = '10:30 AM',
  arrivalTime = '1:45 PM',
  departureDate = 'April 20, 2024',
  duration = '6h 15m',
  seatNumber = 'TBD',
  bookingReference = 'FLIGHT-123456',
  amount = '299',
  terminal = 'Terminal 4',
  gate = 'B12',
  baseUrl = 'https://yourdomain.com',
}) {
  const logoUrl = `${baseUrl}/logo.png`;

  return (
    <Html>
      <Head />
      <Preview>Your Flight Ticket Confirmation - {flightNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoUrl}
              alt="Skyboundquest Logo"
              width="180"
              height="60"
              style={logo}
            />
            <Text style={headerSubtitle}>Flight Ticket Confirmation</Text>
          </Section>

          <Section style={content}>
            {/* Success Message */}
            <Section style={successSection}>
              <Text style={successIcon}>✅</Text>
              <Heading style={successTitle}>Payment Successful!</Heading>
              <Text style={successText}>
                Your booking has been confirmed. Please find your ticket details below.
              </Text>
            </Section>

            <Hr style={hr} />

            {/* PDF Download Notice */}
            <Section style={downloadSection}>
              <Text style={downloadText}>📎 Your ticket is attached as a PDF file to this email.</Text>
              <Text style={downloadTextSmall}>
                You can also download it from your booking dashboard.
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Booking Reference */}
            <Section style={infoSection}>
              <Row>
                <Column align="center">
                  <Text style={label}>Booking Reference</Text>
                  <Text style={value}>{bookingReference}</Text>
                </Column>
                <Column align="center">
                  <Text style={label}>Total Amount Paid</Text>
                  <Text style={value}>${amount}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Flight Details */}
            <Heading style={sectionTitle}>Flight Details</Heading>
            <Section style={flightSection}>
              <Row>
                <Column style={flightColumn}>
                  <Text style={airlineName}>{airline}</Text>
                  <Text style={flightInfo}>Flight {flightNumber}</Text>
                </Column>
              </Row>

              <Row style={routeRow}>
                <Column align="center" style={airportColumn}>
                  <Text style={airportCode}>{departureAirport}</Text>
                  <Text style={airportTime}>{departureTime}</Text>
                  <Text style={airportDate}>{departureDate}</Text>
                </Column>
                <Column align="center" style={flightPathColumn}>
                  <Text style={duration}>{duration}</Text>
                  <Text style={planeIcon}>✈️</Text>
                </Column>
                <Column align="center" style={airportColumn}>
                  <Text style={airportCode}>{arrivalAirport}</Text>
                  <Text style={airportTime}>{arrivalTime}</Text>
                  <Text style={airportDate}>{departureDate}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Passenger & Gate Info */}
            <Section style={detailsSection}>
              <Row>
                <Column style={detailsColumn}>
                  <Text style={label}>Passenger Name</Text>
                  <Text style={value}>{passengerName}</Text>
                </Column>
                <Column style={detailsColumn}>
                  <Text style={label}>Seat Number</Text>
                  <Text style={value}>{seatNumber}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailsColumn}>
                  <Text style={label}>Departure Terminal</Text>
                  <Text style={value}>{terminal}</Text>
                </Column>
                <Column style={detailsColumn}>
                  <Text style={label}>Departure Gate</Text>
                  <Text style={value}>{gate}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Important Information */}
            <Section style={importantSection}>
              <Text style={importantTitle}>⚠️ Important Information</Text>
              <Text style={importantText}>
                • Please arrive at the airport at least 2 hours before departure
              </Text>
              <Text style={importantText}>
                • Valid government-issued ID is required for check-in
              </Text>
              <Text style={importantText}>
                • Check-in closes 45 minutes before departure
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                Thank you for choosing Skyboundquest!
              </Text>
              <Text style={footerTextSmall}>
                For any assistance, contact us at support@skyboundquest.com
              </Text>
              <Text style={footerTextSmall}>
                © 2025 Skyboundquest. All rights reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#1e3a5f',
  padding: '30px 20px',
  textAlign: 'center',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '16px 0 0',
};

const content = {
  padding: '0 20px',
};

const successSection = {
  textAlign: 'center',
  padding: '30px 0 20px',
};

const successIcon = {
  fontSize: '48px',
  margin: '0',
};

const successTitle = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '16px 0 8px',
};

const successText = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0',
};

const downloadSection = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '20px',
  textAlign: 'center',
};

const downloadText = {
  fontSize: '14px',
  color: '#166534',
  margin: '0 0 4px',
  fontWeight: 'bold',
};

const downloadTextSmall = {
  fontSize: '12px',
  color: '#15803d',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const infoSection = {
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 16px',
};

const flightSection = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
};

const flightColumn = {
  padding: '0',
};

const airlineName = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#374151',
  margin: '0 0 4px',
};

const flightInfo = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
};

const routeRow = {
  marginTop: '20px',
};

const airportColumn = {
  width: '40%',
};

const flightPathColumn = {
  width: '20%',
};

const airportCode = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0',
};

const airportTime = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0 0',
};

const airportDate = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '4px 0 0',
};

const duration = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0 0 8px',
};

const planeIcon = {
  fontSize: '20px',
  margin: '0',
};

const detailsSection = {
  marginBottom: '20px',
};

const detailsColumn = {
  width: '50%',
  padding: '0 10px',
};

const label = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0 0 4px',
};

const value = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0',
};

const importantSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '20px',
};

const importantTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#92400e',
  margin: '0 0 8px',
};

const importantText = {
  fontSize: '12px',
  color: '#92400e',
  margin: '4px 0',
};

const footer = {
  textAlign: 'center',
  marginTop: '30px',
};

const footerText = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '0 0 8px',
};

const footerTextSmall = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '4px 0',
};