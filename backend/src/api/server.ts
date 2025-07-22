// Import necessary modules and configurations
import 'module-alias/register';  // Register module paths
import { Server } from '../api/config/server.config';
import { Application } from '../api/config/app.config';
import { DbConfiguration } from '../api/config/knex.config';
import Database from './../db/connection';
import '@config/redis.config';

let application: typeof Application;
let server: unknown;

const db = new Database(DbConfiguration);
db.getConnection().then(() => {

    application = Application;
    server = Server.init(application).listen();

    console.log('Server started successfully.');
}).catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
})

export { application, server };