import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import adminRouter from './routes/admin.routes.js'
import documentRouter from './routes/document.routes.js'
import detailsRouter from './routes/details.routes.js'

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
   res.json({
      success: true,
      message: 'Server is running fine!!',
      date: new Date().toISOString()
   });
});
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/docs', documentRouter)
app.use('/api/details', detailsRouter)

app.listen(port, () => {
   console.log(`Server is listening on http://localhost:${port}`);
   console.log(`Check server running on http://localhost:${port}/api/health`);
});