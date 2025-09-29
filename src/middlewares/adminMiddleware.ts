// IMPORTS
import { Request, Response} from "express";
import jwt from 'jsonwebtoken';
import secret from '../config/config.js';

export default function (role) {
    return function (req: Request, res: Response, next) {
        if(req.method === "OPTIONS") return next();

        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(403).json({message: "Not authorized!"});

            const token = authHeader.split(' ')[1];
            if(!token) return res.status(403).json({message: "Not authorized!"});

            const decodedToken = jwt.verify(token, secret.secret) as { id: number, role: string};
            if(decodedToken.role.toLowerCase() !== role)
                return res.status(403).json({message: "This function available only for admins!"});
            next();
        } catch (e) {
            console.error(e);
            res.status(500).json({message: "Middleware: Server error", error: e.message});
        }
    }
}