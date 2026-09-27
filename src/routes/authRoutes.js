import { Router } from "express";
import {
    loginUser,
    logoutUser,
    refreshSession,
    registerUser
} from '../controllers/autsControllers.js';
import { celebrate } from "celebrate";
import { loginUserSchema, registerUserSchema } from "../vallidations/authVallidation.js";


const router = Router();

router.post('/auth/register', celebrate(registerUserSchema),registerUser);

router.post('/auth/login',celebrate(loginUserSchema), loginUser);

router.post('/auth/logout', logoutUser);

router.post('/auth/refresh', refreshSession);

export default router;
