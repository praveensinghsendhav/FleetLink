import { KnexConfig as db } from '../../config/knex.config';
import { Vehicle, CreateVehicleRequest, AvailableVehicle } from '../types/interfaces/Vehicle';
import { calculateRideDuration } from '../utils/rideDuration';

class VehicleService {

  constructor() { }
  private static instance: VehicleService;
  static getInstance(): VehicleService {
    if (!VehicleService.instance) {
      VehicleService.instance = new VehicleService();
    }
    return VehicleService.instance;
  }


  async createVehicle(vehicleData: CreateVehicleRequest): Promise<Vehicle> {
    const [vehicle] = await db('vehicles')
      .insert({
        name: vehicleData.name,
        capacity_kg: vehicleData.capacityKg,
        tyres: vehicleData.tyres,
      })
      .returning('*');

    return vehicle;
  }

  async findAvailableVehicles(
    capacityRequired: number,
    fromPincode: string,
    toPincode: string,
    startTime: Date
  ): Promise<AvailableVehicle[]> {
    // Calculate ride duration
    const estimatedRideDurationHours = calculateRideDuration(fromPincode, toPincode);
    const endTime = new Date(startTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000);

    // Find vehicles with sufficient capacity
    const capacityQuery = db('vehicles')
      .select('*')
      .where('capacity_kg', '>=', capacityRequired);

    // Find vehicles that have conflicting bookings
    const conflictingVehiclesQuery = db('bookings')
      .select('vehicle_id')
      .where(function () {
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

    // Get available vehicles (those with capacity minus those with conflicts)
    const vehicles = await capacityQuery;
    const conflictingVehicleIds = await conflictingVehiclesQuery;
    const conflictingIds = new Set(conflictingVehicleIds.map(v => v.vehicle_id));

    const availableVehicles: AvailableVehicle[] = vehicles
      .filter(vehicle => !conflictingIds.has(vehicle.id))
      .map(vehicle => ({
        ...vehicle,
        estimatedRideDurationHours
      }));

    return availableVehicles;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await db('vehicles').select('*').orderBy('created_at', 'desc');
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const vehicle = await db('vehicles').where('id', id).first();
    return vehicle || null;
  }
}


const vehicleService = VehicleService.getInstance();

export { vehicleService as VehicleService };