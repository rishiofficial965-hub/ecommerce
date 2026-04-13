import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import passport from "passport"
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { Config } from "./config/env.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use(passport.initialize())
passport.use(new GoogleStrategy({
    clientID:Config.GOOGLE_CLIENT_ID,
    clientSecret:Config.GOOGLE_CLIENT_SECRET,
    callbackURL:Config.GOOGLE_CALLBACK_URL,
    scope:["email","profile"]
},(accessToken,refreshToken,profile,done)=>{
    return done(null,profile)
}))

app.use("/api/auth", authRouter);

export default app;
