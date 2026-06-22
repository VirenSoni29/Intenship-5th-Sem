import { Router } from 'express'
import userAuth from '../middleware/userAuth.js';
import { isAdmin } from '../middleware/roleMiddleware.js'
import { approve, enrollFaceController, getAllUsers, pending, reject, verifyFace } from '../controllers/admin.controller.js';

const router = Router()

router.use(userAuth)
router.use(isAdmin)

router.get('/get-all-users', getAllUsers)
router.patch('/approve/:id', approve)
router.patch('/reject/:id', reject)
router.patch('/pending/:id', pending)

router.post('/enroll-face', enrollFaceController)
router.post('/verify-face', verifyFace)

export default router