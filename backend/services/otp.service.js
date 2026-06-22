import db from '../config/db.js'
import crypto from 'crypto'

const generateOtp = () => {
   const num = crypto.randomInt(0, 1000000)
   return num.toString().padStart(6, '0')
}

const generateAndStoreOtp = async (email, purpose) => {
   await db.execute(
      `DELETE FROM otps WHERE email = ? AND purpose = ?`,
      [email, purpose]
   )
   
   const otp = generateOtp()
   const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

   await db.execute(
      `INSERT INTO otps (email, otp_code, purpose, expires_at, is_used) VALUES(?, ?, ?, ?, FALSE)`,
      [email, otp, purpose, expiresAt]
   )

   return otp
}

const verifyOtp = async (email, otpCode, purpose) => {
   const [rows] = await db.execute(
      `SELECT * FROM otps WHERE email = ? AND otp_code = ? AND purpose = ? AND is_used = FALSE AND expires_at > NOW()`,
      [email, otpCode, purpose]
   )
   return rows[0] || null
}

const markOtpUsed = async (id) => {
   await db.execute(
      `UPDATE otps SET is_used = TRUE WHERE id = ?`,
      [id]
   )
}

export {
   generateAndStoreOtp,
   verifyOtp,
   markOtpUsed
}