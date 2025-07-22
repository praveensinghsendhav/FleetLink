export interface Vehicle {
  id: string;
  name: string;
  capacity_kg: number;
  tyres: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateVehicleRequest {
  name: string;
  capacityKg: number;
  tyres: number;
}

export interface AvailableVehicle extends Vehicle {
  estimatedRideDurationHours: number;
}