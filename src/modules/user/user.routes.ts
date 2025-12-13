import { Router } from "express";
import { userController } from "./user.controller";
import { authChecker } from "../../middleware/auth";


const router= Router()


router.get("/",authChecker("admin"),userController.getAllUsers)

router.put("/:userId",authChecker("admin","customer"),userController.updateUsersById)
router.delete("/:userId",userController.deleteAUserByAdmin)



export const userRouter=router