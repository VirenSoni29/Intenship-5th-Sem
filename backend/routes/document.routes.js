import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";
import { extractAadhar, extractGstin, extractIncorporation, extractPan, extractUdyam } from "../controllers/document.controller.js";

const router = Router()

router.post('/extract-pan', upload.single('document'), extractPan)
router.post('/extract-aadhar', upload.single('document'), extractAadhar)
router.post('/extract-corp-details', upload.single('document'), extractIncorporation)
router.post('/extract-udyam', upload.single('document'), extractUdyam)
router.post('/extract-gstin', upload.single('document') ,extractGstin)

export default router