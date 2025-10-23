import rateLimit from "express-rate-limit";

export const recipeRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 3, // limit each user to 3 requests per minute
  message: { error: "Too many recipe requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
