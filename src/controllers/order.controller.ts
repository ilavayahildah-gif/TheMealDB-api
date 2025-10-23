import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/jwtauth.middleware";

const prisma = new PrismaClient();

export class OrderController {
  //Create an order (for either meal or recipe)
  static async createOrder(req: AuthRequest, res: Response) {
    const user = req.user;
    const { mealId, recipeId, quantity } = req.body;

    if (!mealId && !recipeId)
      return res.status(400).json({
        error: "Either mealId or recipeId must be provided",
      });

    if (!quantity || quantity <= 0)
      return res.status(400).json({ error: "Quantity must be greater than 0" });

    try {
      // Determine item type and fetch its details
      let item, price = 0, itemType = "";

      if (mealId) {
        item = await prisma.meal.findFirst({
          where: { id: mealId, userId: user.id },
        });
        itemType = "meal";
      } else if (recipeId) {
        item = await prisma.recipe.findFirst({
          where: { id: recipeId, userId: user.id },
        });
        itemType = "recipe";
      }

      if (!item)
        return res.status(404).json({ error: `${itemType} not found` });

      // For demo: assume each meal/recipe has a default price
      price = (itemType === "meal" ? 8.5 : 10.0) * quantity;

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          mealId: mealId || null,
          recipeId: recipeId || null,
          quantity,
          totalPrice: price,
        },
        include: {
          meal: true,
          recipe: true,
        },
      });

      res.status(201).json({
        message: `Order placed successfully for ${itemType}`,
        order,
      });
    } catch (error: any) {
      console.error("Database error:", error);
      res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }

  //Get all user orders (including meal/recipe details)
  static async getOrders(req: AuthRequest, res: Response) {
    const user = req.user;
    try {
      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          meal: true,
          recipe: true,
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }

  //Get a single order
  static async getOrderById(req: AuthRequest, res: Response) {
    const user = req.user;
    const id = Number(req.params.id);

    try {
      const order = await prisma.order.findFirst({
        where: { id, userId: user.id },
        include: { meal: true, recipe: true },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      res.json(order);
    } catch (error: any) {
      res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }

  //Update order status (admin or user can confirm)
  static async updateOrder(req: AuthRequest, res: Response) {
    const user = req.user;
    const id = Number(req.params.id);
    const { status } = req.body;

    try {
      const updated = await prisma.order.updateMany({
        where: { id, userId: user.id },
        data: { status },
      });

      if (updated.count === 0)
        return res
          .status(404)
          .json({ error: "Order not found or not owned by user" });

      res.json({ message: "Order status updated successfully" });
    } catch (error: any) {
      res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }

  //Delete an order
  static async deleteOrder(req: AuthRequest, res: Response) {
    const user = req.user;
    const id = Number(req.params.id);

    try {
      const deleted = await prisma.order.deleteMany({
        where: { id, userId: user.id },
      });

      if (deleted.count === 0)
        return res
          .status(404)
          .json({ error: "Order not found or not owned by user" });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({
        error: "Database error",
        details: error.message || error,
      });
    }
  }
}
