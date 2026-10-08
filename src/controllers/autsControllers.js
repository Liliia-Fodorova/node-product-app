import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../services/auth.js";
import { Session } from "../models/session.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import handlebars from "handlebars";
import path from "path";
import fs from "node:fs/promises";




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


export const requestResetEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  // Користувач є — генеруємо короткоживучий JWT і відправляємо лист
  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '20m' },
  );

  // 1. Формуємо шлях до шаблона
  const templatePath = path.resolve('src/templates/reset-password-email.html');
  // 2. Читаємо шаблон
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  // 3. Готуємо шаблон до заповнення
  const template = handlebars.compile(templateSource);
  // 4. Формуємо із шаблона HTML документ з динамічними даними
  const html = template({
    name: user.name,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
      await sendEmail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: 'Reset your password',
          html,
      });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Failed to send the email');
  }

	// Та сама "нейтральна" відповідь
  return res.status(200).json({
    message: 'Password reset email sent successfully',
  });
};
