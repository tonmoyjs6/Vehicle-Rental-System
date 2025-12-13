import { Request, Response } from "express";
import { authService } from "./auth.service";


const signup = async (req: Request, res: Response) => {


    try {
        const result = await authService.signup(req.body)

        console.log(result);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data:result?.rows[0]

        }
        )

    } catch (error:any) {
        res.status(500).json({
            succes:false,
            message:error.message,
            data:null
        })
    }

}




const sigIn = async (req: Request, res: Response) => {
    const {email,password}=req.body
    

    try {
        const result = await authService.signIn(email,password)

        
        res.status(200).json({
            success: true,
            message: "Login successful",
            
            data:result

        }
        )

    } catch (error:any) {
        res.status(500).json({
            succes:false,
            message:error.message,
            data:null
        })
    }

}




export const authController = {
    signup,
    sigIn
}