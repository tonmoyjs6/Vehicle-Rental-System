import { NextFunction, Request, Response } from "express"
import { pool } from "../config/db"
import jwt, { JwtPayload } from "jsonwebtoken"
import { config } from "../config/config"


export const authChecker = (...roles: string[]) => {


    return async (req: Request, res: Response, next: NextFunction) => {





        const bearerToken = req.headers.authorization

        const token = bearerToken?.split(" ")[1]


        if (!token) {
            return res.status(401).json({
                succes: false,
                message: "you are not allowed"
            })
        }
        const decode = jwt.verify(token as string, config.secret_key!) as JwtPayload


        const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [decode.email])



        if (user.rows[0].length === 0) {
            return res.status(400).json({
                success: false,
                message: "invalid input"

            })
        }

        req.user = decode
        
        





        if (roles.length && !roles.includes(decode?.role as string)) {
            return res.status(500).json({
                message: "you are not allowed",
                error: "unauthorized"
            })
        }

        next()




    }
}

