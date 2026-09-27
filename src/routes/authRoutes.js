import { Router } from "express";
import {
    registerUser
} from '../controllers/autsControllers.js';
import { celebrate } from "celebrate";
import { registerUserSchema } from "../vallidations/authVallidation.js";


const router = Router();

router.post('/auth/register', celebrate(registerUserSchema),registerUser);


export default router;
