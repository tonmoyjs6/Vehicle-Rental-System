import { Router } from "express";
import { authController } from "./auth.controller";



const router= Router()

router.post("/signup",authController.signup)
// POST /api/v1/auth/signin

router.post("/signin",authController.sigIn)



export const authRouter=router