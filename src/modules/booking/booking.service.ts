import { pool } from "../../config/db";
import { MyJwtPayload } from "../interfaces/jwtpayload.interface";



const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload
    console.log(payload);



    // select vehicle_id

    const vhicleDailyPrice = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id])
    // console.log(vhicleDailyPrice,"daily price");
    console.log(vhicleDailyPrice);


    const dailyPrice = vhicleDailyPrice.rows[0].daily_rent_price

    const totalPrice = (new Date(rent_end_date as Date).getDate() - new Date(rent_start_date as Date).getDate()) * dailyPrice

    if (totalPrice < 0) {
        throw new Error("total price always Positive")
    }


    const isSameDateStart = sameDate(rent_start_date as Date)

    const isStartDateGreater = DateGreater(rent_start_date as Date)


    const isSameEnd = sameDate(rent_end_date as Date)

    const isEndGreater = DateGreater(rent_end_date as Date)
    let status = "active"
    let vehicleStatus = "booked"
    
if(vhicleDailyPrice.rows[0].availability_status!=="booked"){


    if (isSameDateStart && isSameEnd) {
        const bookingCreation = await pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status])

        const vehicleStatusUpdate= await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,[vehicleStatus,vehicle_id])
        

        return bookingCreation

    } else if (isSameDateStart && isEndGreater) {
        const bookingCreation = await pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status])
        // console.log(bookingCreation);

        const vehicleStatusUpdate= await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,[vehicleStatus,vehicle_id])

        return bookingCreation
    }
    else if (isStartDateGreater && isEndGreater) {
        let data=[]
         const booking= await pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status])
        // console.log(bookingCreation);

        const vehicleStatusUpdate= await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,[vehicleStatus,vehicle_id])
           

        const {rows}=booking
        const {rows:vehicle}=vehicleStatusUpdate
        data.push({
            rows,
            vehicle
        })
        return data

    }

    else {
        throw new Error("please provide ")
    }

}

























}


const vehiclesDetails = async (vehicle_id: any) => {

    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id])
    return vehicle

}


// response problem admin

const getAllBooking = async (payload: Record<string, unknown>) => {

    const { role, email } = payload
    if (role === "admin") {
        let resultData=[]
        const allbooking = await pool.query(`SELECT * FROM bookings `)
        const allVehicle = await pool.query(`SELECT * FROM vehicles`)
        delete allVehicle.rows[0].daily_rent_price
        delete allVehicle.rows[0].availability_status
        delete allVehicle.rows[0].type
        
        const customer= await pool.query(`SELECT * FROM users WHERE id=$1`,[allbooking.rows[0].customer_id])
        delete customer.rows[0].id
        delete customer.rows[0].password
        delete customer.rows[0].phone
        delete customer.rows[0].role

        const {rows:vehicle}=allVehicle
        const {rows:customerInfo}=customer
        for(let data of allbooking.rows){
            resultData.push({
                booking:data,
                vehicle,
                customer:customerInfo
            })

        }

        return resultData


    }
    else if (role === "customer") {
        const singleUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
        const singleUserId = singleUser.rows[0].id
        const singleUserBooking = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [singleUserId])
        const vehicleId = singleUserBooking.rows[0].vehicle_id
        const singlevehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId])
        delete singlevehicle.rows[0].daily_rent_price
        delete singlevehicle.rows[0].availability_status
        return { ...singleUserBooking.rows[0], ...singlevehicle.rows[0] }
    } else {
        return "you are not allowed"
    }

}



const updateBooking=async(bookingId:string,tokenDecode:MyJwtPayload)=>{
    
    let vehicleStatus="available"
    
    const {role, email}=tokenDecode 
    

    const bookingData=await pool.query(`SELECT * FROM bookings WHERE id=$1`,[bookingId])
    
    if(new Date().getTime()>new Date(bookingData.rows[0].rent_end_date).getTime()){
        
        const status="returned"
        const updateData= await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,[status,bookingId])
        
    }

    
    
    if(role.includes("customer")){
        let status="cancelled"
        
        const customerSingleBooking=await pool.query(`SELECT * FROM bookings WHERE id=$1`,[bookingId])
        
        const realcustomer= await pool.query(`SELECT * FROM users WHERE email=$1`,[email])

        if(realcustomer.rows[0].email===email){
            
            const canCancelled= DateGreater(customerSingleBooking.rows[0].rent_start_date)
            if(canCancelled){
                const statusUpdate= await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,[status,bookingId])

                const vehicleStatusUpdate= await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,[vehicleStatus,statusUpdate.rows[0].vehicle_id])
                
                const {rows}=statusUpdate
                return {rows}
            }
            
            

        }



            
        
    }

            else if(role.includes("admin")){
            let status="returned"
            let vehicleStatus="available"
            let data=[]

            const statusUpdate= await pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,[status,bookingId])

                const vehicleStatusUpdate= await pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,[vehicleStatus,statusUpdate.rows[0].vehicle_id])
                
                
                
                delete vehicleStatusUpdate.rows[0].id
                delete vehicleStatusUpdate.rows[0].vehicle_name
                delete vehicleStatusUpdate.rows[0].type
                delete vehicleStatusUpdate.rows[0].registration_number
                delete vehicleStatusUpdate.rows[0].daily_rent_price

                const {rows}=statusUpdate
                const {rows:vehicle}=vehicleStatusUpdate
                data.push({
                    rows,
                    vehicle
                })
                
                return data

        }


}


// aditional function

const sameDate = (startDay: Date) => {

    const todaydate = new Date()


    const startDate = new Date(startDay)
    todaydate.setHours(0, 0, 0, 0)

    startDate.setHours(0, 0, 0, 0)

    if (startDate.valueOf() === todaydate.valueOf()) {
        return true
    }
    return false




}
const DateGreater = (start: Date) => {
    if (new Date().getTime() < new Date(start).getTime()) {
        return true
    }
    return false
}


export const bookingService = {
    createBooking,
    vehiclesDetails,
    getAllBooking,
    updateBooking
}