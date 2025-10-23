import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export class UserController {
  //Register a new user
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, createdAt: true },
      });

      return res.status(201).json(user);
    } catch (error: any) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }

  //Login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error: any) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }

  //Get user profile
  static async profile(req: any, res: Response) {
    const user = req.user;

    try {
      const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { id: true, name: true, email: true, createdAt: true },
      });

      if (!profile) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(profile);
    } catch (error: any) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }
}
