import rawAirports from '@/data/airports.json';

// Cache for search results
let searchCache = new Map();
let airports = rawAirports;

// Optional: Load compressed version for faster initial load
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // In production, fetch compressed data
  fetch('/airports.min.json')
    .then(res => res.json())
    .then(data => {
      airports = data.map(item => ({
        code: item.c,
        name: item.n,
        city: item.t,
        country: item.y,
        coordinates: item.l
      }));
    })
    .catch(console.error);
}

// Efficient search with debouncing
export function searchAirports(query, limit = 10) {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  // Check cache
  const cacheKey = `${searchTerm}:${limit}`;
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }
  
  // Priority scoring
  const scored = airports
    .map(airport => {
      let score = 0;
      const code = airport.code?.toLowerCase() || '';
      const name = airport.name?.toLowerCase() || '';
      const city = airport.city?.toLowerCase() || '';
      const country = airport.country?.toLowerCase() || '';
      
      // Exact matches get highest scores
      if (code === searchTerm) score += 100;
      else if (code.startsWith(searchTerm)) score += 80;
      else if (code.includes(searchTerm)) score += 40;
      
      if (city === searchTerm) score += 90;
      else if (city.startsWith(searchTerm)) score += 70;
      else if (city.includes(searchTerm)) score += 30;
      
      if (name.toLowerCase().includes(searchTerm)) score += 20;
      if (country.includes(searchTerm)) score += 10;
      
      return { ...airport, score };
    })
    .filter(airport => airport.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  // Cache result
  searchCache.set(cacheKey, scored);
  
  // Clear cache after 5 minutes
  setTimeout(() => searchCache.delete(cacheKey), 300000);
  
  return scored;
}

// Get airport by IATA code (fast lookup)
export function getAirportByCode(code) {
  if (!code) return null;
  const upperCode = code.toUpperCase();
  return airports.find(airport => airport.code === upperCode);
}

// Get popular airports for quick suggestions
export function getPopularAirports() {
  const popularCodes = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB', 'HND', 'SYD', 'JNB', 'GRU'];
  return popularCodes
    .map(code => getAirportByCode(code))
    .filter(Boolean);
}

// Fuzzy search for typo tolerance
export function fuzzySearchAirports(query, limit = 10) {
  if (!query || query.length < 3) return searchAirports(query, limit);
  
  const results = searchAirports(query, limit * 2);
  
  // If we have enough exact matches, return them
  if (results.length >= limit) return results.slice(0, limit);
  
  // Otherwise, try fuzzy matching
  const fuzzyResults = airports
    .filter(airport => {
      const searchTerm = query.toLowerCase();
      const text = `${airport.code} ${airport.name} ${airport.city}`.toLowerCase();
      return levenshteinDistance(text, searchTerm) <= 3;
    })
    .slice(0, limit);
  
  return [...results, ...fuzzyResults].slice(0, limit);
}

// Helper: Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator,
      );
    }
  }
  return track[str2.length][str1.length];
}

// Group airports by city/country
export function groupAirportsByCity() {
  const groups = new Map();
  
  airports.forEach(airport => {
    const key = `${airport.city}|${airport.country}`;
    if (!groups.has(key)) {
      groups.set(key, {
        city: airport.city,
        country: airport.country,
        airports: []
      });
    }
    groups.get(key).airports.push(airport);
  });
  
  return Array.from(groups.values());
}

// Get nearby airports based on coordinates
export function getNearbyAirports(lat, lng, radiusKm = 100) {
  return airports
    .filter(airport => airport.latitude && airport.longitude)
    .map(airport => ({
      ...airport,
      distance: calculateDistance(lat, lng, airport.latitude, airport.longitude)
    }))
    .filter(airport => airport.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}