import { Request, Response } from "express";

class UserController {
  // Get currently authenticated user's info
    static async getUser(req: Request, res: Response) {
    try {
      // AuthMiddleware attaches decoded token data to req.user
        const user = (req as any).user;

    if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

      // You can customize this depending on your database logic
      // For now, we just return token data
    return res.status(200).json({
        message: "User info retrieved successfully",
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    });
    } catch (error) {
        console.error("Error fetching user info:", error);
        return res.status(500).json({ message: "Server error" });
    }
    }
}

export default UserController;
