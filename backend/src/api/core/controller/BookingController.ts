import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/BookingService';
import { VehicleService } from '../services/VehicleService';

class BookingController {
    private static instance: BookingController;
    constructor() { }

    static getInstance(): BookingController {
        if (!BookingController.instance) {
            BookingController.instance = new BookingController();
        }
        return BookingController.instance;
    }

    async createBooking(req: Request, res: Response) {
        try {
            // Check if vehicle exists
            const vehicle = await VehicleService.getVehicleById(req.body.vehicleId);
            if (!vehicle) {
                res.status(404).json({ error: 'Vehicle not found' });
                return;
            }

            const booking = await BookingService.createBooking(req.body);
            res.status(201).json(booking);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error instanceof Error && error.message.includes('already booked')) {
                res.status(409).json({ error: error.message });
            } else if (error instanceof Error && error.message.includes('Invalid pincode')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const deleted = await BookingService.deleteBooking(req.params.id);
            if (!deleted) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.status(204).json({ "message": "Booking Canceled Succesfully" });
        } catch (error) {
            console.error('Error deleting booking:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getBookings(req: Request, res: Response) {
        try {
            const bookings = await BookingService.getAllBookings();
            res.json(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

const bookingController = BookingController.getInstance();

export { bookingController as BookingController };