import { Request, Response } from "express";
import prisma from "@config/prisma";

export const addSupplier = async (req: Request, res: Response) => {
    try {
        const supplier = await prisma.supplier.create({ data: req.body });
        res.status(201).json({ message: "Supplier added", data: supplier });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    };

    export const getSupplierProducts = async (req: Request, res: Response) => {
    const { supplierId } = req.params;
    const products = await prisma.meal.findMany({ where: { supplierId } });
    res.json(products);
};
