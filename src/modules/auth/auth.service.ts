import { Response } from "express";
import { pool } from "../../config/db";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"
import { config } from "../../config/config";


const signup=async(payload:Record<string,unknown>)=>{
    const {name,email,password,phone,role}=payload
    const hashedPassword=await bcrypt.hash(password as string,10)

    const user= await pool.query(`INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5)RETURNING *`,[name,email,hashedPassword,phone,role])

    if(user.rows[0].length===0){
        return
    }

    return user

}



const signIn=async(email:string,password:string)=>{
    

    const user= await pool.query(`SELECT * FROM users WHERE email=$1`,[email])

    const match=await bcrypt.compare(password,user.rows[0].password)

    if(user.rows[0].length==0){
        return null
    }
    

    if(!match){
        return false
    }

    const jwtPayload={
        name:user.rows[0].name,
        email:user.rows[0].email,
        phone:user.rows[0].phone,
        role:user.rows[0].role


    }
    const token =jwt.sign(jwtPayload,config.secret_key as string)
    
    

    if(!token){
        return false
    }
    


   

    return {token,user}

}


export const authService={
    signup,
    signIn
}