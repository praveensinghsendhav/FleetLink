import axios from 'axios';

const API_BASE_URL = 'http://localhost:8101/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Vehicle {
  id: string;
  name: string;
  capacity_kg: number;
  tyres: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVehicleRequest {
  name: string;
  capacityKg: number;
  tyres: number;
}

export interface AvailableVehicle extends Vehicle {
  estimatedRideDurationHours: number;
}

export interface FindAvailableRequest {
  capacityRequired: number;
  fromPincode: string;
  toPincode: string;
  startTime: string;
}

export interface Booking {
  id: string;
  vehicle_id: string;
  vehicle_name?: string;
  customer_id: string;
  from_pincode: string;
  to_pincode: string;
  start_time: string;
  end_time: string;
  estimated_ride_duration_hours: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateBookingRequest {
  vehicleId: string;
  fromPincode: string;
  toPincode: string;
  startTime: string;
  customerId: string;
}

// Vehicle API
export const vehicleApi = {
  async create(data: CreateVehicleRequest): Promise<Vehicle> {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  async getAll(): Promise<Vehicle[]> {
    const response = await api.get('/vehicles');
    return response.data;
  },

  async findAvailable(params: FindAvailableRequest): Promise<AvailableVehicle[]> {
    const response = await api.get('/vehicles/available', { params });
    return response.data;
  },
};

// Booking API
export const bookingApi = {
  async create(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  async getAll(): Promise<Booking[]> {
    const response = await api.get('/bookings');
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },
};