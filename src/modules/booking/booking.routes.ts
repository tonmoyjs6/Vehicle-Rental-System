import { Router } from "express";
import { bookingController } from "./booking.controller";
import { authChecker } from "../../middleware/auth";


const router=Router()

router.post("/",bookingController.createBooking)
router.get("/",authChecker("customer","admin"),bookingController.getAllBooking)

router.put("/:bookingId",bookingController.updateBooking)


export const bookingRouter=router