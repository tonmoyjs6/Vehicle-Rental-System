import { config } from "../../config/config"
import { pool } from "../../config/db"
import Jwt from "jsonwebtoken"
import { MyJwtPayload } from "../interfaces/jwtpayload.interface"

// vehicle created only on role admin

const VehicleCreate = async (payload: Record<string, unknown>) => {

    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload
    const { rows } = await pool.query(`INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status])

    return rows

}


// getvehicle all vehicle
const getAllVehicle = async () => {

    const { rows } = await pool.query(`SELECT * FROM vehicles`)

    return rows

}


//  getAllVehicleById role:public


const getVehicleById = async (id: any) => {

    const { rows } = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id])

    return rows

}

const updateVehicleById = async (payload: Record<string, unknown>, id: string) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload
    const { rows } = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, id])

    return rows

}



const deleteAVehicleByAdmin = async (vehicleId: string, isAdmin: string) => {


    const token = isAdmin?.split(" ")[1]
    const decode = Jwt.verify(token as string, config.secret_key as string) as MyJwtPayload
    const { role } = decode as{role:string[]}
    

    if(role.includes("admin")){
        const isActiveBooking = await pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1`, [vehicleId])
        if (isActiveBooking.rows[0].status !== "active") {
            const deleteVehicle= await pool.query(`DELETE FROM vehicles WHERE id=$1`,[vehicleId])
            return deleteVehicle

    }
    }

}


export const vehicleService = {
    VehicleCreate,
    getAllVehicle,
    getVehicleById,
    updateVehicleById,
    deleteAVehicleByAdmin
}