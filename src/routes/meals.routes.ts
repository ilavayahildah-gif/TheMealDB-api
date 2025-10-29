import express from "express";
import { MealController } from "../controllers/meal.controller";
import { authenticateJWT } from "../middleware/jwtauth.middleware";
import { validateMeal } from "../middleware/validation.middleware";
import { recommendMeals } from "../controllers/meal.controller";

const router = express.Router();

// All routes require authentication
router.post("/", authenticateJWT, validateMeal, MealController.createMeal);
router.get("/", authenticateJWT, MealController.getAllMeals);
router.get("/:id", authenticateJWT, MealController.getMealById);
router.put("/:id", authenticateJWT,validateMeal, MealController.updateMeal);
router.delete("/:id", authenticateJWT, MealController.deleteMeal);
router.get("/:id", authenticateJWT, recommendMeals, MealController.getRecommendedMeals);

export default router;
