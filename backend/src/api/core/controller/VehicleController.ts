import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/VehicleService';

class VehicleController {
    private static instance: VehicleController;
    constructor() { }

    static getInstance(): VehicleController {
        if (!VehicleController.instance) {
            VehicleController.instance = new VehicleController();
        }
        return VehicleController.instance;
    }
    async createVehicle(req: Request, res: Response) {
        try {
            const vehicle = await VehicleService.createVehicle(req.body);
            res.status(201).json(vehicle);
        } catch (error) {
            console.error('Error creating vehicle:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async availableVehicle(req: Request, res: Response) {
        try {
            const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

            const availableVehicles = await VehicleService.findAvailableVehicles(
                Number(capacityRequired),
                fromPincode as string,
                toPincode as string,
                new Date(startTime as string)
            );

            res.json(availableVehicles);
        } catch (error) {
            console.error('Error finding available vehicles:', error);
            if (error instanceof Error && error.message.includes('Invalid pincode')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
    async getAllVehicle(req: Request, res: Response) {
        try {
            const vehicles = await VehicleService.getAllVehicles();
            res.json(vehicles);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

const vehicleController = VehicleController.getInstance();

export { vehicleController as VehicleController };