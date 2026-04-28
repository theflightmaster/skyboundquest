'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, LogOut, Search, Trash2, Eye, Calendar, Users, Ticket, DollarSign, X } from 'lucide-react';
import AdminAuthCheck from '@/components/AdminAuthCheck';
import AdminFlightDetailsModal from '@/components/AdminFlightDetailsModal';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!isAuthenticated || !loginTime) {
      router.push('/admin/login');
      return;
    }

    // Optional: Check if session is older than 24 hours
    const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
    if (hoursSinceLogin > 24) {
      handleLogout();
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      const data = await response.json();
      
      if (response.ok) {
        setBookings(data.bookings);
        setFilteredBookings(data.bookings);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const searchLower = term.toLowerCase();
    const filtered = bookings.filter(booking => 
      booking.passenger.email.toLowerCase().includes(searchLower) ||
      booking.passenger.phone.includes(term) ||
      booking.bookingReference.toLowerCase().includes(searchLower) ||
      booking.passenger.fullName.toLowerCase().includes(searchLower)
    );
    setFilteredBookings(filtered);
  };

  const handleDelete = async (bookingId, bookingRef) => {
    if (!confirm(`Are you sure you want to delete booking ${bookingRef}?`)) {
      return;
    }

    setDeletingId(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings?bookingId=${bookingId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Refresh bookings list
        await fetchBookings();
        alert('Booking deleted successfully');
      } else {
        alert(data.error || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    router.push('/admin/login');
  };

  // Stats
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);
  const uniquePassengers = new Set(bookings.map(b => b.passenger.email)).size;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminAuthCheck />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Plane size={32} />
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-indigo-100 text-sm">Manage flight bookings</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 cursor-pointer hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                {/* <Ticket size={24} className="text-indigo-600" /> */}
                <span className="text-2xl font-bold text-blue-600">{totalBookings}</span>
              </div>
              <h3 className="text-gray-600 text-sm">Total Bookings</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                {/* <DollarSign size={24} className="text-green-600" /> */}
                <span className="text-2xl font-bold text-blue-600">₦ {(totalBookings * 20000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <h3 className="text-gray-600 text-sm">Total Revenue</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                {/* <Users size={24} className="text-blue-600" /> */}
                <span className="text-2xl font-bold text-blue-600">{uniquePassengers}</span>
              </div>
              <h3 className="text-gray-600 text-sm">Unique Passengers</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                {/* <Calendar size={24} className="text-purple-600" /> */}
                <span className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => new Date(b.bookingDate).toDateString() === new Date().toDateString()).length}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm">Today's Bookings</h3>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, phone number, booking reference, or passenger name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Passenger Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Flight Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Route</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Departure Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Booking Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-gray-800">{booking.bookingReference}</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">{booking.passenger.fullName}</td>
                        <td className="px-6 py-4 text-gray-600">{booking.passenger.email}</td>
                        <td className="px-6 py-4 text-gray-600">{booking.passenger.phone}</td>
                        <td className="px-6 py-4">
                          <span className="font-mono">{booking.flight.fullFlightNumber || `${booking.flight.airline.iata}${booking.flight.flightNumber}`}</span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.flight.departureAirport.iata} → {booking.flight.arrivalAirport.iata}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(booking.flight.departureDateRaw).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-600">${booking.amount.
                        toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(booking._id, booking.bookingReference)}
                              disabled={deletingId === booking._id}
                              className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete Booking"
                            >
                              {deletingId === booking._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Details Modal */}
      {isModalOpen && selectedBooking && (
        <AdminFlightDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </>
  );
}