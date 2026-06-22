import { addDetails } from "../models/details.model.js";
import { sendError, sendSuccess } from "../utils/response.js";

const addDetailsController = async (req, res) => {
   const { name, email, phone, selectedIdentity, identificationNumber, companyName, businessType, cinNumber, urnNumber, gstinNumber } = req.body

   if (!name || !email || !phone || !selectedIdentity || !identificationNumber || !companyName || !businessType || !cinNumber || !urnNumber || !gstinNumber) {
      return sendError(res, 400, 'Missing Details!')
   }

   try {
      const detail_id = await addDetails({ name, email, phone, selectedIdentity, identificationNumber, companyName, businessType, cinNumber, urnNumber, gstinNumber })

      return sendSuccess(res, 200, 'Details successfully submitted')
   } catch (err) {
      return sendError(res, 500, err.message)
   }
}

export {
   addDetailsController
}