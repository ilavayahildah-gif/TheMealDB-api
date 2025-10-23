import { Router } from "express";
import { RecipeController } from "../controllers/recipe.controller";
import { authenticateJWT } from "../middleware/jwtauth.middleware";
import { validateRecipeInput } from "../middleware/validation.middleware";
import { recipeRateLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

// Generate a recipe (AI/auto)
router.post(
  "/generate",
  authenticateJWT,
  recipeRateLimiter,
  validateRecipeInput,
  RecipeController.generateRecipe
);

// Get all user's recipes
router.get("/", authenticateJWT, RecipeController.getUserRecipes);

// Get one recipe by ID
router.get("/:id", authenticateJWT, RecipeController.getRecipeById);

// Delete a recipe
router.delete("/:id", authenticateJWT, RecipeController.deleteRecipe);

export default router;
