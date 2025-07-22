import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Get some vehicles to create sample bookings
  const vehicles = await knex('vehicles').select('id').limit(3);
  
  if (vehicles.length === 0) return;

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  await knex('bookings').insert([
    {
      vehicle_id: vehicles[0].id,
      customer_id: 'customer_001',
      from_pincode: '100001',
      to_pincode: '100005',
      start_time: tomorrow,
      end_time: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
      estimated_ride_duration_hours: 4,
    },
    {
      vehicle_id: vehicles[1].id,
      customer_id: 'customer_002',
      from_pincode: '100010',
      to_pincode: '100020',
      start_time: dayAfter,
      end_time: new Date(dayAfter.getTime() + 10 * 60 * 60 * 1000), // 10 hours later
      estimated_ride_duration_hours: 10,
    },
  ]);
}