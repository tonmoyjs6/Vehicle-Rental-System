import { Router } from "express";
import { authChecker } from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";


const router=Router()

router.post("/",authChecker("admin"),vehicleController.VehicleCreate)
router.get("/",vehicleController.getAllVehicle)
router.get("/:vehicleId",vehicleController.getVehicleById)
router.put("/:vehicleId",authChecker("admin"),vehicleController.updateVehicleById)
router.delete("/:vehicleId",vehicleController.deleteAVehicleByAdmin)





export const vehicleRouter=router