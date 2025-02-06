import {Sequelize} from 'sequelize';
import config from './config/database.config.js';
import {initUserModel} from "./models/user.model.js"
import pg from "pg";

export class AppDatabase {
    private static instance: AppDatabase;
    private readonly sequelize: Sequelize;

    public static getInstance(): AppDatabase {
        if (!AppDatabase.instance) {
            AppDatabase.instance = new AppDatabase();
        }
        return AppDatabase.instance;
    }

    private constructor() {
        this.sequelize = new Sequelize({
            ...config,
            logging: process.env.NODE_ENV !== 'production' ? console.log : false,
        });
    }

    private async createDatabaseIfNotExists() {
        const {database, username, password, host, port} = config;

        // Connect to postgres database to create new db
        const client = new pg.Client({
            host,
            port,
            user: username,
            password,
            database : "postgres",
        });

        try {
            await client.connect();
            const res = await client.query(
                `SELECT 1
                 FROM pg_database
                 WHERE datname = '${database}'`
            );

            if (res.rowCount === 0) {
                await client.query(`CREATE DATABASE "${database}"`);
                console.log(`Database ${database} created successfully`);
            }
        } catch (err) {
            console.error('Error creating database:', err);
            throw err;
        } finally {
            await client.end();
        }
    }

    public async initialize() {
        try {
            await this.createDatabaseIfNotExists();

            // Initialize models
            this.initializeModels();

            // Test the connection
            await this.sequelize.authenticate();
            console.log('Database connection established successfully');

            await this.syncChanges();
        } catch (err) {
            console.error('Unable to connect to the database:', err);
            throw err;
        }
    }


    private initializeModels() {
        initUserModel(this.sequelize);
        // Add other model initializations here
    }

    private async syncChanges() {
        if (process.env.NODE_ENV === 'development') {
            // Only sync in development, for production use migrations
            await this.sequelize.sync({force: true});
        }
    }

    public getSequelize(): Sequelize {
        return this.sequelize;
    }
}