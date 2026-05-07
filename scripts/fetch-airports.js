import csv from 'csvtojson';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Download from https://davidmegginson.github.io/ourairports-data/airports.csv
const AIRPORTS_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv';
const COUNTRIES_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/countries.csv';

async function downloadFile(url) {
  const response = await fetch(url);
  return await response.text();
}

async function generateAirportsData() {
  // console.log('📡 Downloading airport data...');
  
  try {
    // Download CSV files
    const airportsCsv = await downloadFile(AIRPORTS_CSV_URL);
    const countriesCsv = await downloadFile(COUNTRIES_CSV_URL);
    
    // Parse CSV
    const airports = await csv().fromString(airportsCsv);
    const countries = await csv().fromString(countriesCsv);
    
    // Create country name mapping
    const countryMap = new Map();
    countries.forEach(country => {
      countryMap.set(country.code, country.name);
    });
    
    // Filter and transform airports
    const filteredAirports = airports
      .filter(airport => {
        // Only include airports with IATA codes
        if (!airport.iata_code || airport.iata_code === '') return false;
        
        // Optional: Filter by type (remove closed airports)
        if (airport.type === 'closed') return false;
        
        return true;
      })
      .map(airport => ({
        code: airport.iata_code,
        icao: airport.ident,
        name: airport.name,
        city: airport.municipality || '',
        country: countryMap.get(airport.iso_country) || airport.iso_country,
        countryCode: airport.iso_country,
        continent: getContinent(airport.continent),
        latitude: parseFloat(airport.latitude_deg),
        longitude: parseFloat(airport.longitude_deg),
        timezone: airport.timezone,
        type: airport.type,
        elevation: airport.elevation_ft ? parseInt(airport.elevation_ft) : null,
        isInternational: airport.type === 'large_airport' || airport.scheduled_service === 'yes'
      }));
    
    // Create optimized search index
    const searchIndex = createSearchIndex(filteredAirports);
    
    // Save full dataset
    const outputPath = path.join(__dirname, '../src/data/airports.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(filteredAirports, null, 2));
    
    // Save search index
    const indexPath = path.join(__dirname, '../src/data/airports-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(searchIndex));
    
    // Save compressed version for client
    const compressedPath = path.join(__dirname, '../public/airports.min.json');
    const compressed = filteredAirports.map(airport => ({
      c: airport.code,
      n: airport.name,
      t: airport.city,
      y: airport.country,
      l: { lat: airport.latitude, lng: airport.longitude }
    }));
    fs.writeFileSync(compressedPath, JSON.stringify(compressed));
    
    // console.log(`✅ Generated ${filteredAirports.length} airports`);
    // console.log(`📁 Full data: ${outputPath}`);
    // console.log(`📁 Search index: ${indexPath}`);
    // console.log(`📁 Compressed: ${compressedPath}`);
    
  } catch (error) {
    console.error('❌ Error generating airport data:', error);
  }
}

function getContinent(code) {
  const continents = {
    'AF': 'Africa',
    'AN': 'Antarctica',
    'AS': 'Asia',
    'EU': 'Europe',
    'NA': 'North America',
    'OC': 'Oceania',
    'SA': 'South America'
  };
  return continents[code] || 'Unknown';
}

function createSearchIndex(airports) {
  // Create trie-like structure for fast search
  const index = {
    byCode: {},
    byCity: {},
    byCountry: {}
  };
  
  airports.forEach(airport => {
    // Index by code
    index.byCode[airport.code] = airport;
    
    // Index by city
    if (airport.city) {
      const cityKey = airport.city.toLowerCase();
      if (!index.byCity[cityKey]) index.byCity[cityKey] = [];
      index.byCity[cityKey].push(airport.code);
    }
    
    // Index by country
    const countryKey = airport.country.toLowerCase();
    if (!index.byCountry[countryKey]) index.byCountry[countryKey] = [];
    index.byCountry[countryKey].push(airport.code);
  });
  
  return index;
}

// Run the script
generateAirportsData();