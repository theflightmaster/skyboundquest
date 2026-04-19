// 'use client';

// import { useState } from 'react';
// import FlightTrackingForm from '@/components/FlightTrackingForm';
// import FlightTrackingResults from '@/components/FlightTrackingResults';
// import Footer from '@/components/Footer';
// import { Plane, MapPin, Award, Headphones } from 'lucide-react';
// import Image from 'next/image';

// export default function TrackFlightPage() {
//   const [trackingResult, setTrackingResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleTrack = async (flightNumber, flightDate) => {
//     setLoading(true);
//     setError(null);
//     setTrackingResult(null);

//     try {
//       let airlineCode = '';
//       let number = '';
      
//       const cleaned = flightNumber.toUpperCase().replace(/\s/g, '');
//       const match = cleaned.match(/^([A-Z]{2})(\d+)$/);
      
//       if (match) {
//         airlineCode = match[1];
//         number = match[2];
//       } else {
//         throw new Error('Invalid flight number format. Use format like "DL33" or "UA123"');
//       }

//       const response = await fetch(`/api/flights/track?flightNumber=${number}&airlineCode=${airlineCode}&date=${flightDate}`);
//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Flight not found');
//       }

//       setTrackingResult(data.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setTrackingResult(null);
//     setError(null);
//   };

//   // Loading spinner for results area only
//     const ResultsLoadingSpinner = () => (
//     <div className="flex flex-col items-center justify-center py-16">
//     <div className="relative">
//         <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
//         <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-600 border-r-purple-500 border-b-indigo-500 border-l-transparent rounded-full animate-spin"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//         <div className="animate-bounce">
//             <Plane size={24} className="text-blue-600" />
//         </div>
//         </div>
//         <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
//         <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
//     </div>
//     <div className="mt-6 text-center">
//         <p className="text-gray-700 font-semibold">Searching for {selectedCabin} flights...</p>
//         <p className="text-gray-400 text-sm mt-1">Finding the best deals for you</p>
//     </div>
//     </div>
//     );

//   return (
//     <div>
//       {/* Hero Section with Background Image */}
//       <section className="relative min-h-[60vh] flex items-center overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2074"
//             alt="Airplane flying over city"
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95"></div>
//         </div>

//         <div className="absolute inset-0 z-0 overflow-hidden">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
//           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
//         </div>

//         <div className="relative z-10 container mx-auto px-4 py-20 md:py-24">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
//               <MapPin className="text-yellow-400" size={18} />
//               <span className="text-white text-sm font-medium">Real-Time Flight Tracking</span>
//             </div>
            
//             <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
//               Track Your
//               <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Flight</span>
//             </h1>
            
//             <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
//               Get real-time updates on flight status, departure and arrival times, gates, and more
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
//               <div className="flex items-center gap-2 text-white/80">
//                 <div className="bg-white/10 rounded-full p-2">
//                   <Plane size={20} />
//                 </div>
//                 <span className="text-sm">Live Updates</span>
//               </div>
//               <div className="flex items-center gap-2 text-white/80">
//                 <div className="bg-white/10 rounded-full p-2">
//                   <MapPin size={20} />
//                 </div>
//                 <span className="text-sm">Real-Time Status</span>
//               </div>
//               <div className="flex items-center gap-2 text-white/80">
//                 <div className="bg-white/10 rounded-full p-2">
//                   <Headphones size={20} />
//                 </div>
//                 <span className="text-sm">24/7 Support</span>
//               </div>
//             </div>
//           </div>

//           <div className="max-w-3xl mx-auto">
//             {loading ? (
//               <ResultsLoadingSpinner />
//             ) : !trackingResult ? (
//               <FlightTrackingForm onTrack={handleTrack} loading={loading} error={error} />
//             ) : (
//               <FlightTrackingResults trackingResult={trackingResult} onReset={handleReset} />
//             )}
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16 pt-8 border-t border-white/20">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white">500K+</div>
//               <div className="text-blue-200 text-sm mt-1">Happy Customers</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white">100K+</div>
//               <div className="text-blue-200 text-sm mt-1">Daily Flights</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white">95%</div>
//               <div className="text-blue-200 text-sm mt-1">Satisfaction Rate</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-white">24/7</div>
//               <div className="text-blue-200 text-sm mt-1">Customer Support</div>
//             </div>
//           </div>
//         </div>

//         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
//             <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// }