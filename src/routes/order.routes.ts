import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateJWT } from "../middleware/jwtauth.middleware";
import { recipeRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/", authenticateJWT, recipeRateLimiter, OrderController.createOrder);
router.get("/", authenticateJWT, OrderController.getOrders);
router.post("/:id/cancel", authenticateJWT, OrderController.cancelOrder); // 👈 cancel order route

export default router;
