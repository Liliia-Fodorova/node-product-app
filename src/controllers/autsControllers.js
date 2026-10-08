import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../services/auth.js";
import { Session } from "../models/session.js";




export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    };
    const hashedPassword = await bcrypt.hash(password, 10);
     const newUser = await User.create({
        name,
        email,
        password:hashedPassword,
     });

    const session = await createSession(newUser._id);
    setSessionCookies(res, session);
    res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({ email });

    if(!existingUser){
        throw createHttpError(401, "Envalid credentials");
    }

    const isValidPassword = await bcrypt.compare( password, existingUser.password );

    if(!isValidPassword){
        throw createHttpError(401, "Envalid credentials");
    }

    await Session.deleteOne({ userId: existingUser._id});

    const session = await createSession(existingUser._id);
    setSessionCookies(res, session);

    res.status(200).json(existingUser);
};

export const logoutUser = async (req, res) => {
    const {sessionId, accessToken} = req.cookies;

    if( sessionId && accessToken){
        await Session.deleteOne({ _id: sessionId});
    }

     res.clearCookie("sessionId");
     res.clearCookie("accessToken");
     res.clearCookie("refreshToken");

     res.status(204).send();
};

export const refreshSession = async (req, res) => {
    const { sessionId, refreshToken } = req.cookies;

    if (!sessionId || !refreshToken) {
        throw createHttpError(401, "Missing session credentials");
    }

    const session = await Session.findOne({ _id: sessionId, refreshToken });

    if (!session) {
        throw createHttpError(401, "Session not found");
    }

    const isRefreshTokinExpired = new Date() > session.refreshTokenValidUntil;

    if (isRefreshTokinExpired) {
        await session.deleteOne();
        res.clearCookie("sessionId");
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        throw createHttpError(401, "Refresh token expired");
    }

    await session.deleteOne();
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({
        message: "session refreshed succesfuly"
    });
};

