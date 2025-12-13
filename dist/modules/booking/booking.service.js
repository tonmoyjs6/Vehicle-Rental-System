"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const db_1 = require("../../config/db");
const createBooking = async (payload) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    console.log(payload);
    // select vehicle_id
    const vhicleDailyPrice = await db_1.pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
    // console.log(vhicleDailyPrice,"daily price");
    console.log(vhicleDailyPrice);
    const dailyPrice = vhicleDailyPrice.rows[0].daily_rent_price;
    const totalPrice = (new Date(rent_end_date).getDate() - new Date(rent_start_date).getDate()) * dailyPrice;
    if (totalPrice < 0) {
        throw new Error("total price always Positive");
    }
    const isSameDateStart = sameDate(rent_start_date);
    const isStartDateGreater = DateGreater(rent_start_date);
    const isSameEnd = sameDate(rent_end_date);
    const isEndGreater = DateGreater(rent_end_date);
    let status = "active";
    let vehicleStatus = "booked";
    if (vhicleDailyPrice.rows[0].availability_status !== "booked") {
        if (isSameDateStart && isSameEnd) {
            const bookingCreation = await db_1.pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status]);
            const vehicleStatusUpdate = await db_1.pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, [vehicleStatus, vehicle_id]);
            return bookingCreation;
        }
        else if (isSameDateStart && isEndGreater) {
            const bookingCreation = await db_1.pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status]);
            // console.log(bookingCreation);
            const vehicleStatusUpdate = await db_1.pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, [vehicleStatus, vehicle_id]);
            return bookingCreation;
        }
        else if (isStartDateGreater && isEndGreater) {
            let data = [];
            const booking = await db_1.pool.query(`INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice, status]);
            // console.log(bookingCreation);
            const vehicleStatusUpdate = await db_1.pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, [vehicleStatus, vehicle_id]);
            const { rows } = booking;
            const { rows: vehicle } = vehicleStatusUpdate;
            data.push({
                rows,
                vehicle
            });
            return data;
        }
        else {
            throw new Error("please provide ");
        }
    }
};
const vehiclesDetails = async (vehicle_id) => {
    const vehicle = await db_1.pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
    return vehicle;
};
// response problem admin
const getAllBooking = async (payload) => {
    const { role, email } = payload;
    if (role === "admin") {
        let resultData = [];
        const allbooking = await db_1.pool.query(`SELECT * FROM bookings `);
        const allVehicle = await db_1.pool.query(`SELECT * FROM vehicles`);
        delete allVehicle.rows[0].daily_rent_price;
        delete allVehicle.rows[0].availability_status;
        delete allVehicle.rows[0].type;
        const customer = await db_1.pool.query(`SELECT * FROM users WHERE id=$1`, [allbooking.rows[0].customer_id]);
        delete customer.rows[0].id;
        delete customer.rows[0].password;
        delete customer.rows[0].phone;
        delete customer.rows[0].role;
        const { rows: vehicle } = allVehicle;
        const { rows: customerInfo } = customer;
        for (let data of allbooking.rows) {
            resultData.push({
                booking: data,
                vehicle,
                customer: customerInfo
            });
        }
        return resultData;
    }
    else if (role === "customer") {
        const singleUser = await db_1.pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
        const singleUserId = singleUser.rows[0].id;
        const singleUserBooking = await db_1.pool.query(`SELECT * FROM bookings WHERE customer_id=$1`, [singleUserId]);
        const vehicleId = singleUserBooking.rows[0].vehicle_id;
        const singlevehicle = await db_1.pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);
        delete singlevehicle.rows[0].daily_rent_price;
        delete singlevehicle.rows[0].availability_status;
        return { ...singleUserBooking.rows[0], ...singlevehicle.rows[0] };
    }
    else {
        return "you are not allowed";
    }
};
const updateBooking = async (bookingId, tokenDecode) => {
    let vehicleStatus = "available";
    const { role, email } = tokenDecode;
    const bookingData = await db_1.pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (new Date().getTime() > new Date(bookingData.rows[0].rent_end_date).getTime()) {
        const status = "returned";
        const updateData = await db_1.pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, bookingId]);
    }
    if (role === "customer") {
        let status = "cancelled";
        const customerSingleBooking = await db_1.pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
        const realcustomer = await db_1.pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (realcustomer.rows[0].email === email) {
            const canCancelled = DateGreater(customerSingleBooking.rows[0].rent_start_date);
            if (canCancelled) {
                const statusUpdate = await db_1.pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, bookingId]);
                const vehicleStatusUpdate = await db_1.pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, [vehicleStatus, statusUpdate.rows[0].vehicle_id]);
                const { rows } = statusUpdate;
                return { rows };
            }
        }
    }
    else if (role === "admin") {
        let status = "returned";
        let vehicleStatus = "available";
        let data = [];
        const statusUpdate = await db_1.pool.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, bookingId]);
        const vehicleStatusUpdate = await db_1.pool.query(`UPDATE vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`, [vehicleStatus, statusUpdate.rows[0].vehicle_id]);
        delete vehicleStatusUpdate.rows[0].id;
        delete vehicleStatusUpdate.rows[0].vehicle_name;
        delete vehicleStatusUpdate.rows[0].type;
        delete vehicleStatusUpdate.rows[0].registration_number;
        delete vehicleStatusUpdate.rows[0].daily_rent_price;
        const { rows } = statusUpdate;
        const { rows: vehicle } = vehicleStatusUpdate;
        data.push({
            rows,
            vehicle
        });
        return data;
    }
};
// aditional function
const sameDate = (startDay) => {
    const todaydate = new Date();
    const startDate = new Date(startDay);
    todaydate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    if (startDate.valueOf() === todaydate.valueOf()) {
        return true;
    }
    return false;
};
const DateGreater = (start) => {
    if (new Date().getTime() < new Date(start).getTime()) {
        return true;
    }
    return false;
};
exports.bookingService = {
    createBooking,
    vehiclesDetails,
    getAllBooking,
    updateBooking
};
