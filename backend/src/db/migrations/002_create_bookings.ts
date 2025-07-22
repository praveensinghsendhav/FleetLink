import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bookings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('vehicle_id').notNullable();
    table.string('customer_id').notNullable();
    table.string('from_pincode').notNullable();
    table.string('to_pincode').notNullable();
    table.timestamp('start_time').notNullable();
    table.timestamp('end_time').notNullable();
    table.decimal('estimated_ride_duration_hours', 8, 2).notNullable();
    table.timestamps(true, true);

    table.foreign('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE');
    table.index(['vehicle_id', 'start_time', 'end_time']);
    table.index(['start_time', 'end_time']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('bookings');
}