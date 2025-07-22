export interface Booking {
  id: string;
  vehicle_id: string;
  customer_id: string;
  from_pincode: string;
  to_pincode: string;
  start_time: Date;
  end_time: Date;
  estimated_ride_duration_hours: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateBookingRequest {
  vehicleId: string;
  fromPincode: string;
  toPincode: string;
  startTime: string; // ISO string
  customerId: string;
}

export interface BookingConflict {
  hasConflict: boolean;
  conflictingBookings?: Booking[];
}