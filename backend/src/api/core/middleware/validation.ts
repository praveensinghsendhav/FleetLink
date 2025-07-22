import { Request, Response, NextFunction } from 'express';

export const validateCreateVehicle = (req: Request, res: Response, next: NextFunction) => {
  const { name, capacityKg, tyres } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Name is required and must be a string' });
    return;
  }

  if (!capacityKg || typeof capacityKg !== 'number' || capacityKg <= 0) {
    res.status(400).json({ error: 'Capacity (capacityKg) is required and must be a positive number' });
    return;
  }

  if (!tyres || typeof tyres !== 'number' || tyres <= 0) {
    res.status(400).json({ error: 'Tyres count is required and must be a positive number' });
    return;
  }

  next();
};

export const validateAvailabilityQuery = (req: Request, res: Response, next: NextFunction) => {
  const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

  if (!capacityRequired || isNaN(Number(capacityRequired)) || Number(capacityRequired) <= 0) {
    res.status(400).json({ error: 'capacityRequired must be a positive number' });
    return;
  }

  if (!fromPincode || typeof fromPincode !== 'string') {
    res.status(400).json({ error: 'fromPincode is required' });
    return;
  }

  if (!toPincode || typeof toPincode !== 'string') {
    res.status(400).json({ error: 'toPincode is required' });
    return;
  }

  if (!startTime || typeof startTime !== 'string') {
    res.status(400).json({ error: 'startTime is required' });
    return;
  }

  const startTimeDate = new Date(startTime);
  if (isNaN(startTimeDate.getTime())) {
    res.status(400).json({ error: 'startTime must be a valid ISO date string' });
    return;
  }

  next();
};

export const validateCreateBooking = (req: Request, res: Response, next: NextFunction): void => {
  const { vehicleId, fromPincode, toPincode, startTime, customerId } = req.body;

  if (!vehicleId || typeof vehicleId !== 'string') {
    res.status(400).json({ error: 'vehicleId is required and must be a string' });
    return;
  }

  if (!fromPincode || typeof fromPincode !== 'string') {
    res.status(400).json({ error: 'fromPincode is required' });
    return;
  }

  if (!toPincode || typeof toPincode !== 'string') {
    res.status(400).json({ error: 'toPincode is required' });
    return;
  }

  if (!startTime || typeof startTime !== 'string') {
    res.status(400).json({ error: 'startTime is required' });
    return;
  }

  const startTimeDate = new Date(startTime);
  if (isNaN(startTimeDate.getTime())) {
    res.status(400).json({ error: 'startTime must be a valid ISO date string' });
    return;
  }

  if (!customerId || typeof customerId !== 'string') {
    res.status(400).json({ error: 'customerId is required' });
    return;
  }

  next();
};