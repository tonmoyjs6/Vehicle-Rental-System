import express, { Request, Response } from 'express';
import initDb from './config/db';
import {  authRouter } from './modules/auth/auth.routes';
import { vehicleRouter } from './modules/vehicle/vehicle.routes';
import { userRouter } from './modules/user/user.routes';
import { bookingRouter } from './modules/booking/booking.routes';
 const app = express()

 
app.use(express.json())




initDb()

app.get('/', (req:Request, res:Response) => {
  res.send('My server is runing lets do.....')
})



app.use("/api/v1/auth",authRouter)
app.use("/api/v1/vehicles",vehicleRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/bookings",bookingRouter)






export default app