import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";
import mealRoutes from "./routes/meals.routes";
import recipeRoutes from "./routes/recipe.routes";
import "./utils/expiry.utils";
import {Server} from "socket.io";
import http from "http";
import { recommendMeals } from "@controllers/meal.controller";

dotenv.config();

const app = express();
const server=http.createServer(app);
const io =new Server(server, {
    cors:{origin:"*"},
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/recipe",recipeRoutes);
app.use("/api/meals/recommend",recommendMeals)

io.on("connection", (socket)=>{
    console.log("User connected:", socket.id)
});

//broadcast stock updates
export const emitStockUpdate=(product:any)=>{
    io.emit("stockUpdate", product);
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
