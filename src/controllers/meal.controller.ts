import { Response } from "express";
import { AuthRequest } from "../middleware/jwtauth.middleware";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MealController {
  //Create a meal
    static async createMeal(req: AuthRequest, res: Response) {
        const user = req.user;
        const { name, calories, notes } = req.body;

        if (!name) return res.status(400).json({ error: "Meal name is required" });

        try {
        const meal = await prisma.meal.create({
            data: {
            name,
            calories: calories ? Number(calories) : null,
            notes: notes || null,
            userId: user.id,
            },
        });

        res.status(201).json(meal);
        } catch (error: any) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Database error",
            details: error.message || error,
        });
        }
    }

    //Get all meals for the logged-in user
    static async getAllMeals(req: AuthRequest, res: Response) {
        const user = req.user;
        try {
        const meals = await prisma.meal.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        res.json(meals);
        } catch (error: any) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Database error",
            details: error.message || error,
        });
        }
    }

    //Get a single meal by ID
    static async getMealById(req: AuthRequest, res: Response) {
        const user = req.user;
        const id = Number(req.params.id);

        try {
        const meal = await prisma.meal.findFirst({
            where: { id, userId: user.id },
        });

        if (!meal) return res.status(404).json({ error: "Meal not found" });

        res.json(meal);
        } catch (error: any) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Database error",
            details: error.message || error,
        });
        }
    }

    //Update a meal
    static async updateMeal(req: AuthRequest, res: Response) {
        const user = req.user;
        const id = Number(req.params.id);
        const { name, calories, notes } = req.body;

        try {
        // Check if meal exists and belongs to user
        const existingMeal = await prisma.meal.findFirst({
            where: { id, userId: user.id },
        });

        if (!existingMeal)
            return res
            .status(404)
            .json({ error: "Meal not found or not owned by user" });

        const updatedMeal = await prisma.meal.update({
            where: { id },
            data: {
            name: name ?? existingMeal.name,
            calories: calories ? Number(calories) : existingMeal.calories,
            notes: notes ?? existingMeal.notes,
            },
        });

        res.json(updatedMeal);
        } catch (error: any) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Database error",
            details: error.message || error,
        });
        }
    }

    //Delete a meal
    static async deleteMeal(req: AuthRequest, res: Response) {
        const user = req.user;
        const id = Number(req.params.id);

        try {
        // Ensure meal belongs to this user
        const meal = await prisma.meal.findFirst({
            where: { id, userId: user.id },
        });

        if (!meal)
            return res
            .status(404)
            .json({ error: "Meal not found or not owned by user" });

        await prisma.meal.delete({ where: { id } });

        res.json({ success: true });
        } catch (error: any) {
        console.error("Database error:", error);
        res.status(500).json({
            error: "Database error",
            details: error.message || error,
        });
        }
    }
}
