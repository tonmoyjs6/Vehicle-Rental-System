import { Request, Response } from "express"
import {  } from "../auth/auth.service"
import { userService } from "./user.service"

// get all user role:admin
const getAllUsers=async(req:Request,res:Response)=>{
    

    try {
            const result = await userService.getAllUsers()
            const {rows}=result
    
            // console.log(result);
            res.status(200).json({
                success: true,
                message: "Users retrieved successfully",
                data:rows
    
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




const updateUsersById=async(req:Request,res:Response)=>{
    const id=req.params.userId
    
    // console.log(req.body);
    

    try {
            const result = await userService.updateUsersById(req.body,id!)
            
    
            // console.log(result);
            res.status(200).json({
                success: true,
                message: "Users Updated successfully",
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


const deleteAUserByAdmin=async(req:Request,res:Response)=>{
    
    try {
            
             const result= await userService.deleteAUserByAdmin(req.params.userId!,req.headers.authorization!)

            console.log(result);
            res.status(200).json({
                success: true,
                message: "User Deleted successfully",
                
    
            }
            )
    
        } catch (error:any) {
            res.status(500).json({
                succes:false,
                message:error.message
                
            })
        }

    
   
}



export const userController={
    getAllUsers,
    updateUsersById,
    deleteAUserByAdmin
}