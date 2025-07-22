import { Router } from '../types/classes/router.class';
import { validateCreateBooking } from '../middleware/validation';
import { BookingController } from '../controller/BookingController';

export class BookingsRouter extends Router {
    constructor() {
        super();
    }

    define(): void {
        // POST /api/bookings - Create a new booking
        this.router.post('/', validateCreateBooking, BookingController.createBooking);

        // GET /api/bookings - Get all bookings
        this.router.get('/', BookingController.getBookings);

        // DELETE /api/bookings/:id - Cancel a booking
        this.router.delete('/:id', BookingController.delete);

    }
}