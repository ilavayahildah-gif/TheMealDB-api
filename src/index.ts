import express from "express";
import dotenv from "dotenv";
import mealsRoutes from "./routes/meals.routes";
import authRoutes from "./routes/auth";

dotenv.config({quiet:true});
const app = express();

app.use("/auth", authRoutes);
app.use("/meals", mealsRoutes);

app.get("/", (req, res) => {
  res.send("Meal API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));