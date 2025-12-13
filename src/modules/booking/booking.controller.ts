import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config/config";



const createBooking = async (req: Request, res: Response) => {
    // console.log(req.body);
    // no data found
    const { vehicle_id } = req.body


    try {
        
        const vehiclesData = await bookingService.vehiclesDetails(vehicle_id)
        const vehicleName = vehiclesData.rows[0].vehicle_name
        const vehicleDailyPrice = vehiclesData.rows[0].daily_rent_price
        const result = await bookingService.createBooking(req.body)

        

        
        
        
        res.status(201).json({
            success: true,
            message: "Booking created successfully",


            data: result
        }
        )

    } catch (error: any) {
        res.status(500).json({
            succes: false,
            message: error.message,
            data: null
        })
    }



}


const getAllBooking = async (req: Request, res: Response) => {


    try {
        const bearerToken = req.headers.authorization

        const token = bearerToken?.split(" ")[1]
        const decode = Jwt.verify(token as string, config.secret_key as string)



        const result = await bookingService.getAllBooking(decode as JwtPayload)



        res.status(201).json({
            success: true,
            message: "Booking Retrived successfully",


            data: result
        }
        )

    } catch (error: any) {
        res.status(500).json({
            succes: false,
            message: error.message,
            data: null
        })
    }


}



const updateBooking = async (req: Request, res: Response) => {
    try {

        const bookingId = req.params.bookingId
        const token = req.headers.authorization
        const bearerToken = token?.split(" ")[1]
        const tokenDecode = Jwt.verify(bearerToken as string, config.secret_key as string)
        const bookingDetails = await bookingService.updateBooking(bookingId!, tokenDecode as string)


        if (bookingDetails[0].status === "cancelled") {
            res.status(200).json({
                succes: true,
                message: "Booking cancelled successfully",
                data: bookingDetails
            })



        }
        else {

            res.status(200).json({
                succes: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: bookingDetails
            })

        }



    } catch (error) {

    }

}

export const bookingController = {
    createBooking,
    getAllBooking,
    updateBooking
}