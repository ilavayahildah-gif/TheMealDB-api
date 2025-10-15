import express from 'express';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import mealsRouter = require('@routes/meals.routes');

dotenv.config();

const app = express();
app.use(express.json());

app.use(session({secret: process.env.JWT_SECRET || 'secret', resave:false, saveUninitialized: }))
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/meals', mealsRouter);

app.get('/', (req, res) => res.json({ok:true, message:'Meal API'}));

export default app;