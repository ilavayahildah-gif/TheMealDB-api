import express from 'express';
import dotenv from 'dotenv';;
import jwt from 'jsonwebtoken';
import passport, { Profile } from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import  Pool  from 'pg';
import pool from 'db';


dotenv.config();


const router = express.Router();


// Configure Passport Google Strategy
passport.use(new GoogleStrategy(
{
clientID: process.env.GOOGLE_CLIENT_ID as string,
clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
callbackURL: process.env.GOOGLE_CALLBACK_URL as "http://localhost:3000/auth/google/callback",
},
async (accessToken:string, refreshToken:string, profile:Profile, done:(error:any, user?:any)) => {
try {
const user ={
    googleId: profile.id,
    name:profile.displayName,
    email:profile.emails?.[0]?.value,
};

return done(null, user);
} catch (err) {
return done(err, undefined);
}
}
));

//Passport serialize/deserialize
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
    const res = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    done(null, res.rows[0]);
    } catch (err) {
    done(err as Error);
    }
});

//Google Auth Routes ---

//Start OAuth flow
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//Callback — issue JWT and return to client
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/failure" }),
    (req, res) => {
    const user = req.user as any;
    const payload = { id: user.id, email: user.email, name: user.name };

    const secret = process.env.JWT_SECRET;
    if (!secret){
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(payload, secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    // You can redirect to your frontend or just return token as JSON
    res.json({ token });
    }
);

//Failure route
    router.get("/failure",(req, res) =>
    res.status(401).json({error:"Authentication failed "})
);

//Failure route
router.get("/failure", (req, res) => res.status(401).json({ error: "Authentication failed" }));



export default router;