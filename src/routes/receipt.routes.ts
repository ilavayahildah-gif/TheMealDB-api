import express from "express";
import { ReceiptController } from "../controllers/receipt.controller";
import { authenticateJWT } from "../middleware/jwtauth.middleware";

const router = express.Router();

router.post("/generate/:orderId", authenticateJWT, ReceiptController.generate);

export default router;
