'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlightCard from '@/components/FlightCard';
import Footer from '@/components/Footer';
import { SlidersHorizontal, TrendingUp, Clock, X, Calendar, Users, Repeat, Plane, Funnel, Armchair, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [paginatedFlights, setPaginatedFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('price');
  const [maxStops, setMaxStops] = useState('any');
  const [selectedCabin, setSelectedCabin] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState({ adults: 1, children: 0, infants: 0 });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const departure = searchParams.get('departure');
  const arrival = searchParams.get('arrival');
  const date = searchParams.get('date');
  const returnDate = searchParams.get('returnDate');
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const infants = searchParams.get('infants') || '0';
  const urlCabinClass = searchParams.get('cabinClass') || 'Economy';

  const cabinOptions = [
    { value: 'Economy', label: 'Economy Class', paramValue: 'Economy' },
    { value: 'Premium Economy', label: 'Premium Economy Class', paramValue: 'Premium_Economy' },
    { value: 'Business', label: 'Business Class', paramValue: 'Business' },
    { value: 'First', label: 'First Class', paramValue: 'First' },
  ];

  // Initialize selected cabin from URL - convert URL param to display label
  useEffect(() => {
    let displayCabin = 'Economy Class';
    if (urlCabinClass === 'Economy') displayCabin = 'Economy Class';
    else if (urlCabinClass === 'Premium_Economy') displayCabin = 'Premium Economy Class';
    else if (urlCabinClass === 'Business') displayCabin = 'Business Class';
    else if (urlCabinClass === 'First') displayCabin = 'First Class';
    setSelectedCabin(displayCabin);
  }, [urlCabinClass]);

  useEffect(() => {
    setPassengerInfo({
      adults: parseInt(adults),
      children: parseInt(children),
      infants: parseInt(infants)
    });
  }, [adults, children, infants]);

  // Fetch flights when cabin class changes
  useEffect(() => {
    if (departure && arrival && date) {
      fetchFlights();
    }
  }, [departure, arrival, date, returnDate, adults, children, infants, selectedCabin]);

  // Apply client-side filters (sort, stops, price) to fetched flights
  useEffect(() => {
    applyFiltersAndSort();
  }, [flights, sortBy, maxStops, priceRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredFlights.length]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedFlights(filteredFlights.slice(startIndex, endIndex));
  }, [filteredFlights, currentPage]);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Convert display label to API parameter
      let cabinParam = 'Economy';
      if (selectedCabin === 'Economy Class') cabinParam = 'Economy';
      else if (selectedCabin === 'Premium Economy Class') cabinParam = 'Premium_Economy';
      else if (selectedCabin === 'Business Class') cabinParam = 'Business';
      else if (selectedCabin === 'First Class') cabinParam = 'First';
      
      let url = `/api/flights/search?departure=${departure}&arrival=${arrival}&date=${date}&adults=${adults}&children=${children}&infants=${infants}&cabinClass=${cabinParam}`;
      if (returnDate) {
        url += `&returnDate=${returnDate}`;
      }
      
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Search failed');
      setFlights(json.data || []);
      
      const prices = (json.data || [])
        .map(f => f.type === 'round_trip' ? f.total_price?.amount : f.price?.amount)
        .filter(p => p);
      if (prices.length) {
        setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCabinChange = (cabinLabel, cabinParamValue) => {
    setSelectedCabin(cabinLabel);
    setCurrentPage(1);
    // Update URL without reload
    const params = new URLSearchParams(searchParams);
    params.set('cabinClass', cabinParamValue);
    router.push(`/flights/search?${params.toString()}`, { scroll: false });
  };

  const applyFiltersAndSort = () => {
    let result = [...flights];

    // Filter by stops
    if (maxStops !== 'any') {
      result = result.filter((f) => {
        const stops = f.type === 'round_trip' 
          ? (f.outbound.stops + (f.return?.stops || 0))
          : f.stops;
        return stops <= parseInt(maxStops);
      });
    }

    // Filter by price
    result = result.filter((f) => {
      const price = f.type === 'round_trip' ? f.total_price?.amount : f.price?.amount;
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort results
    result.sort((a, b) => {
      const priceA = a.type === 'round_trip' ? a.total_price?.amount : a.price?.amount;
      const priceB = b.type === 'round_trip' ? b.total_price?.amount : b.price?.amount;
      const durationA = a.type === 'round_trip' 
        ? (a.outbound.duration + (a.return?.duration || 0))
        : a.duration;
      const durationB = b.type === 'round_trip'
        ? (b.outbound.duration + (b.return?.duration || 0))
        : b.duration;
      
      if (sortBy === 'price') return (priceA ?? Infinity) - (priceB ?? Infinity);
      if (sortBy === 'duration') return (durationA ?? Infinity) - (durationB ?? Infinity);
      return 0;
    });

    setFilteredFlights(result);
  };

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredFlights.length);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading spinner for results area only
  const ResultsLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-indigo-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-bounce">
            <Plane size={24} className="text-indigo-600" />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-700 font-semibold">Searching for {selectedCabin} flights...</p>
        <p className="text-gray-400 text-sm mt-1">Finding the best deals for you</p>
      </div>
    </div>
  );

  const totalPassengers = passengerInfo.adults + passengerInfo.children + passengerInfo.infants;
  
  // Get display cabin class for summary
  let displayCabinClass = 'Economy Class';
  if (urlCabinClass === 'Economy') displayCabinClass = 'Economy Class';
  else if (urlCabinClass === 'Premium_Economy') displayCabinClass = 'Premium Economy Class';
  else if (urlCabinClass === 'Business') displayCabinClass = 'Business Class';
  else if (urlCabinClass === 'First') displayCabinClass = 'First Class';

  // Filter Sidebar Content Component (reused for both desktop and mobile)
  const FilterSidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-indigo-600" />
          <h3 className="font-bold text-lg text-gray-800">Filter Results</h3>
        </div>
        {isMobileMenuOpen && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Cabin Class Filter */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Cabin Class</label>
        <div className="space-y-2">
          <button
            onClick={() => handleCabinChange('Economy Class', 'Economy')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              selectedCabin === 'Economy Class'
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                : 'hover:bg-gray-50 text-gray-600 border border-transparent'
            }`}
          >
            <span className="font-medium">Economy Class</span>
          </button>
          
          <button
            onClick={() => handleCabinChange('Premium Economy Class', 'Premium_Economy')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              selectedCabin === 'Premium Economy Class'
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                : 'hover:bg-gray-50 text-gray-600 border border-transparent'
            }`}
          >
            <span className="font-medium">Premium Economy Class</span>
          </button>
          
          <button
            onClick={() => handleCabinChange('Business Class', 'Business')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              selectedCabin === 'Business Class'
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                : 'hover:bg-gray-50 text-gray-600 border border-transparent'
            }`}
          >
            <span className="font-medium">Business Class</span>
          </button>
          
          <button
            onClick={() => handleCabinChange('First Class', 'First')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              selectedCabin === 'First Class'
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                : 'hover:bg-gray-50 text-gray-600 border border-transparent'
            }`}
          >
            <span className="font-medium">First Class</span>
          </button>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
        <div className="space-y-2">
          <button
            onClick={() => setSortBy('price')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              sortBy === 'price'
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span className="font-medium">Cheapest First</span>
            <TrendingUp size={16} />
          </button>
          <button
            onClick={() => setSortBy('duration')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
              sortBy === 'duration'
                ? 'bg-gradient-to-r from-indigo-50 to-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span className="font-medium">Shortest First</span>
            <Clock size={16} />
          </button>
        </div>
      </div>

      {/* Max Stops */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Stops</label>
        <select
          value={maxStops}
          onChange={(e) => setMaxStops(e.target.value)}
          className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer bg-white"
        >
          <option value="any">Any number of stops</option>
          <option value="0">Direct flights only</option>
          <option value="1">Up to 1 stop</option>
          <option value="2">Up to 2 stops</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>${priceRange.min}</span>
          <span>${priceRange.max}</span>
        </div>
        <input
          type="range"
          min={0}
          max={5000}
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
    </>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 px-4 md:px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Flight Results</h1>
                <p className="text-indigo-100 text-sm mt-1">{filteredFlights.length} flights found</p>
              </div>
              {/* Mobile Filter Button - Hamburger Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all cursor-pointer"
              >
                <Menu size={18} />
                <span className="text-sm">Filters</span>
              </button>
            </div>
          </div>
           
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-2 md:gap-3">
                {/* <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  |
                </div> */}
                <div>
                  <p className="text-xs text-gray-500">Route</p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">{departure} → {arrival}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  |
                </div>
                <div>
                  <p className="text-xs text-gray-500">Departure</p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">{date}</p>
                </div>
              </div>
              
              {returnDate && (
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Repeat size={16} className="text-orange-600 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Return</p>
                    <p className="font-semibold text-gray-800 text-sm md:text-base">{returnDate}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  |
                </div>
                <div>
                  <p className="text-xs text-gray-500">Passengers</p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {passengerInfo.adults} Adult{passengerInfo.adults !== 1 ? 's' : ''}
                    {passengerInfo.children > 0 && `, ${passengerInfo.children} Child${passengerInfo.children !== 1 ? 'ren' : ''}`}
                    <span className="text-gray-500 text-xs ml-1">({totalPassengers} total)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
                  |
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cabin Class</p>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">{displayCabinClass}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center">
                <X size={16} className="text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-800 text-sm md:text-base">Search Error</p>
                <p className="text-red-600 text-xs md:text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sticky top-20">
              <FilterSidebarContent />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto animate-slideInRight">
                <div className="p-5">
                  <FilterSidebarContent />
                </div>
              </div>
            </>
          )}

          {/* Results Area with Loading Spinner */}
          <div className="flex-1">
            {loading ? (
              <ResultsLoadingSpinner />
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedFlights.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 text-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plane size={32} className="text-gray-400 md:w-10 md:h-10" />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or try a different cabin class</p>
                      <button
                        onClick={() => {
                          setMaxStops('any');
                          setPriceRange({ min: 0, max: 5000 });
                        }}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {paginatedFlights.map((flight, index) => (
                        <FlightCard key={flight.id || index} flight={flight} />
                      ))}
                    </>
                  )}
                </div>

                {/* Pagination */}
                {filteredFlights.length > itemsPerPage && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs md:text-sm text-gray-500">
                      Showing <span className="font-semibold text-gray-700">{startItem}</span> to{' '}
                      <span className="font-semibold text-gray-700">{endItem}</span> of{' '}
                      <span className="font-semibold text-gray-700">{filteredFlights.length}</span> flights
                    </div>
                    
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-all cursor-pointer text-sm md:text-base ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-indigo-200'
                        }`}
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {(() => {
                          const pages = [];
                          const maxVisible = 5;
                          let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                          let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                          
                          if (endPage - startPage + 1 < maxVisible) {
                            startPage = Math.max(1, endPage - maxVisible + 1);
                          }
                          
                          if (startPage > 1) {
                            pages.push(
                              <button
                                key={1}
                                onClick={() => goToPage(1)}
                                className="w-7 h-7 md:w-9 md:h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-all cursor-pointer text-sm"
                              >
                                1
                              </button>
                            );
                            if (startPage > 2) {
                              pages.push(<span key="dots1" className="px-1 text-gray-400 text-sm">...</span>);
                            }
                          }
                          
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <button
                                key={i}
                                onClick={() => goToPage(i)}
                                className={`w-7 h-7 md:w-9 md:h-9 rounded-lg transition-all cursor-pointer text-sm ${
                                  currentPage === i
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-600 text-white font-semibold shadow-md'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {i}
                              </button>
                            );
                          }
                          
                          if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                              pages.push(<span key="dots2" className="px-1 text-gray-400 text-sm">...</span>);
                            }
                            pages.push(
                              <button
                                key={totalPages}
                                onClick={() => goToPage(totalPages)}
                                className="w-7 h-7 md:w-9 md:h-9 rounded-lg text-gray-600 hover:bg-gray-100 transition-all cursor-pointer text-sm"
                              >
                                {totalPages}
                              </button>
                            );
                          }
                          
                          return pages;
                        })()}
                      </div>
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-all cursor-pointer text-sm md:text-base ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-indigo-200'
                        }`}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />  
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-indigo-200 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-indigo-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Plane size={32} className="text-indigo-600 animate-bounce" />
          </div>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}