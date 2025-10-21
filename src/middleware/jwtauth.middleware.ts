import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request{
    user?:any;
}

export class AuthMiddleware {
    static authenticateUser(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
    }
}

export const jwtAuth = AuthMiddleware.authenticateUser

