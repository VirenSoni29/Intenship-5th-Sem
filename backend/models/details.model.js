import db from '../config/db.js';

const addDetails = async ({ name, email, phone, selectedIdentity, identificationNumber, companyName, businessType, cinNumber, urnNumber, gstinNumber }) => {
   const [result] = await db.execute(
      `INSERT INTO details (name, email, phone, identification_type, identification_number, company_name, business_type, cin_number, urn_number, gstin_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, selectedIdentity, identificationNumber, companyName, businessType, cinNumber, urnNumber, gstinNumber]
   );
};

export {
   addDetails
}