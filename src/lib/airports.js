// Comprehensive database of cities and their airport codes
export const airports = [
  // North America
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', continent: 'North America' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', country: 'USA', continent: 'North America' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', country: 'USA', continent: 'North America' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', continent: 'North America' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA', continent: 'North America' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', continent: 'North America' },
  { code: 'MDW', name: 'Midway International', city: 'Chicago', country: 'USA', continent: 'North America' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', continent: 'North America' },
  { code: 'DAL', name: 'Dallas Love Field', city: 'Dallas', country: 'USA', continent: 'North America' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', continent: 'North America' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', country: 'USA', continent: 'North America' },
  { code: 'BOS', name: 'Logan International', city: 'Boston', country: 'USA', continent: 'North America' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', continent: 'North America' },
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood', city: 'Fort Lauderdale', country: 'USA', continent: 'North America' },
  { code: 'MCO', name: 'Orlando International', city: 'Orlando', country: 'USA', continent: 'North America' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', country: 'USA', continent: 'North America' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'USA', continent: 'North America' },
  { code: 'HOU', name: 'William P. Hobby', city: 'Houston', country: 'USA', continent: 'North America' },
  { code: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', country: 'USA', continent: 'North America' },
  { code: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'USA', continent: 'North America' },
  { code: 'SAN', name: 'San Diego International', city: 'San Diego', country: 'USA', continent: 'North America' },
  { code: 'PDX', name: 'Portland International', city: 'Portland', country: 'USA', continent: 'North America' },
  { code: 'MSP', name: 'Minneapolis-Saint Paul', city: 'Minneapolis', country: 'USA', continent: 'North America' },
  { code: 'DTW', name: 'Detroit Metropolitan', city: 'Detroit', country: 'USA', continent: 'North America' },
  { code: 'STL', name: 'St. Louis Lambert', city: 'St. Louis', country: 'USA', continent: 'North America' },
  { code: 'BWI', name: 'Baltimore/Washington', city: 'Baltimore', country: 'USA', continent: 'North America' },
  { code: 'DCA', name: 'Ronald Reagan Washington', city: 'Washington', country: 'USA', continent: 'North America' },
  { code: 'IAD', name: 'Washington Dulles', city: 'Washington', country: 'USA', continent: 'North America' },
  { code: 'CLT', name: 'Charlotte Douglas', city: 'Charlotte', country: 'USA', continent: 'North America' },
  { code: 'NASH', name: 'Nashville International', city: 'Nashville', country: 'USA', continent: 'North America' },
  
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada', continent: 'North America' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada', continent: 'North America' },
  { code: 'YUL', name: 'Montréal-Trudeau', city: 'Montreal', country: 'Canada', continent: 'North America' },
  { code: 'YYC', name: 'Calgary International', city: 'Calgary', country: 'Canada', continent: 'North America' },
  { code: 'YEG', name: 'Edmonton International', city: 'Edmonton', country: 'Canada', continent: 'North America' },
  { code: 'YOW', name: 'Ottawa Macdonald-Cartier', city: 'Ottawa', country: 'Canada', continent: 'North America' },
  { code: 'YHZ', name: 'Halifax Stanfield', city: 'Halifax', country: 'Canada', continent: 'North America' },
  { code: 'YWG', name: 'Winnipeg International', city: 'Winnipeg', country: 'Canada', continent: 'North America' },
  
  // Mexico & Central America
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', country: 'Mexico', continent: 'North America' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancun', country: 'Mexico', continent: 'North America' },
  { code: 'GDL', name: 'Guadalajara International', city: 'Guadalajara', country: 'Mexico', continent: 'North America' },
  { code: 'MTY', name: 'Monterrey International', city: 'Monterrey', country: 'Mexico', continent: 'North America' },
  { code: 'PTY', name: 'Tocumen International', city: 'Panama City', country: 'Panama', continent: 'Central America' },
  { code: 'SJO', name: 'Juan Santamaría', city: 'San Jose', country: 'Costa Rica', continent: 'Central America' },
  { code: 'GUA', name: 'La Aurora', city: 'Guatemala City', country: 'Guatemala', continent: 'Central America' },
  { code: 'SAL', name: 'El Salvador International', city: 'San Salvador', country: 'El Salvador', continent: 'Central America' },
  
  // Europe
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'LGW', name: 'London Gatwick', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'STN', name: 'London Stansted', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'LTN', name: 'London Luton', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'LCY', name: 'London City', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'MAN', name: 'Manchester', city: 'Manchester', country: 'UK', continent: 'Europe' },
  { code: 'BHX', name: 'Birmingham', city: 'Birmingham', country: 'UK', continent: 'Europe' },
  { code: 'GLA', name: 'Glasgow', city: 'Glasgow', country: 'UK', continent: 'Europe' },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh', country: 'UK', continent: 'Europe' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', continent: 'Europe' },
  { code: 'ORY', name: 'Orly', city: 'Paris', country: 'France', continent: 'Europe' },
  { code: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Germany', continent: 'Europe' },
  { code: 'MUC', name: 'Munich', city: 'Munich', country: 'Germany', continent: 'Europe' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'Germany', continent: 'Europe' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', continent: 'Europe' },
  { code: 'MAD', name: 'Madrid-Barajas', city: 'Madrid', country: 'Spain', continent: 'Europe' },
  { code: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'Spain', continent: 'Europe' },
  { code: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italy', continent: 'Europe' },
  { code: 'MXP', name: 'Malpensa', city: 'Milan', country: 'Italy', continent: 'Europe' },
  { code: 'VCE', name: 'Marco Polo', city: 'Venice', country: 'Italy', continent: 'Europe' },
  { code: 'ZRH', name: 'Zürich', city: 'Zurich', country: 'Switzerland', continent: 'Europe' },
  { code: 'GVA', name: 'Geneva', city: 'Geneva', country: 'Switzerland', continent: 'Europe' },
  { code: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria', continent: 'Europe' },
  { code: 'BRU', name: 'Brussels', city: 'Brussels', country: 'Belgium', continent: 'Europe' },
  { code: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', continent: 'Europe' },
  { code: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway', continent: 'Europe' },
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', continent: 'Europe' },
  { code: 'HEL', name: 'Helsinki-Vantaa', city: 'Helsinki', country: 'Finland', continent: 'Europe' },
  { code: 'DUB', name: 'Dublin', city: 'Dublin', country: 'Ireland', continent: 'Europe' },
  { code: 'LIS', name: 'Lisbon Portela', city: 'Lisbon', country: 'Portugal', continent: 'Europe' },
  { code: 'OPO', name: 'Francisco Sá Carneiro', city: 'Porto', country: 'Portugal', continent: 'Europe' },
  { code: 'ATH', name: 'Athens Eleftherios Venizelos', city: 'Athens', country: 'Greece', continent: 'Europe' },
  { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey', continent: 'Europe' },
  { code: 'SAW', name: 'Sabiha Gökçen', city: 'Istanbul', country: 'Turkey', continent: 'Europe' },
  { code: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', country: 'Poland', continent: 'Europe' },
  { code: 'PRG', name: 'Václav Havel', city: 'Prague', country: 'Czech Republic', continent: 'Europe' },
  { code: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'Hungary', continent: 'Europe' },
  
  // Asia
  { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { code: 'KIX', name: 'Kansai', city: 'Osaka', country: 'Japan', continent: 'Asia' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', continent: 'Asia' },
  { code: 'GMP', name: 'Gimpo', city: 'Seoul', country: 'South Korea', continent: 'Asia' },
  { code: 'PEK', name: 'Beijing Capital', city: 'Beijing', country: 'China', continent: 'Asia' },
  { code: 'PKX', name: 'Beijing Daxing', city: 'Beijing', country: 'China', continent: 'Asia' },
  { code: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', country: 'China', continent: 'Asia' },
  { code: 'SHA', name: 'Shanghai Hongqiao', city: 'Shanghai', country: 'China', continent: 'Asia' },
  { code: 'CAN', name: 'Guangzhou Baiyun', city: 'Guangzhou', country: 'China', continent: 'Asia' },
  { code: 'SZX', name: 'Shenzhen Bao\'an', city: 'Shenzhen', country: 'China', continent: 'Asia' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', continent: 'Asia' },
  { code: 'TPE', name: 'Taoyuan International', city: 'Taipei', country: 'Taiwan', continent: 'Asia' },
  { code: 'SIN', name: 'Changi', city: 'Singapore', country: 'Singapore', continent: 'Asia' },
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', continent: 'Asia' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'Thailand', continent: 'Asia' },
  { code: 'DMK', name: 'Don Mueang', city: 'Bangkok', country: 'Thailand', continent: 'Asia' },
  { code: 'HKT', name: 'Phuket International', city: 'Phuket', country: 'Thailand', continent: 'Asia' },
  { code: 'SGN', name: 'Tan Son Nhat', city: 'Ho Chi Minh City', country: 'Vietnam', continent: 'Asia' },
  { code: 'HAN', name: 'Noi Bai', city: 'Hanoi', country: 'Vietnam', continent: 'Asia' },
  { code: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta', country: 'Indonesia', continent: 'Asia' },
  { code: 'DPS', name: 'Ngurah Rai', city: 'Bali', country: 'Indonesia', continent: 'Asia' },
  { code: 'MNL', name: 'Ninoy Aquino', city: 'Manila', country: 'Philippines', continent: 'Asia' },
  { code: 'CEB', name: 'Mactan-Cebu', city: 'Cebu', country: 'Philippines', continent: 'Asia' },
  { code: 'DEL', name: 'Indira Gandhi', city: 'Delhi', country: 'India', continent: 'Asia' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', continent: 'Asia' },
  { code: 'BLR', name: 'Kempegowda', city: 'Bangalore', country: 'India', continent: 'Asia' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', continent: 'Asia' },
  { code: 'CCU', name: 'Netaji Subhash', city: 'Kolkata', country: 'India', continent: 'Asia' },
  { code: 'HYD', name: 'Rajiv Gandhi', city: 'Hyderabad', country: 'India', continent: 'Asia' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', continent: 'Asia' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', continent: 'Asia' },
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', continent: 'Asia' },
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain', continent: 'Asia' },
  { code: 'RUH', name: 'King Khalid', city: 'Riyadh', country: 'Saudi Arabia', continent: 'Asia' },
  { code: 'JED', name: 'King Abdulaziz', city: 'Jeddah', country: 'Saudi Arabia', continent: 'Asia' },
  { code: 'TLV', name: 'Ben Gurion', city: 'Tel Aviv', country: 'Israel', continent: 'Asia' },
  
  // Oceania
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', continent: 'Oceania' },
  { code: 'MEL', name: 'Melbourne Tullamarine', city: 'Melbourne', country: 'Australia', continent: 'Oceania' },
  { code: 'BNE', name: 'Brisbane', city: 'Brisbane', country: 'Australia', continent: 'Oceania' },
  { code: 'PER', name: 'Perth', city: 'Perth', country: 'Australia', continent: 'Oceania' },
  { code: 'ADL', name: 'Adelaide', city: 'Adelaide', country: 'Australia', continent: 'Oceania' },
  { code: 'CNS', name: 'Cairns', city: 'Cairns', country: 'Australia', continent: 'Oceania' },
  { code: 'AKL', name: 'Auckland', city: 'Auckland', country: 'New Zealand', continent: 'Oceania' },
  { code: 'WLG', name: 'Wellington', city: 'Wellington', country: 'New Zealand', continent: 'Oceania' },
  { code: 'CHC', name: 'Christchurch', city: 'Christchurch', country: 'New Zealand', continent: 'Oceania' },
  
  // Africa
  { code: 'JNB', name: 'O.R. Tambo', city: 'Johannesburg', country: 'South Africa', continent: 'Africa' },
  { code: 'CPT', name: 'Cape Town', city: 'Cape Town', country: 'South Africa', continent: 'Africa' },
  { code: 'DUR', name: 'King Shaka', city: 'Durban', country: 'South Africa', continent: 'Africa' },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', continent: 'Africa' },
  { code: 'CMN', name: 'Mohammed V', city: 'Casablanca', country: 'Morocco', continent: 'Africa' },
  { code: 'LOS', name: 'Murtala Muhammed', city: 'Lagos', country: 'Nigeria', continent: 'Africa' },
  { code: 'ABV', name: 'Nnamdi Azikiwe', city: 'Abuja', country: 'Nigeria', continent: 'Africa' },
  { code: 'NBO', name: 'Jomo Kenyatta', city: 'Nairobi', country: 'Kenya', continent: 'Africa' },
  { code: 'ADD', name: 'Addis Ababa Bole', city: 'Addis Ababa', country: 'Ethiopia', continent: 'Africa' },
  { code: 'ACC', name: 'Kotoka', city: 'Accra', country: 'Ghana', continent: 'Africa' },
  { code: 'DAR', name: 'Julius Nyerere', city: 'Dar es Salaam', country: 'Tanzania', continent: 'Africa' },
  
  // South America
  { code: 'GRU', name: 'Guarulhos', city: 'Sao Paulo', country: 'Brazil', continent: 'South America' },
  { code: 'CGH', name: 'Congonhas', city: 'Sao Paulo', country: 'Brazil', continent: 'South America' },
  { code: 'GIG', name: 'Galeão', city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America' },
  { code: 'SDU', name: 'Santos Dumont', city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America' },
  { code: 'BSB', name: 'Brasília', city: 'Brasilia', country: 'Brazil', continent: 'South America' },
  { code: 'EZE', name: 'Ezeiza', city: 'Buenos Aires', country: 'Argentina', continent: 'South America' },
  { code: 'AEP', name: 'Aeroparque', city: 'Buenos Aires', country: 'Argentina', continent: 'South America' },
  { code: 'SCL', name: 'Comodoro Arturo Merino Benítez', city: 'Santiago', country: 'Chile', continent: 'South America' },
  { code: 'LIM', name: 'Jorge Chávez', city: 'Lima', country: 'Peru', continent: 'South America' },
  { code: 'BOG', name: 'El Dorado', city: 'Bogota', country: 'Colombia', continent: 'South America' },
  { code: 'MDE', name: 'José María Córdova', city: 'Medellin', country: 'Colombia', continent: 'South America' },
  { code: 'CCS', name: 'Simón Bolívar', city: 'Caracas', country: 'Venezuela', continent: 'South America' },
  { code: 'UIO', name: 'Mariscal Sucre', city: 'Quito', country: 'Ecuador', continent: 'South America' },
  { code: 'GYE', name: 'José Joaquín de Olmedo', city: 'Guayaquil', country: 'Ecuador', continent: 'South America' },
];

// Helper function to search airports
export const searchAirports = (query) => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return airports.filter(airport =>
    airport.code.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm) ||
    airport.country.toLowerCase().includes(searchTerm)
  ).slice(0, 10);
};

// Helper function to get airport by code
export const getAirportByCode = (code) => {
  return airports.find(airport => airport.code === code.toUpperCase());
};

// Group airports by city
export const getCitiesWithAirports = () => {
  const citiesMap = new Map();
  
  airports.forEach(airport => {
    const key = `${airport.city}-${airport.country}`;
    if (!citiesMap.has(key)) {
      citiesMap.set(key, {
        city: airport.city,
        country: airport.country,
        airports: []
      });
    }
    citiesMap.get(key).airports.push(airport);
  });
  
  return Array.from(citiesMap.values());
};
