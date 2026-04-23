const BASE_URL = 'https://api.flightapi.io';
const API_KEY = process.env.NEXT_PUBLIC_FLIGHTAPI_KEY;

// All available cabin classes
const CABIN_CLASSES = ['Economy', 'Premium_Economy', 'Business', 'First'];

/**
 * Search flights across all cabin classes
 */
export async function searchFlights({
  departure_iata,
  arrival_iata,
  flight_date,
  return_date = null,
  adults = 1,
  children = 0,
  infants = 0,
  currency = 'USD',
}) {
  const isRoundTrip = return_date && return_date.trim() !== '';
  
  // Make parallel requests for all cabin classes
  const cabinPromises = CABIN_CLASSES.map(async (cabinClass) => {
    try {
      let url;
      if (isRoundTrip) {
        url = `${BASE_URL}/roundtrip/${API_KEY}/${departure_iata}/${arrival_iata}/${flight_date}/${return_date}/${adults}/${children}/${infants}/${cabinClass}/${currency}`;
      } else {
        url = `${BASE_URL}/onewaytrip/${API_KEY}/${departure_iata}/${arrival_iata}/${flight_date}/${adults}/${children}/${infants}/${cabinClass}/${currency}`;
      }
      
      const res = await fetch(url, { next: { revalidate: 300 } });
      
      if (!res.ok) {
        console.error(`Failed to fetch ${cabinClass}:`, res.status);
        return null;
      }
      
      const data = await res.json();
      
      if (isRoundTrip) {
        return normalizeRoundTripResponse(data, departure_iata, arrival_iata, flight_date, return_date, cabinClass);
      } else {
        return normalizeSearchResponse(data, departure_iata, arrival_iata, flight_date, cabinClass);
      }
    } catch (error) {
      console.error(`Error fetching ${cabinClass}:`, error.message);
      return null;
    }
  });
  
  // Wait for all cabin class requests to complete
  const results = await Promise.all(cabinPromises);
  
  // Combine all flights from all cabin classes
  const allFlights = results.filter(result => result && result.length > 0).flat();
  
  // Sort by price
  allFlights.sort((a, b) => {
    const priceA = a.price?.amount || a.total_price?.amount || Infinity;
    const priceB = b.price?.amount || b.total_price?.amount || Infinity;
    return priceA - priceB;
  });
  
  return allFlights;
}

/**
 * Search one-way flights (single cabin class)
 */
