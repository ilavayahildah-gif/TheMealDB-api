import { Request, Response } from "express";
import { generateReceipt } from "../utils/receiptGenerator.utils";
import { prisma } from "../prisma";

export class ReceiptController {
  static async generate(req: Request, res: Response) {
    const { orderId } = req.params;

    try {
      const order = await prisma.order.findUnique({
        where: { id: Number(orderId) },
        include: { user: true, meal: true },
      });

      if (!order) return res.status(404).json({ error: "Order not found" });

      const filePath = generateReceipt(order, order.user);
      res.json({ message: "Receipt generated successfully", filePath });
    } catch (error: any) {
      console.error("Error generating receipt:", error);
      res.status(500).json({ error: "Failed to generate receipt" });
    }
  }
}
