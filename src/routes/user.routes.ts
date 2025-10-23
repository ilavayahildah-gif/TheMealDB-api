import express from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/jwtauth.middleware";
import { validateRegister, validateLogin } from "../middleware/validation.middleware";

const router = express.Router();

router.post("/register", validateRegister,UserController.register);
router.post("/login", validateLogin,UserController.login);
router.get("/profile", authenticateJWT, UserController.profile);

export default router;
