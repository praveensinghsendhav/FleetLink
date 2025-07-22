import { Router } from '../types/classes/router.class';
import { VehicleController } from '../controller/VehicleController';
import { validateCreateVehicle, validateAvailabilityQuery } from '../middleware/validation';

export class VehiclesRouter extends Router {
    constructor() {
        super();
    }

    define(): void {
        // POST /api/vehicles - Create a new vehicle
        this.router.post('/', validateCreateVehicle, VehicleController.createVehicle);

        // GET /api/vehicles/available - Find available vehicles
        this.router.get('/available', validateAvailabilityQuery, VehicleController.availableVehicle);

        // GET /api/vehicles - Get all vehicles
        this.router.get('/', VehicleController.getAllVehicle);

    }
}