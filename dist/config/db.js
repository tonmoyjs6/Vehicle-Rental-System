"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
exports.pool = new pg_1.Pool({ connectionString: config_1.config.connection_String });
const initDb = async () => {
    await exports.pool.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL,
      phone VARCHAR(200) NOT NULL,
      role VARCHAR(200) NOT NULL)
      `);
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(200) NOT NULL,
    type VARCHAR(200) NOT NULL,
    registration_number VARCHAR(200) UNIQUE NOT NULL,
    daily_rent_price INT NOT NULL,
    availability_status VARCHAR(200)
    )
    `);
    await exports.pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date	DATE NOT NULL,
      total_price INT,
      status VARCHAR(200)
      )

      
      `);
    console.log("database connected");
};
exports.default = initDb;
