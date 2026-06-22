import { Router } from 'express'
import { addDetailsController } from '../controllers/details.controller.js';
import userAuth from '../middleware/userAuth.js';

const router = Router()

router.post('/submit', userAuth, addDetailsController)

export default router