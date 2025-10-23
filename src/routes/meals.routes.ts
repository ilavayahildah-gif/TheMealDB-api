import express from "express";
import { MealController } from "../controllers/meal.controller";
import { jwtAuth } from "../middleware/jwtauth.middleware";
import { validateMeal } from "../middleware/validation.middleware";

const router = express.Router();

// All routes require authentication
router.post("/", jwtAuth, validateMeal, MealController.createMeal);
router.get("/", jwtAuth, MealController.getAllMeals);
router.get("/:id", jwtAuth, MealController.getMealById);
router.put("/:id", jwtAuth,validateMeal, MealController.updateMeal);
router.delete("/:id", jwtAuth, MealController.deleteMeal);

export default router;
