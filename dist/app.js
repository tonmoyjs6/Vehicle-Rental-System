"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = require("./modules/auth/auth.routes");
const vehicle_routes_1 = require("./modules/vehicle/vehicle.routes");
const user_routes_1 = require("./modules/user/user.routes");
const booking_routes_1 = require("./modules/booking/booking.routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, db_1.default)();
app.get('/', (req, res) => {
    res.send('My server is runing lets do.....');
});
app.use("/api/v1/auth", auth_routes_1.authRouter);
app.use("/api/v1/vehicles", vehicle_routes_1.vehicleRouter);
app.use("/api/v1/users", user_routes_1.userRouter);
app.use("/api/v1/bookings", booking_routes_1.bookingRouter);
exports.default = app;
