import * as Express from 'express'
import { ProxyRouter } from '../core/services';
import { NextFunction, Request, Response } from 'express';
import Helpers from '../core/utils/helpers.utils';
import * as morgan from 'morgan';
import * as  cookieParser from 'cookie-parser';
import * as  cors from "cors";
import * as session from 'express-session';
export class ExpressConfiguration {
    private static instance: ExpressConfiguration;
    application: Express.Application;

    private constructor() { };

    static get(): ExpressConfiguration {
        if (!ExpressConfiguration.instance) {
            ExpressConfiguration.instance = new ExpressConfiguration();
        }
        return ExpressConfiguration.instance;
    }

    init(): ExpressConfiguration {
        if (!this.application) {
            this.application = Express();
        }
        return this;
    }
    plug(): ExpressConfiguration {

        const corsOptions = {
            origin: `http://${process.env.FRONTEND}`, // Allow requests from this origin
            methods: 'GET,POST,PUT,DELETE',
            credentials: true, // Allow credentials (cookies, authorization headers, etc.) 
            allowedHeaders: ['Content-Type', 'Authorization'],
        };
        this.application.use(cors(corsOptions));
        this.application.use(cookieParser());
        this.application.use(morgan("dev"));
        this.application.use(Express.json());
        this.application.use(Express.urlencoded({ extended: true }));
        this.application.use(
            session({
                secret: process.env.SESSION_SECRETE, // Replace with your secret key
                resave: false, // Avoid saving sessions that haven't been modified
                saveUninitialized: false, // Avoid creating sessions until something is stored
                cookie: { secure: false } // Use true if using HTTPS
            })
        );

        this.application.use(`/api/${process.env.API_VERSION}`, ProxyRouter.map());
        // Not Found Middleware
        this.application.use((req: Request, res: Response, next: NextFunction) => {
            const error = new Error("Not Found") as { status?: number };
            error.status = 404; // Set the status to 404 for not found errors
            next(error);
        });

        // Error Handling Middleware
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.application.use((err: { status?: number; message: string }, req: Request, res: Response, next: NextFunction) => {
            const status = err.status || 500; // Default to 500 if status is not set
            res.status(status).json(Helpers.responseHandler(status, undefined, undefined, err.message));
        });

        return this;
    }
}

const Application = ExpressConfiguration.get()
    .init()
    .plug()
    .application;
export {
    Application
};