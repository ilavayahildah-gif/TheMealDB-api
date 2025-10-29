import { Request, Response } from "express";
import prisma from "../config/prisma";
import { emit } from "process";
import { emitStockUpdate } from "index";

export const updateStock = async (req: Request, res: Response) => {
    const { mealId, quantity } = req.body;

    const meal = await prisma.meal.update({
        where: { id: mealId },
        data: { stock: { increment: quantity } },
    });

    emitStockUpdate(meal);
    res.json({message:"Stock updated", data:meal});
};
