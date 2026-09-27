import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { createSession, setSessionCookies } from "../services/auth.js";


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

    const sesssion = await createSession(newUser._id);
    setSessionCookies(res, sesssion);
    res.status(201).json(newUser);
};

