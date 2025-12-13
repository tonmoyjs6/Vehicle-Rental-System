import { config } from "../../config/config"
import { pool } from "../../config/db"
import Jwt from "jsonwebtoken"
import { JwtPayload } from "../interfaces/jwtpayload.interface"

// get all user role:admin

const getAllUsers = async () => {

    const userResult = pool.query(`SELECT * FROM users`)

    return userResult

}


const updateUsersById = async (payload: Record<string, unknown>, id: string) => {

    const { name, email, phone, role } = payload
    const { rows } = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name, email, phone, role, id])

    return rows


}



const deleteAUserByAdmin = async (userId: string, isAdmin: string) => {


    const token = isAdmin?.split(" ")[1]
    const decode = Jwt.verify(token as string, config.secret_key as string) as JwtPayload
    const { role } = decode

    console.log(role);
    if (role === "admin") {
        const isActiveuser = await pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [userId])
        console.log(isActiveuser.rows[0].status);
        if (isActiveuser.rows[0].status !== "active") {

            const deleteuser = await pool.query(`DELETE FROM users WHERE id=$1`, [userId])
            return deleteuser

        }

        else {
            throw new Error("somethisn went wrong")
        }

    }



}



export const userService = {
    getAllUsers,
    updateUsersById,
    deleteAUserByAdmin
}