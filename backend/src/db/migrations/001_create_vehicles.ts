import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('vehicles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.integer('capacity_kg').notNullable();
    table.integer('tyres').notNullable();
    table.timestamps(true, true);

    table.index(['capacity_kg']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('vehicles');
}