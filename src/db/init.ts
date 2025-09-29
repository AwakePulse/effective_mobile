// IMPORTS
import {pool as db} from "./db.js";

export default async function () {
    await db.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        birthday DATE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(10) DEFAULT 'user' CHECK (role in ('user', 'admin')),
        is_active Boolean DEFAULT TRUE
        );
    `);
    console.log('User table was created!');
}
