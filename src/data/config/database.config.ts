export default {
    username: process.env.DB_USERNAME ?? throwError('DB_USERNAME'),
    password: process.env.DB_PASSWORD ?? throwError('DB_PASSWORD'),
    database: process.env.DB_NAME ?? throwError('DB_NAME'),
    host: process.env.DB_HOSTNAME ?? throwError('DB_HOSTNAME'),
    port: parseInt(process.env.DB_PORT ?? throwError('DB_PORT')),
    dialect: "postgres",
} as const;


function throwError(varName: string): never {
    throw new Error(`Missing required environment variable: ${varName}`);
}