import { extractAadharNumber, extractGstNumber, extractIncorporationDetails, extractPanNumber, extractUdyamNumber } from "../services/extraction.service.js";
import processImage from "../services/imageProcessing.service.js";
import runOCR from "../services/ocr.service.js";
import fs from 'fs/promises'
import { sendError, sendSuccess } from "../utils/response.js";

const extractPan = async (req, res) => {
   let uploadedImagePath = ''
   let processedImagePath = ''
   
   if (!req.file) {
      return sendError(res, 400, 'No image uploaded')
   }

   try {
      uploadedImagePath = req.file.path

      processedImagePath = await processImage(uploadedImagePath)

      const extractedText = await runOCR(processedImagePath)

      console.log(extractedText)

      const panNumber = extractPanNumber(extractedText)

      if (!panNumber) {
         return sendError(res, 422, 'Could not detect PAN Number')
      }

      sendSuccess(res, 200, 'PAN Number extracted successfully', { panNumber })

   } catch (err) {
      return sendError(res, 500, err.message);

   } finally {
      try {
         if (uploadedImagePath) {
            await fs.unlink(uploadedImagePath)
         }
         if (processedImagePath) {
            await fs.unlink(processedImagePath)
         }
      } catch (cleanupErr) {
         console.log('Error: ' + cleanupErr.message)
      }
   }
}

const extractAadhar = async (req, res) => {
   let uploadedImagePath = ''
   let processedImagePath = ''
   
   if (!req.file) {
      return sendError(res, 400, 'No image uploaded')
   }

   try {
      uploadedImagePath = req.file.path

      processedImagePath = await processImage(uploadedImagePath)

      const extractedText = await runOCR(processedImagePath)

      console.log(extractedText)

      const aadharNumber = extractAadharNumber(extractedText)

      if (!aadharNumber) {
         return sendError(res, 422, 'Could not detect Aadhar Number')
      }

      sendSuccess(res, 200, 'Aadhar Number extracted successfully', { aadharNumber })

   } catch (err) {
      return sendError(res, 500, err.message);
      
   } finally {
      try {
         if (uploadedImagePath) {
            await fs.unlink(uploadedImagePath)
         }
         if (processedImagePath) {
            await fs.unlink(processedImagePath)
         }
      } catch (cleanupErr) {
         console.log(cleanupErr.message)
      }
   }
}

const extractIncorporation = async (req, res) => {
   let uploadedImagePath = ''
   let processedImagePath = ''
   
   if (!req.file) {
      return sendError(res, 400, 'No image uploaded')
   }

   try {
      uploadedImagePath = req.file.path

      processedImagePath = await processImage(uploadedImagePath)

      const extractedText = await runOCR(processedImagePath)

      console.log(extractedText)

      const { companyName, cin, businessType } = extractIncorporationDetails(extractedText)

      // if (cin === '' && businessType === '') {
      //    return sendError(res, 422, 'Could not detect the details')
      // }

      sendSuccess(res, 200, 'Details extracted successfully', { companyName, cin, businessType })

   } catch (err) {
      return sendError(res, 500, err.message);
      
   } finally {
      try {
         if (uploadedImagePath) {
            await fs.unlink(uploadedImagePath)
         }
         if (processedImagePath) {
            await fs.unlink(processedImagePath)
         }
      } catch (cleanupErr) {
         console.log('ERROR: ', cleanupErr.message)
      }
   }
}

const extractUdyam = async (req, res) => {
   let uploadedImagePath = ''
   let processedImagePath = ''
   
   if (!req.file) {
      return sendError(res, 400, 'No image uploaded')
   }

   try {
      uploadedImagePath = req.file.path

      processedImagePath = await processImage(uploadedImagePath)

      const extractedText = await runOCR(processedImagePath)

      console.log(extractedText)

      const urn = extractUdyamNumber(extractedText)

      if (!urn) {
         return sendError(res, 422, 'Could not detect URN Number')
      }

      sendSuccess(res, 200, 'URN Number extracted successfully', { urn })

   } catch (err) {
      return sendError(res, 500, err.message);
   } finally {
      try {
         if (uploadedImagePath) {
            await fs.unlink(uploadedImagePath)
         }
         if (processedImagePath) {
            await fs.unlink(processedImagePath)
         }
      } catch (cleanupErr) {
         console.log('ERROR: ', cleanupErr.message)
      }
   }
}

const extractGstin = async (req, res) => {
   let uploadedImagePath = ''
   let processedImagePath = ''
   
   if (!req.file) {
      return sendError(res, 400, 'No image uploaded')
   }

   try {
      uploadedImagePath = req.file.path

      processedImagePath = await processImage(uploadedImagePath)

      const extractedText = await runOCR(processedImagePath)

      console.log(extractedText)

      const gstin = extractGstNumber(extractedText)
      
      if (!gstin) {
         return sendError(res, 422, 'Could not detect GSTIN Number')
      }
      
      sendSuccess(res, 200, 'GSTIN Number extracted successfully', { gstin })
      
   } catch (err) {
      return sendError(res, 500, err.message);
   } finally {
      try {
         if (uploadedImagePath) {
            await fs.unlink(uploadedImagePath)
         }
         if (processedImagePath) {
            await fs.unlink(processedImagePath)
         }
      } catch (cleanupErr) {
         console.log('ERROR: ', cleanupErr.message)
      }
   }
}

export {
   extractPan,
   extractAadhar,
   extractIncorporation,
   extractUdyam,
   extractGstin
}