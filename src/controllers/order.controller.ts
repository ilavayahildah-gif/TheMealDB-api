import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/jwtauth.middleware";

const prisma = new PrismaClient();

export class OrderController {
  //Create Order (with stock deduction)
  static async createOrder(req: AuthRequest, res: Response) {
    const user = req.user;
    const { mealId, recipeId, quantity } = req.body;

    if (!mealId && !recipeId)
      return res.status(400).json({ error: "Either mealId or recipeId is required" });

    if (!quantity || quantity <= 0)
      return res.status(400).json({ error: "Quantity must be greater than 0" });

    try {
      let item, stock = 0, price = 0, itemType = "";

      if (mealId) {
        item = await prisma.meal.findUnique({ where: { id: mealId } });
        itemType = "meal";
      } else {
        item = await prisma.recipe.findUnique({ where: { id: recipeId } });
        itemType = "recipe";
      }

      if (!item)
        return res.status(404).json({ error: `${itemType} not found` });

      if (item.stock < quantity)
        return res.status(400).json({
          error: `Not enough stock for this ${itemType}. Available: ${item.stock}`,
        });

      // calculate price (can be dynamic later)
      price = (itemType === "meal" ? 8.5 : 10.0) * quantity;

      //Use transaction to ensure stock & order remain consistent
      const [updatedItem, newOrder] = await prisma.$transaction([
        prisma[itemType].update({
          where: { id: item.id },
          data: { stock: { decrement: quantity } },
        }),
        prisma.order.create({
          data: {
            userId: user.id,
            mealId: mealId || null,
            recipeId: recipeId || null,
            quantity,
            totalPrice: price,
          },
          include: { meal: true, recipe: true },
        }),
      ]);

      res.status(201).json({
        message: `Order placed successfully for ${itemType}`,
        order: newOrder,
        remainingStock: updatedItem.stock,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  }

  //Get all user orders
  static async getOrders(req: AuthRequest, res: Response) {
    const user = req.user;
    try {
      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: { meal: true, recipe: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: "Database error", details: error.message });
    }
  }

  //Cancel Order → restore stock
  static async cancelOrder(req: AuthRequest, res: Response) {
    const user = req.user;
    const id = Number(req.params.id);

    try {
      const order = await prisma.order.findFirst({
        where: { id, userId: user.id },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.status === "cancelled")
        return res.status(400).json({ error: "Order already cancelled" });

      await prisma.$transaction(async (tx) => {
        if (order.mealId) {
          await tx.meal.update({
            where: { id: order.mealId },
            data: { stock: { increment: order.quantity } },
          });
        } else if (order.recipeId) {
          await tx.recipe.update({
            where: { id: order.recipeId },
            data: { stock: { increment: order.quantity } },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: { status: "cancelled" },
        });
      });

      res.json({ message: "Order cancelled and stock restored" });
    } catch (error: any) {
      res.status(500).json({ error: "Database error", details: error.message });
    }
  }
}
