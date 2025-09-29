// IMPORTS
import Pool from 'pg';
import "dotenv/config.js";

// DB SETTINGS
export const pool = new Pool.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});