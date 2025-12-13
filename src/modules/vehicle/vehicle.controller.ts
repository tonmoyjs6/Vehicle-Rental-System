import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";
import { pool } from "../../config/db";

// vehicle created only on role admin

const VehicleCreate=async(req:Request,res:Response)=>{
    
    
    try {
            const result = await vehicleService.VehicleCreate(req.body)
    
            // console.log(result);
            res.status(201).json({
                success: true,
                message: "Vehicle created successfully",
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

// get all vehicle public
const getAllVehicle=async(req:Request,res:Response)=>{
    

    try {
            const result = await vehicleService.getAllVehicle()
    
            // console.log(result);
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
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

// getAllVehicleById role:public

const getVehicleById=async(req:Request,res:Response)=>{
    const id=req.params.vehicleId
    

    try {
            const result = await vehicleService.getVehicleById(id)
    
            // console.log(result);
            res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
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


// update vehicle role:admin

const updateVehicleById=async(req:Request,res:Response)=>{
    const id=req.params.vehicleId
    

    try {
            const result = await vehicleService.updateVehicleById(req.body,id!)
            
            // console.log(result);
            res.status(200).json({
                success: true,
                message: "Vehicle Updated successfully",
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


const deleteAVehicleByAdmin=async(req:Request,res:Response)=>{
    
    try {
            
             const result= await vehicleService.deleteAVehicleByAdmin(req.params.vehicleId!,req.headers.authorization!)

            // console.log(result);
            res.status(200).json({
                success: true,
                message: "Vehicle Deleted successfully",
                
    
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



export const vehicleController={
    VehicleCreate,
    getAllVehicle,
    getVehicleById,
    updateVehicleById,
    deleteAVehicleByAdmin
}