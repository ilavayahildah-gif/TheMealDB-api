import express from "express";
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import mealsRoutes from "./routes/meals.routes";

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//now you can use routes safely
app.use("/auth", authRoutes);
app.use("/meals", mealsRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "Meal API" }));

export default app;
