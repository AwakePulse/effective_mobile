// IMPORTS
import { pool as db }  from '../db/db.js';
import { Request, Response} from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from '../config/config.js';
import {validationResult} from "express-validator";

// FUNCTION FOR GENERATE ACCESS TOKEN
const generateAuthToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, secret.secret, {expiresIn: "24h"});
}

class UserController {
    async createUser(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Errors in registration!', errors})
            }

            const {full_name, email, birthday, password} = req.body;
            const regUser = await db.query(`SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)`, [email]);
            if(regUser.rows[0].exists) {
                return res.status(400).json({message: 'The user with this email is exists!'});
            }

            const hashPassword = await bcrypt.hash(password, 5);
            const user = await db.query(`INSERT INTO users (full_name, email, birthday, password) VALUES ($1, $2, $3, $4) RETURNING *`,
                [full_name, email, birthday, hashPassword]);

            return res.status(200).json({message: 'User was created!', user: user.rows[0]});
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Controller: Server error", error: e.message});
        }
    }

    async authUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if(!user.rows[0]) {
                return res.status(400).json({message: `User with email - ${email} not found!`});
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if(!validPassword) {
                return res.status(400).json({message: "Auth failure. Incorrect password!"});
            }

            const token = generateAuthToken(user.rows[0].id, user.rows[0].role);
            return res.status(200).json({token});
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Controller: Server error", error: e.message});
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const receivedId = req.params.id;
            const { id, role } = req.auth;

            if(!(id === Number(receivedId) || role.toLowerCase() === 'admin')) {
                return res.status(403).json({message: "You don't have access!"})
            }

            const userById = await db.query(`SELECT * FROM users WHERE id = $1`, [receivedId]);
            return res.status(200).json({user: userById.rows[0]})
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Controller: Server error", error: e.message});
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await db.query(`SELECT * FROM users`);
            return res.status(200).json({users: users.rows});
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Controller: Server error", error: e.message});
        }
    }

    async blockUsers(req: Request, res: Response) {
        try {
            const receivedId = req.params.id;
            const { id, role } = req.auth;

            if(!(id === Number(receivedId) || role.toLowerCase() === 'admin')) {
                return res.status(403).json({message: "You don't have access!"})
            }

            const blockedUser = await db.query(`UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING *`, [receivedId]);
            return res.status(200).json({message: 'The user was banned!', user: blockedUser.rows[0]})
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Controller: Server error", error: e.message});
        }
    }
}

export default new UserController();