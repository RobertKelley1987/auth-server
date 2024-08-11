import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/users";
import catchAsync from "../util/catch-async";

const router = Router();
router.post("/register", catchAsync(registerUser));
router.post("/login", catchAsync(loginUser));
router.post("/logout", catchAsync(logoutUser));

export default router;
