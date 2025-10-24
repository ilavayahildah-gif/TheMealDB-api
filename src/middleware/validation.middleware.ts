import { Request, Response, NextFunction } from "express";

// User registration validation
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { first_name,last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password)
        return res.status(400).json({ error: "All fields (name, email, password) are required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ error: "Invalid email format" });

    if (password.length < 6)
        return res.status(400).json({ error: "Password must be at least 6 characters" });

    next();
    };

    // Login validation
    export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email and password are required" });

    next();
    };

    // Meal creation validation
    export const validateMeal = (req: Request, res: Response, next: NextFunction) => {
    const { name, calories } = req.body;

    if (!name)
        return res.status(400).json({ error: "Meal name is required" });

    if (calories && typeof calories !== "number")
        return res.status(400).json({ error: "Calories must be a number" });

    next();
};

//recipe validation
    export const validateRecipeInput = (req: Request, res: Response, next: NextFunction) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({
        error: "Ingredients are required and must be a non-empty array."
        });
    }

    next();
};

//order validations
export const validateOrderInput = (req: Request, res: Response, next: NextFunction) => {
    const { item, quantity, price } = req.body;
    if (!item || !quantity || !price)
        return res.status(400).json({ error: "Item, quantity, and price are required" });
    next();
};
