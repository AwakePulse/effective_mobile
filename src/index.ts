// IMPORTS
import express from 'express';
import userRouters from "./routers/user.routers.js";
import initDatabase from './db/init.js';
import "dotenv/config.js";

// CREATE SERVER
const PORT: number = Number(process.env.PORT) || 5000;
const app = express();

// SERVER SETTINGS
app.use(express.json());

// API
app.use('/effective_mobile', userRouters)

// SERVER START
async function startApp() {
    try {
        await initDatabase();
        app.listen(PORT, () => console.log(`SERVER START`));
    } catch (e) {
        throw e;
    }
}

startApp();