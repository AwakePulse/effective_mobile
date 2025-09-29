import { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        auth?: {
            id: number;
            role: string;
        } | JwtPayload;
    }
}