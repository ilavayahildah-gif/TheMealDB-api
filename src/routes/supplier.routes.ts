import express from "express";
import { addSupplier, getSupplierProducts } from "../controllers/supplier.controller";
const router = express.Router();

router.post("/add", addSupplier);
router.get("/:supplierId/products", getSupplierProducts);

export default router;
