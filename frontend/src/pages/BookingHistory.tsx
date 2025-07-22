import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, MapPin, Clock, User, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { bookingApi } from '../services/api';

interface Booking {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  customer_id: string;
  from_pincode: string;
  to_pincode: string;
  start_time: string;
  end_time: string;
  estimated_ride_duration_hours: string;
  created_at: string;
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingApi.getAll();
      setBookings(data);
    } catch (error: any) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setIsDeleting(bookingId);
      await bookingApi.delete(bookingId);
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setIsDeleting(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookingStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', label: 'Upcoming' };
    } else if (now >= start && now <= end) {
      return { status: 'active', color: 'bg-green-100 text-green-800', label: 'Active' };
    } else {
      return { status: 'completed', color: 'bg-gray-100 text-gray-800', label: 'Completed' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Booking History</h2>
                <p className="text-sm text-gray-600">Manage your vehicle bookings</p>
              </div>
            </div>
            <button
              onClick={fetchBookings}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">
                You haven't made any vehicle bookings yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const status = getBookingStatus(booking.start_time, booking.end_time);
                return (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.vehicle_name || 'Vehicle'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                      {status.status === 'upcoming' && (
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          disabled={isDeleting === booking.id}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isDeleting === booking.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Cancel
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        <div>
                          <span className="text-gray-500">From:</span>
                          <br />
                          <span className="font-medium">{booking.from_pincode}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <div>
                          <span className="text-gray-500">To:</span>
                          <br />
                          <span className="font-medium">{booking.to_pincode}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <div>
                          <span className="text-gray-500">Start:</span>
                          <br />
                          <span className="font-medium">
                            {format(new Date(booking.start_time), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <br />
                          <span className="font-medium">{parseFloat(booking.estimated_ride_duration_hours)}h</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Booked on {format(new Date(booking.created_at), 'MMM dd, yyyy HH:mm')} • 
                        Customer: {booking.customer_id}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}