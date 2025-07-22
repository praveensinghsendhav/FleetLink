import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('bookings').del();
  await knex('vehicles').del();

  // Insert vehicles
  await knex('vehicles').insert([
    {
      name: 'Truck Alpha',
      capacity_kg: 5000,
      tyres: 6,
    },
    {
      name: 'Van Beta',
      capacity_kg: 2000,
      tyres: 4,
    },
    {
      name: 'Truck Gamma',
      capacity_kg: 8000,
      tyres: 10,
    },
    {
      name: 'Mini Van',
      capacity_kg: 1000,
      tyres: 4,
    },
    {
      name: 'Heavy Loader',
      capacity_kg: 12000,
      tyres: 12,
    },
    {
      name: 'City Delivery',
      capacity_kg: 1500,
      tyres: 4,
    },
    {
      name: 'Express Cargo',
      capacity_kg: 3000,
      tyres: 6,
    },
  ]);
}