import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/user.model.js';
import * as otpService from '../services/otp.service.js';
import transporter from '../config/nodemailer.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { USER_STATUS, USER_STATUS_LABEL } from '../utils/constants.js';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
   httpOnly: true,
   secure: IS_PRODUCTION,
   sameSite: IS_PRODUCTION ? 'none' : 'lax',
};

const register = async (req, res) => {
   const { name, email, phone, password } = req.body;

   if (!name || !email || !phone || !password) {
      return sendError(res, 400, 'Missing Details')
   }

   try {
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
         return sendError(res, 409, 'User already exists!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await userModel.createUser({ name, email, phone, password: hashedPassword });

      return sendSuccess(res, 202, 'Registration request submitted. Please wait for admin approval');

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const login = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return sendError(res, 400, 'Missing Details')
   }

   try {
      const user = await userModel.findByEmail(email);
      if (!user) {
         return sendError(res, 401, 'Invalid Credentials!');
      }

      if (user.status !== USER_STATUS.APPROVED) {
         const statusMessages = {
            pending: 'Account pending admin approval.',
            rejected: 'Registration request rejected by admin.'
         }
         
         return sendError(res, 403, statusMessages[USER_STATUS_LABEL[user.status]])
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
         return sendError(res, 401, 'Invalid Credentials!');
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.cookie('token', token, {
         ...COOKIE_OPTIONS,
         maxAge: 24 * 60 * 60 * 1000
      });

      await userModel.setLastLogin(user.id);

      return sendSuccess(res, 200, 'Login successful!');

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const logout = async (req, res) => {
   try {
      res.clearCookie('token', COOKIE_OPTIONS);

      return sendSuccess(res, 200, 'Logged out!');

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const isAuthenticated = async (req, res) => {
   try {
      return sendSuccess(res, 200);

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const sendResetOtp = async (req, res) => {
   const { email } = req.body;

   if (!email) {
      return sendError(res, 400, 'Email is required!')
   }
   
   try {
      const user = await userModel.findByEmail(email);

      if (!user) {
         return sendError(res, 404, 'User not found')
      }
      
      const otp = await otpService.generateAndStoreOtp(email, 'forget_password');

      await transporter.sendMail({
         from: `'Team SlotSync' ${process.env.EMAIL_USER}`,
         to: email,
         subject: 'Password Reset Code',
         html: `Your OTP for restting your password is <strong>${otp}</strong>. Enter this OTP to reset your password.`
      });

      return sendSuccess(res, 200, 'You will recieve the OTP shortly')

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const resetPassword = async (req, res) => {
   const { email, otpCode, newPassword } = req.body;

   if (!email || !otpCode || !newPassword) {
      return sendError(res, 400, 'Email, OTP and New Password is required.');
   }

   try {
      const user = await userModel.findByEmail(email);

      if (!user) {
         return sendError(res, 404, 'User not found')
      }

      const verifyOtp = await otpService.verifyOtp(email, otpCode, 'forget_password');

      if (!verifyOtp) {
         return sendError(res, 400, 'Invalid OTP!')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const changePassword = await userModel.changePassword({ id: user.id, newPassword: hashedPassword });

      await otpService.markOtpUsed(verifyOtp.id);

      return sendSuccess(res, 200, 'Password has been reset successfully.');

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

export {
   register,
   login,
   logout,
   isAuthenticated,
   sendResetOtp,
   resetPassword
};