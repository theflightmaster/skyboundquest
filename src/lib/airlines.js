// Comprehensive database of airlines with their IATA codes (2-character)
export const airlines = [
  // Major US Airlines
  { code: 'AA', name: 'American Airlines', country: 'USA' },
  { code: 'DL', name: 'Delta Air Lines', country: 'USA' },
  { code: 'UA', name: 'United Airlines', country: 'USA' },
  { code: 'WN', name: 'Southwest Airlines', country: 'USA' },
  { code: 'B6', name: 'JetBlue Airways', country: 'USA' },
  { code: 'AS', name: 'Alaska Airlines', country: 'USA' },
  { code: 'NK', name: 'Spirit Airlines', country: 'USA' },
  { code: 'F9', name: 'Frontier Airlines', country: 'USA' },
  { code: 'HA', name: 'Hawaiian Airlines', country: 'USA' },
  { code: 'G4', name: 'Allegiant Air', country: 'USA' },
  { code: 'SY', name: 'Sun Country Airlines', country: 'USA' },
  
  // Major European Airlines
  { code: 'BA', name: 'British Airways', country: 'UK' },
  { code: 'AF', name: 'Air France', country: 'France' },
  { code: 'LH', name: 'Lufthansa', country: 'Germany' },
  { code: 'KL', name: 'KLM Royal Dutch Airlines', country: 'Netherlands' },
  { code: 'IB', name: 'Iberia', country: 'Spain' },
  { code: 'AY', name: 'Finnair', country: 'Finland' },
  { code: 'SK', name: 'SAS Scandinavian Airlines', country: 'Sweden' },
  { code: 'LX', name: 'Swiss International Air Lines', country: 'Switzerland' },
  { code: 'OS', name: 'Austrian Airlines', country: 'Austria' },
  { code: 'SN', name: 'Brussels Airlines', country: 'Belgium' },
  { code: 'TP', name: 'TAP Air Portugal', country: 'Portugal' },
  { code: 'AZ', name: 'ITA Airways', country: 'Italy' },
  { code: 'LO', name: 'LOT Polish Airlines', country: 'Poland' },
  { code: 'OK', name: 'Czech Airlines', country: 'Czech Republic' },
  { code: 'RO', name: 'Tarom', country: 'Romania' },
  
  // UK & Ireland
  { code: 'EI', name: 'Aer Lingus', country: 'Ireland' },
  { code: 'VS', name: 'Virgin Atlantic', country: 'UK' },
  { code: 'U2', name: 'easyJet', country: 'UK' },
  { code: 'FR', name: 'Ryanair', country: 'Ireland' },
  { code: 'LS', name: 'Jet2.com', country: 'UK' },
  { code: 'BY', name: 'TUI Airways', country: 'UK' },
  
  // Middle Eastern Airlines
  { code: 'EK', name: 'Emirates', country: 'UAE' },
  { code: 'EY', name: 'Etihad Airways', country: 'UAE' },
  { code: 'QR', name: 'Qatar Airways', country: 'Qatar' },
  { code: 'TK', name: 'Turkish Airlines', country: 'Turkey' },
  { code: 'GF', name: 'Gulf Air', country: 'Bahrain' },
  { code: 'KU', name: 'Kuwait Airways', country: 'Kuwait' },
  { code: 'OV', name: 'SalamAir', country: 'Oman' },
  { code: 'WY', name: 'Oman Air', country: 'Oman' },
  
  // Asian Airlines
  { code: 'NH', name: 'ANA All Nippon Airways', country: 'Japan' },
  { code: 'JL', name: 'Japan Airlines', country: 'Japan' },
  { code: 'KE', name: 'Korean Air', country: 'South Korea' },
  { code: 'OZ', name: 'Asiana Airlines', country: 'South Korea' },
  { code: 'CA', name: 'Air China', country: 'China' },
  { code: 'MU', name: 'China Eastern Airlines', country: 'China' },
  { code: 'CZ', name: 'China Southern Airlines', country: 'China' },
  { code: 'HU', name: 'Hainan Airlines', country: 'China' },
  { code: 'CX', name: 'Cathay Pacific', country: 'Hong Kong' },
  { code: 'SQ', name: 'Singapore Airlines', country: 'Singapore' },
  { code: 'MH', name: 'Malaysia Airlines', country: 'Malaysia' },
  { code: 'TG', name: 'Thai Airways', country: 'Thailand' },
  { code: 'VN', name: 'Vietnam Airlines', country: 'Vietnam' },
  { code: 'PR', name: 'Philippine Airlines', country: 'Philippines' },
  { code: 'GA', name: 'Garuda Indonesia', country: 'Indonesia' },
  { code: 'AI', name: 'Air India', country: 'India' },
  { code: '6E', name: 'IndiGo', country: 'India' },
  { code: 'UK', name: 'Vistara', country: 'India' },
  { code: 'SG', name: 'SpiceJet', country: 'India' },
  
  // African Airlines
  { code: 'SA', name: 'South African Airways', country: 'South Africa' },
  { code: 'ET', name: 'Ethiopian Airlines', country: 'Ethiopia' },
  { code: 'MS', name: 'EgyptAir', country: 'Egypt' },
  { code: 'AT', name: 'Royal Air Maroc', country: 'Morocco' },
  { code: 'KQ', name: 'Kenya Airways', country: 'Kenya' },
  { code: 'TK', name: 'Turkish Airlines', country: 'Turkey' },
  
  // Australian/New Zealand
  { code: 'QF', name: 'Qantas', country: 'Australia' },
  { code: 'VA', name: 'Virgin Australia', country: 'Australia' },
  { code: 'JQ', name: 'Jetstar Airways', country: 'Australia' },
  { code: 'NZ', name: 'Air New Zealand', country: 'New Zealand' },
  
  // Canadian Airlines
  { code: 'AC', name: 'Air Canada', country: 'Canada' },
  { code: 'WS', name: 'WestJet', country: 'Canada' },
  { code: 'PD', name: 'Porter Airlines', country: 'Canada' },
  { code: 'F8', name: 'Flair Airlines', country: 'Canada' },
  
  // Latin American Airlines
  { code: 'AM', name: 'Aeromexico', country: 'Mexico' },
  { code: 'CM', name: 'Copa Airlines', country: 'Panama' },
  { code: 'AV', name: 'Avianca', country: 'Colombia' },
  { code: 'LA', name: 'LATAM Airlines', country: 'Chile' },
  { code: 'G3', name: 'Gol Transportes Aéreos', country: 'Brazil' },
  { code: 'AR', name: 'Aerolineas Argentinas', country: 'Argentina' },
  
  // Low Cost Carriers
  { code: 'NK', name: 'Spirit Airlines', country: 'USA' },
  { code: 'F9', name: 'Frontier Airlines', country: 'USA' },
  { code: 'G4', name: 'Allegiant Air', country: 'USA' },
  { code: 'SY', name: 'Sun Country Airlines', country: 'USA' },
  { code: 'U2', name: 'easyJet', country: 'UK' },
  { code: 'FR', name: 'Ryanair', country: 'Ireland' },
  { code: 'W6', name: 'Wizz Air', country: 'Hungary' },
  { code: 'D8', name: 'Norwegian Air Shuttle', country: 'Norway' },
  { code: 'DY', name: 'Norwegian Air Shuttle', country: 'Norway' },
];

// Helper function to search airlines
export const searchAirlines = (query) => {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toLowerCase();
  return airlines.filter(airline =>
    airline.code.toLowerCase().includes(searchTerm) ||
    airline.name.toLowerCase().includes(searchTerm) ||
    airline.country.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
};

// Helper function to get airline by code
export const getAirlineByCode = (code) => {
  return airlines.find(airline => airline.code === code.toUpperCase());
};