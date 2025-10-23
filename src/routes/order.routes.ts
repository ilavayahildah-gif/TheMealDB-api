import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateJWT } from "../middleware/jwtauth.middleware";
import { recipeRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

// Create order (for meal or recipe)
router.post("/", authenticateJWT, recipeRateLimiter, OrderController.createOrder);

// Get all orders for user
router.get("/", authenticateJWT, OrderController.getOrders);

// Get specific order
router.get("/:id", authenticateJWT, OrderController.getOrderById);

// Update order status
router.put("/:id", authenticateJWT, OrderController.updateOrder);

// Delete order
router.delete("/:id", authenticateJWT, OrderController.deleteOrder);

export default router;
