import { AADHAR_REGEX, BUSINESS_TYPE, CIN_REGEX, GSTIN_REGEX, LLPIN_REGEX, PAN_REGEX, URN_REGEX } from "../utils/regexPatterns.js";

const extractPanNumber = (text) => {
   const cleanedText = text.replace(/\s/g, '')
   const match = cleanedText.match(PAN_REGEX)

   return match ? match[0] : null
}

const extractAadharNumber = (text) => {
   const match = text.match(AADHAR_REGEX)
   let cleanedMatch
   if (match) cleanedMatch = match[0].replace(/[\s-]/g, '')
   
   return cleanedMatch ? cleanedMatch : null
}

const extractIncorporationDetails = (text) => {
   const lines = text.split('\n')

   let cin = '', businessType = ''

   for (const line of lines) {
      if (!cin) {
         const cinMatch = line.match(CIN_REGEX) || line.match(LLPIN_REGEX)
         if (cinMatch) {
            cin = cinMatch[0].toUpperCase()
         }
      }

      if (!businessType) {
         const foundType = BUSINESS_TYPE.find(type => text.toLowerCase().includes(type.toLowerCase()))
         if (foundType) {
            businessType = foundType
         }
      }

      if (cin && businessType) {
         break
      }
   }

   const companyNameRegex = new RegExp(`([A-Z0-9\\s,&'.\'\"“”‘’\\-]+?\\s+${businessType})`);
   const companyNameMatch = (text.match(companyNameRegex))
   let companyName

   if (companyNameMatch) {
      companyName = companyNameMatch[0].trim()
   }
   
   return { companyName, cin, businessType }
}

const extractUdyamNumber = (text) => {
   const lines = text.split('\n')

   let urn = ''

   for (const line of lines) {
      const urnMatch = line.match(URN_REGEX)
      if (urnMatch) {
         urn = urnMatch[0].toUpperCase()
         break;
      }
   }

   return urn
}

const extractGstNumber = (text) => {
   const lines = text.split('\n')

   let gstin = ''

   for (const line of lines) {
      const gstMatch = line.match(GSTIN_REGEX)
      if (gstMatch) {
         gstin = gstMatch[0].toUpperCase()
         break;
      }
   }

   return gstin
}

export {
   extractPanNumber,
   extractAadharNumber,
   extractIncorporationDetails,
   extractUdyamNumber,
   extractGstNumber
}