export async function searchFlightsByCabin({
  departure_iata,
  arrival_iata,
  flight_date,
  return_date = null,
  adults = 1,
  children = 0,
  infants = 0,
  cabin_class = 'Economy',
  currency = 'USD',
}) {
  const isRoundTrip = return_date && return_date.trim() !== '';
  
  if (isRoundTrip) {
    const url = `${BASE_URL}/roundtrip/${API_KEY}/${departure_iata}/${arrival_iata}/${flight_date}/${return_date}/${adults}/${children}/${infants}/${cabin_class}/${currency}`;
    
    const res = await fetch(url, { next: { revalidate: 300 } });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`FlightAPI error ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    return normalizeRoundTripResponse(data, departure_iata, arrival_iata, flight_date, return_date, cabin_class);
  } else {
    const url = `${BASE_URL}/onewaytrip/${API_KEY}/${departure_iata}/${arrival_iata}/${flight_date}/${adults}/${children}/${infants}/${cabin_class}/${currency}`;
    
    const res = await fetch(url, { next: { revalidate: 300 } });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`FlightAPI error ${res.status}: ${text}`);
    }
    
    const data = await res.json();
    return normalizeSearchResponse(data, departure_iata, arrival_iata, flight_date, cabin_class);
  }
}

function normalizeSearchResponse(data, depIata, arrIata, date, cabinClass) {
  const { itineraries = [], legs = [], segments = [], carriers = [], places = [], agents = [] } = data;

  const legMap = Object.fromEntries(legs.map((l) => [l.id, l]));
  const segmentMap = Object.fromEntries(segments.map((s) => [s.id, s]));
  const carrierMap = Object.fromEntries(carriers.map((c) => [c.id, c]));
  const placeMap = Object.fromEntries(places.map((p) => [p.id, p]));
  const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]));

  return itineraries.map((itinerary) => {
    const leg = legMap[itinerary.leg_ids?.[0]];
    if (!leg) return null;

    const segment = segmentMap[leg.segment_ids?.[0]];
    const carrier = carrierMap[leg.marketing_carrier_ids?.[0]];
    const originPlace = placeMap[leg.origin_place_id];
    const destPlace = placeMap[leg.destination_place_id];
    
    const pricingOption = itinerary.pricing_options?.[0];
    const agent = pricingOption ? agentMap[pricingOption.agent_ids?.[0]] : null;
    const priceAmount = pricingOption?.price?.amount || itinerary.cheapest_price?.amount;

    // Try to get airline code from multiple sources
    let airlineCode = '';
    
    // First try carrier object
    if (carrier) {
      airlineCode = carrier.iata_code || carrier.fs || carrier.code || '';
    }
    
    // If still empty, try to extract from marketing_flight_number (e.g., "DL1406")
    if (!airlineCode && segment?.marketing_flight_number) {
      const match = segment.marketing_flight_number.match(/^([A-Z]{2,3})/);
      if (match) {
        airlineCode = match[1];
      }
    }
    
    const flightNum = segment?.marketing_flight_number?.replace(/^[A-Z]{2,3}/, '') || '';
    const fullFlightIata = airlineCode ? `${airlineCode}${flightNum}` : segment?.marketing_flight_number || '';

    return {
      id: `${itinerary.id}_${cabinClass}`,
      flight_date: date,
      flight_status: 'scheduled',
      cabin_class: cabinClass.replace('_', ' '),
      airline: {
        name: carrier?.name || 'Unknown Airline',
        iata: airlineCode,
      },
      flight: {
        iata: fullFlightIata,
        number: flightNum,
      },
      departure: {
        airport: originPlace?.name || depIata,
        iata: originPlace?.iata || depIata,
        scheduled: leg.departure,
        terminal: null,
        gate: null,
      },
      arrival: {
        airport: destPlace?.name || arrIata,
        iata: destPlace?.iata || arrIata,
        scheduled: leg.arrival,
        terminal: null,
        gate: null,
        baggage: null,
      },
      duration: leg.duration,
      stops: leg.stop_count,
      price: {
        amount: priceAmount ?? null,
        currency: 'USD',
        deepLink: pricingOption?.items?.[0]?.url || null,
        agent: agent?.name || null,
      },
    };
  }).filter(Boolean);
}

function normalizeRoundTripResponse(data, depIata, arrIata, outboundDate, returnDate, cabinClass) {
  const { itineraries = [], legs = [], segments = [], carriers = [], places = [], agents = [] } = data;

  const legMap = Object.fromEntries(legs.map((l) => [l.id, l]));
  const segmentMap = Object.fromEntries(segments.map((s) => [s.id, s]));
  const carrierMap = Object.fromEntries(carriers.map((c) => [c.id, c]));
  const placeMap = Object.fromEntries(places.map((p) => [p.id, p]));
  const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]));

  return itineraries.map((itinerary) => {
    const itineraryLegs = itinerary.leg_ids?.map(id => legMap[id]).filter(Boolean) || [];
    
    const outboundLeg = itineraryLegs[0];
    const returnLeg = itineraryLegs[1];
    
    const outboundSegment = outboundLeg ? segmentMap[outboundLeg.segment_ids?.[0]] : null;
    const returnSegment = returnLeg ? segmentMap[returnLeg.segment_ids?.[0]] : null;
    
    const outboundCarrier = outboundLeg ? carrierMap[outboundLeg.marketing_carrier_ids?.[0]] : null;
    const returnCarrier = returnLeg ? carrierMap[returnLeg.marketing_carrier_ids?.[0]] : null;
    
    const originPlace = outboundLeg ? placeMap[outboundLeg.origin_place_id] : null;
    const destPlace = outboundLeg ? placeMap[outboundLeg.destination_place_id] : null;
    const returnOriginPlace = returnLeg ? placeMap[returnLeg.origin_place_id] : null;
    const returnDestPlace = returnLeg ? placeMap[returnLeg.destination_place_id] : null;

    const pricingOption = itinerary.pricing_options?.[0];
    const agent = pricingOption ? agentMap[pricingOption.agent_ids?.[0]] : null;
    const priceAmount = pricingOption?.price?.amount || itinerary.cheapest_price?.amount;

    // Helper function to get airline code
    const getAirlineCode = (carrier, segment) => {
      if (carrier) {
        return carrier.iata_code || carrier.fs || carrier.code || '';
      }
      if (segment?.marketing_flight_number) {
        const match = segment.marketing_flight_number.match(/^([A-Z]{2,3})/);
        if (match) return match[1];
      }
      return '';
    };

    // Helper function to get flight number
    const getFlightNumber = (segment) => {
      if (!segment?.marketing_flight_number) return '';
      return segment.marketing_flight_number.replace(/^[A-Z]{2,3}/, '');
    };

    const outboundAirlineCode = getAirlineCode(outboundCarrier, outboundSegment);
    const outboundFlightNum = getFlightNumber(outboundSegment);
    const outboundFullIata = outboundAirlineCode ? `${outboundAirlineCode}${outboundFlightNum}` : outboundSegment?.marketing_flight_number || '';
    
    const returnAirlineCode = getAirlineCode(returnCarrier, returnSegment);
    const returnFlightNum = getFlightNumber(returnSegment);
    const returnFullIata = returnAirlineCode ? `${returnAirlineCode}${returnFlightNum}` : returnSegment?.marketing_flight_number || '';

    return {
      id: `${itinerary.id}_${cabinClass}`,
      type: 'round_trip',
      cabin_class: cabinClass.replace('_', ' '),
      outbound: {
        flight_date: outboundDate,
        airline: {
          name: outboundCarrier?.name || 'Unknown Airline',
          iata: outboundAirlineCode,
        },
        flight: {
          iata: outboundFullIata,
          number: outboundFlightNum,
        },
        departure: {
          airport: originPlace?.name || depIata,
          iata: originPlace?.iata || depIata,
          scheduled: outboundLeg?.departure,
        },
        arrival: {
          airport: destPlace?.name || arrIata,
          iata: destPlace?.iata || arrIata,
          scheduled: outboundLeg?.arrival,
        },
        duration: outboundLeg?.duration,
        stops: outboundLeg?.stop_count || 0,
      },
      return: returnLeg ? {
        flight_date: returnDate,
        airline: {
          name: returnCarrier?.name || 'Unknown Airline',
          iata: returnAirlineCode,
        },
        flight: {
          iata: returnFullIata,
          number: returnFlightNum,
        },
        departure: {
          airport: returnOriginPlace?.name || arrIata,
          iata: returnOriginPlace?.iata || arrIata,
          scheduled: returnLeg?.departure,
        },
        arrival: {
          airport: returnDestPlace?.name || depIata,
          iata: returnDestPlace?.iata || depIata,
          scheduled: returnLeg?.arrival,
        },
        duration: returnLeg?.duration,
        stops: returnLeg?.stop_count || 0,
      } : null,
      total_price: {
        amount: priceAmount ?? null,
        currency: 'USD',
        deepLink: pricingOption?.items?.[0]?.url || null,
        agent: agent?.name || null,
      },
    };
  }).filter(Boolean);
}

// Keep existing tracking function
export async function getFlightByNumber({ flightNumber, airlineCode, date }) {
  const formattedDate = date.replace(/-/g, '');
  const url = `${BASE_URL}/airline/${API_KEY}?num=${flightNumber}&name=${airlineCode}&date=${formattedDate}`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`FlightAPI error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return normalizeTrackingResponse(data, flightNumber, airlineCode, date);
}

function normalizeTrackingResponse(data, flightNumber, airlineCode, date) {
  const dep = data.find((d) => d.departure)?.departure || {};
  const arr = data.find((d) => d.arrival)?.arrival || {};

  return {
    flight_date: date,
    flight_status: dep.offGroundTime ? 'active' : 'scheduled',
    airline: { name: dep.airport || airlineCode, iata: airlineCode },
    flight: { iata: `${airlineCode}${flightNumber}` },
    departure: {
      airport: dep.airport || '',
      iata: dep.airportCode || '',
      scheduled: dep.departureDateTime || dep.scheduledTime || null,
      actual: dep.offGroundTime || null,
      terminal: dep.terminal || null,
      gate: dep.gate || null,
    },
    arrival: {
      airport: arr.airport || '',
      iata: arr.airportCode || '',
      scheduled: arr.arrivalDateTime || arr.scheduledTime || null,
      actual: arr.onGroundTime || null,
      terminal: arr.terminal || null,
      gate: arr.gate || null,
      baggage: arr.baggage || null,
    },
  };
}