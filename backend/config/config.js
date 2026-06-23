import dotenv from 'dotenv';

dotenv.config();

export default config = {
   PORT=process.env.PORT,

   DB_HOST=process.env.DB_HOST,
   DB_USER=process.env.DB_USER,
   DB_PASSWORD=process.env.DB_PASSWORD,
   DB_PORT=process.env.DB_PORT,
   DB_NAME=process.env.DB_NAME,

   JWT_SECRET=process.env.JWT_SECRET,
   JWT_REFRESH_SECRET=process.env.JWT_REFRESH_SECRET,

   EMAIL_USER=process.env.EMAIL_USER,
   EMAIL_PASS=process.env.EMAIL_PASS,

   NODE_ENV=process.env.NODE_ENV,

   FRONTEND_URL=process.env.FRONTEND_URL
};