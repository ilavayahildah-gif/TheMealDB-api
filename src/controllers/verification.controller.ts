import { Request, Response } from "express";
import prisma from "../config/prisma";
import { error } from "console";

interface MealParams{
    id: number;
}

export const verifyMeal = async (req: Request<MealParams>, res: Response) => {
    try{
        const {id}=req.params;

        const meal = await prisma.meal.update({
        where: { id },
        data: { verified: true },
        });

        res.json({ message: "Meal verified successfully", data:meal });
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Error verifying meal", error});
    }
};
