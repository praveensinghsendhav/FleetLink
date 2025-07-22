import React, { useState } from 'react';
import { Search, Loader2, Truck, Clock, Weight, ShipWheel as Wheel, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vehicleApi, bookingApi } from '../services/api';

interface SearchForm {
  capacityRequired: number;
  fromPincode: string;
  toPincode: string;
  startTime: string;
}

interface AvailableVehicle {
  id: string;
  name: string;
  capacity_kg: number;
  tyres: number;
  estimatedRideDurationHours: number;
}

interface FormErrors {
  capacityRequired?: string;
  fromPincode?: string;
  toPincode?: string;
  startTime?: string;
}

export function SearchAndBook() {
  const [searchForm, setSearchForm] = useState<SearchForm>({
    capacityRequired: 0,
    fromPincode: '',
    toPincode: '',
    startTime: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState<AvailableVehicle[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const validateSearchForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!searchForm.capacityRequired || searchForm.capacityRequired <= 0) {
      newErrors.capacityRequired = 'Capacity required must be greater than 0';
    }

    if (!searchForm.fromPincode.trim()) {
      newErrors.fromPincode = 'From pincode is required';
    } else if (!/^\d{6}$/.test(searchForm.fromPincode)) {
      newErrors.fromPincode = 'Pincode must be 6 digits';
    }

    if (!searchForm.toPincode.trim()) {
      newErrors.toPincode = 'To pincode is required';
    } else if (!/^\d{6}$/.test(searchForm.toPincode)) {
      newErrors.toPincode = 'Pincode must be 6 digits';
    }

    if (!searchForm.startTime) {
      newErrors.startTime = 'Start time is required';
    } else {
      const startDate = new Date(searchForm.startTime);
      const now = new Date();
      if (startDate <= now) {
        newErrors.startTime = 'Start time must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSearchForm()) {
      return;
    }

    setIsSearching(true);
    setBookingStatus({ status: 'idle', message: '' });

    try {
      const vehicles = await vehicleApi.findAvailable({
        capacityRequired: searchForm.capacityRequired,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime,
      });

      setAvailableVehicles(vehicles);
      setSearchPerformed(true);
    } catch (error: any) {
      console.error('Search error:', error);
      setAvailableVehicles([]);
      setSearchPerformed(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBooking = async (vehicleId: string) => {
    setIsBooking(true);
    setBookingStatus({ status: 'idle', message: '' });

    try {
      await bookingApi.create({
        vehicleId,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime,
        customerId: `customer_${Date.now()}`, // Simplified customer ID
      });

      setBookingStatus({
        status: 'success',
        message: 'Booking created successfully!',
      });

      // Refresh search results
      const vehicles = await vehicleApi.findAvailable({
        capacityRequired: searchForm.capacityRequired,
        fromPincode: searchForm.fromPincode,
        toPincode: searchForm.toPincode,
        startTime: searchForm.startTime,
      });
      setAvailableVehicles(vehicles);
    } catch (error: any) {
      setBookingStatus({
        status: 'error',
        message: error.response?.data?.error || 'Failed to create booking',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleInputChange = (field: keyof SearchForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'capacityRequired' ? Number(e.target.value) : e.target.value;
    setSearchForm(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Get current date-time for min attribute
  const now = new Date();
  const minDateTime = format(now, "yyyy-MM-dd'T'HH:mm");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Search Available Vehicles</h2>
              <p className="text-sm text-gray-600">Find vehicles that match your requirements</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="capacityRequired" className="block text-sm font-medium text-gray-700 mb-2">
                Capacity Required (KG)
              </label>
              <input
                type="number"
                id="capacityRequired"
                value={searchForm.capacityRequired || ''}
                onChange={handleInputChange('capacityRequired')}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.capacityRequired ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., 2000"
              />
              {errors.capacityRequired && (
                <p className="mt-1 text-sm text-red-600">{errors.capacityRequired}</p>
              )}
            </div>

            <div>
              <label htmlFor="fromPincode" className="block text-sm font-medium text-gray-700 mb-2">
                From Pincode
              </label>
              <input
                type="text"
                id="fromPincode"
                value={searchForm.fromPincode}
                onChange={handleInputChange('fromPincode')}
                maxLength={6}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fromPincode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="100001"
              />
              {errors.fromPincode && (
                <p className="mt-1 text-sm text-red-600">{errors.fromPincode}</p>
              )}
            </div>

            <div>
              <label htmlFor="toPincode" className="block text-sm font-medium text-gray-700 mb-2">
                To Pincode
              </label>
              <input
                type="text"
                id="toPincode"
                value={searchForm.toPincode}
                onChange={handleInputChange('toPincode')}
                maxLength={6}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.toPincode ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="100010"
              />
              {errors.toPincode && (
                <p className="mt-1 text-sm text-red-600">{errors.toPincode}</p>
              )}
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={searchForm.startTime}
                onChange={handleInputChange('startTime')}
                min={minDateTime}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSearching}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSearching ? 'Searching...' : 'Search Vehicles'}
            </button>
          </div>
        </form>
      </div>

      {/* Booking Status */}
      {bookingStatus.status !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          bookingStatus.status === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {bookingStatus.status === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span className="text-sm font-medium">{bookingStatus.message}</span>
        </div>
      )}

      {/* Search Results */}
      {searchPerformed && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Vehicles ({availableVehicles.length})
            </h3>
          </div>

          <div className="p-6">
            {availableVehicles.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles available</h3>
                <p className="text-gray-600">
                  No vehicles match your criteria for the selected time slot.
                  Try adjusting your search parameters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{vehicle.name}</h4>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Weight className="w-4 h-4 mr-2" />
                        <span>Capacity: {vehicle.capacity_kg.toLocaleString()} KG</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Wheel className="w-4 h-4 mr-2" />
                        <span>Tyres: {vehicle.tyres}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Estimated Duration: {vehicle.estimatedRideDurationHours}h</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBooking(vehicle.id)}
                      disabled={isBooking}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isBooking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {isBooking ? 'Booking...' : 'Book Now'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}