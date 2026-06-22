import { Router } from "express";
import { isAuthenticated, login, logout, register, sendResetOtp, resetPassword } from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.patch('/reset-password', resetPassword);

export default authRouter;