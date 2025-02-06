//most of these have a default value, so it's not necessary to set env variables for these.
//The only exception is password, because the postgres server will need you to set up a password, so those 2 should be in sync

export default {
    username: process.env.DB_USERNAME = "postgres",
    password: process.env.DB_PASSWORD ?? throwError('DB_PASSWORD'),
    database: process.env.DB_NAME = "glados_dev_db",
    host: process.env.DB_HOSTNAME = "localhost",
    port: parseInt(process.env.DB_PORT = "5432"),
    dialect: "postgres",
} as const;


function throwError(varName: string): never {
    throw new Error(`Missing required environment variable: ${varName}`);
}