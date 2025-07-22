import { KnexConfig as db } from '../../config/knex.config';
import { Booking, CreateBookingRequest, BookingConflict } from '../types/interfaces/Booking';
import { calculateRideDuration } from '../utils/rideDuration';

class BookingService {
  constructor() { }
  private static instance: BookingService;
  static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    const startTime = new Date(bookingData.startTime);
    const estimatedRideDurationHours = calculateRideDuration(
      bookingData.fromPincode,
      bookingData.toPincode
    );
    const endTime = new Date(startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    // Check for conflicts before creating the booking
    const conflict = await this.checkBookingConflict(
      bookingData.vehicleId,
      startTime,
      endTime
    );

    if (conflict.hasConflict) {
      throw new Error('Vehicle is already booked for overlapping time slot');
    }

    const [booking] = await db('bookings')
      .insert({
        vehicle_id: bookingData.vehicleId,
        customer_id: bookingData.customerId,
        from_pincode: bookingData.fromPincode,
        to_pincode: bookingData.toPincode,
        start_time: startTime,
        end_time: endTime,
        estimated_ride_duration_hours: estimatedRideDurationHours,
      })
      .returning('*');

    return booking;
  }

  async checkBookingConflict(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<BookingConflict> {
    const conflictingBookings = await db('bookings')
      .where('vehicle_id', vehicleId)
      .andWhere(function () {
        this.where(function () {
          // Booking starts during our time window
          this.where('start_time', '>=', startTime)
            .andWhere('start_time', '<', endTime);
        })
          .orWhere(function () {
            // Booking ends during our time window
            this.where('end_time', '>', startTime)
              .andWhere('end_time', '<=', endTime);
          })
          .orWhere(function () {
            // Booking completely encompasses our time window
            this.where('start_time', '<=', startTime)
              .andWhere('end_time', '>=', endTime);
          });
      });

    return {
      hasConflict: conflictingBookings.length > 0,
      conflictingBookings
    };
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db('bookings')
      .select('bookings.*', 'vehicles.name as vehicle_name')
      .join('vehicles', 'bookings.vehicle_id', 'vehicles.id')
      .orderBy('bookings.start_time', 'desc');
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const booking = await db('bookings').where('id', id).first();
    return booking || null;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await db('bookings').where('id', id).del();
    return result > 0;
  }
}

const bookingService = BookingService.getInstance();

export { bookingService as BookingService };