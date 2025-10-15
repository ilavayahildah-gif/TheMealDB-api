import express from 'express';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import dotenv from 'dotenv';
import {query} from '../db';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

//configurepassport google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:process.env.GOOGLE_CLIENT_CALLBACK_URL!
},
async(accessToken, refreshToken, profile, done)=>{
    try{
        const email=profile.emails && profile.emails[0].value;
        const googleId =profile.id;
        const name=profile.displayName;

        //UPSERT USER
        const upsert=await query(
            'INSERT INTO users (google_id, email, name)
            VALUES ($1, $2, $3)
            ON CONFLICT (google_id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name
            RETURNING *',
            [googleId, email, name]
        );
        const user=upsert.rows[0];
        return done(null, user);
    } catch (err){
        return done(err as Error);
    }
}
));

//passport serialize/deserialize
passport.serializeUser((user:any, done) =>{
    done(null, user.id);
});

passport deserializeUser(async(id:number, done) =>{
    try{
        const res=await query('SELECT*FROM users WHERE id=$1', [id]);
        done(null, res.rows[0]);
    } catch (err){
        done(err as Error);
    }
});

//route to start oauth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// Callback — issue JWT and return to client
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/failure' }),
(req, res) => {
// passport saved user on req.user
const user = req.user as any;
const payload = { id: user.id, email: user.email, name: user.name };
const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });


// return token in query param or JSON depending on your app type
// here we'll show a simple JSON response (for test) — typically you redirect to frontend and include token
res.json({ token });
}
);


router.get('/failure', (req, res) => res.status(401).json({ error: 'Authentication failed' }));


export default router;