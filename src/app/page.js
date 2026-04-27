'use client';

import FlightSearchForm from '@/components/FlightSearchForm';
import FlightTrackingForm from '@/components/FlightTrackingForm';
import Footer from '@/components/Footer';
import { Plane, Clock, CreditCard, Shield, Headphones, Globe, ArrowRight, Award, MapPin, Search, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2074"
            alt="Airplane flying over city"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95"></div>
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-30">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <Award className="text-yellow-400" size={18} />
              <span className="text-white text-sm font-medium">Trusted by 500,000+ Travelers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-12">
              Find Your Next
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Adventure</span>
            </h1>
            
          </div>

          <div className="max-w-5xl mx-auto">
            <FlightSearchForm />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500K+</div>
              <div className="text-blue-200 text-sm mt-1">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100K+</div>
              <div className="text-blue-200 text-sm mt-1">Daily Flights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-blue-200 text-sm mt-1">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-sm mt-1">Customer Support</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Flight Tracking Section */}
      <section id="track-flight" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2 mb-4">
              <MapPin size={18} className="text-indigo-600" />
              <span className="text-indigo-600 text-sm font-medium">Real-Time Tracking</span>
            </div> */}
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Track Your Flight
            </h2>
            {/* <p className="text-xl text-gray-600">
              Get real-time updates on flight status, departure and arrival times, gates, and more
            </p> */}
          </div>

          <div className="max-w-5xl mx-auto">
            <FlightTrackingForm />
          </div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2074"
            alt="World map background"
            fill
            className="object-cover opacity-10"
          />
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-300">
              Explore the world's most exciting destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                city: "New York",
                country: "United States",
                code: "JFK",
                price: "$299",
                image: "/newyork.jpg",
              },
              {
                city: "London",
                country: "United Kingdom",
                code: "LHR",
                price: "$399",
                image: "/london.jpg",
              },
              {
                city: "Tokyo",
                country: "Japan",
                code: "HND",
                price: "$499",
                image: "/tokyo.jpg",
              },
              {
                city: "Paris",
                country: "France",
                code: "CDG",
                price: "$349",
                image: "/paris.jpg",
              }
            ].map((dest, index) => (
              <div
                key={index}
                className="group relative rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
              >
                <div className="relative h-80">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{dest.city}</h3>
                  <p className="text-gray-200 text-sm mb-2">{dest.country}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* <div className="text-center mt-12">
            <Link href="/flights/search" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105">
              Explore All Destinations
              <ArrowRight size={18} />
            </Link>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}