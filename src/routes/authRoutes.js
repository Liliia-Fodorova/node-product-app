import { Router } from "express";
import {
    loginUser,
    logoutUser,
    refreshSession,
    registerUser,
    requestResetEmail,
    resetPassword
} from '../controllers/autsControllers.js';
import { celebrate } from "celebrate";
import { loginUserSchema, registerUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../vallidations/authVallidation.js";


const router = Router();

router.post('/auth/register', celebrate(registerUserSchema), registerUser);

router.post('/auth/login',celebrate(loginUserSchema), loginUser);

router.post('/auth/logout', logoutUser);

router.post('/auth/refresh', refreshSession);

router.post('/auth/request-reset-email', celebrate(requestResetEmailSchema), requestResetEmail);
router.post('/auth/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
