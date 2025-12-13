"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.authController.signup);
// POST /api/v1/auth/signin
router.post("/signin", auth_controller_1.authController.sigIn);
exports.authRouter = router;
