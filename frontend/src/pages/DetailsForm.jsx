import { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/detail-form.css";
import { delay } from "../helpers/helpers";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   Alert02Icon,
   Building03Icon,
   Call02Icon,
   HashtagIcon,
   Loading03Icon,
   Mail01Icon,
   User03Icon,
} from "@hugeicons/core-free-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const DetailsForm = () => {
   const [formError, setFormError] = useState("");
   const [formSuccess, setFormSuccess] = useState("");

   const { backendUrl, setIsLoggedIn, getUserData } = useContext(AuthContext);
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      identificationNumber: "",
      companyName: "",
      businessType: "",
      cinNumber: "",
      urnNumber: "",
      gstinNumber: ''
   });

   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);
   const [identityLoading, setIdentityLoading] = useState(false);
   const [cinLoading, setCinLoading] = useState(false);
   const [urnLoading, setUrnLoading] = useState(false);
   const [gstinLoading, setGstinLoading] = useState(false)
   const [selectedIdentity, setSelectedIdentity] = useState("pan");

   const nameRegex = /^[a-zA-z\s]{3,}$/;
   const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
   const phoneRegex = /^\d{10}$/;
   const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
   const BUSINESS_TYPE = [
      "PRIVATE LIMITED",
      "PUBLIC LIMITED",
      "ONE PERSON",
      'LIMITED',
      "LIMITED LIABILITY COMPANY",
      "LIMITED LIABILITY PARTNERSHIP",
      "LLP",
      "LLC",
   ];
   const cinRegex = /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
   const urnRegex = /^UDYAM-(?:I-)?[A-Z]{2}-\d{2}-\d{7}$/;
   const gstRegex = /^\d{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z\d]Z[A-Z\d]$/;

   const validateField = (fieldName) => {
      switch (fieldName) {
         case "name":
            if (!formData.name) {
               return "Name is required!";
            } else if (!nameRegex.test(formData.name)) {
               return "Name should only contain alphabets and at least 3 charcters long!";
            }
            break;
         case "email":
            if (!formData.email) {
               return "Email is required!";
            } else if (!emailRegex.test(formData.email)) {
               return "Invalid Email format!";
            }
            break;
         case "phone":
            if (!formData.phone) {
               return "Phone Number is required!";
            } else if (!phoneRegex.test(formData.phone)) {
               return "Invalid Phone Number format!";
            }
            break;
         case "identificationNumber":
            if (!formData.identificationNumber) {
               return `${selectedIdentity === "pan" ? "PAN" : "Aadhar"} number is required!`;
            } else if (
               selectedIdentity === "aadhar" &&
               !aadharRegex.test(formData.identificationNumber)
            ) {
               return "Invalid Aadhar Number format!";
            } else if (
               selectedIdentity === "pan" &&
               !panRegex.test(formData.identificationNumber)
            ) {
               return "Invalid PAN Number format!";
            }
            break;
         case "companyName":
            if (!formData.companyName) {
               return "Company Name is required!";
            } else if (!nameRegex.test(formData.companyName)) {
               return "Company Name should only contain alphabets and at least 3 charcters long!";
            }
            break;
         case "businessType":
            if (!formData.businessType) {
               return "Business Type is required!";
            } else if (!BUSINESS_TYPE.includes(formData.businessType)) {
               return "Invalid Business Type!";
            }
            break;
         case "cinNumber":
            if (!formData.cinNumber) {
               return "CIN Number is required!";
            } else if (!cinRegex.test(formData.cinNumber)) {
               return "Invalid CIN Number format!";
            }
            break;
         case "urnNumber":
            if (!formData.urnNumber) {
               return "URN Number is required!";
            } else if (!urnRegex.test(formData.urnNumber)) {
               return "Invalid URN Number format!";
            }
            break;
         case "gstinNumber":
            if (!formData.gstinNumber) {
               return "GSTIN Number is required!";
            } else if (!gstRegex.test(formData.gstinNumber)) {
               return "Invalid GSTIN Number format!";
            }
            break;
         default:
            return "";
      }
      return "";
   };

   const addBorder = (errorObject, fdName) => {
      const inputs = document.getElementsByName(fdName);
      if (!inputs || inputs.length === 0) return;

      const parentEle = inputs[0].parentElement;
      if (!errorObject[fdName]) {
         parentEle.classList.add("correct");
         parentEle.classList.remove("error");
      } else {
         parentEle.classList.add("error");
         parentEle.classList.remove("correct");
      }
   };

   const validateForm = () => {
      const newErrors = {};

      Object.keys(formData).forEach((field) => {
         let err = validateField(field);
         if (err) {
            newErrors[field] = err;
         }
         addBorder(newErrors, field);
      });
      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      let finalValue = value

      if (name === "identificationNumber" && selectedIdentity === "aadhar") {
         finalValue = value.replace(/[^0-9\s]/g, "");
      }

      if (name === 'businessType') {
         finalValue = value.toUpperCase()
      }

      setFormData({
         ...formData,
         [name]: finalValue,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const isValid = validateForm();

      if (isValid) {
         setLoading(true);
         try {
            setFormError("");
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(
               `${backendUrl}/api/details/submit`,
               { ...formData, selectedIdentity },
            );

            if (data.success) {
               setFormSuccess(data.message);
               setIsLoggedIn(true);
               getUserData();
               await delay(1400);
               navigate("/");
            } else {
               setFormError(data.message);
            }
         } catch (err) {
            setFormError(err.response?.data?.message || err.message);
         }
      }
      setLoading(false);
   };

   const handleUpload = async (e, doc) => {
      setIdentityLoading(true);
      const file = e.target.files[0];

      if (!file) return;

      try {
         const fileData = new FormData();
         fileData.append("document", file);

         const { data } = await axios.post(
            `${backendUrl}/api/docs/extract-${doc}`,
            fileData,
         );

         if (data.success) {
            const apiKey = doc === "pan" ? "panNumber" : "aadharNumber";
            const extractedValue = data[apiKey] || "";

            const newErrors = { ...errors };

            if (!formData.identificationNumber) {
               setFormData((prev) => ({
                  ...prev,
                  identificationNumber: extractedValue,
               }));
               delete newErrors.identificationNumber;
            } else {
               if (formData.identificationNumber !== extractedValue) {
                  newErrors.identificationNumber = `The extracted ${doc === "pan" ? "PAN" : "Aadhar"} number doesn't match with the entered number. Please check or try again.`;
               } else {
                  delete newErrors.identificationNumber;
               }
            }

            setErrors(newErrors);
            addBorder(newErrors, "identificationNumber");

         }
      } catch (err) {
         setFormError(err.response?.data?.message);
      } finally {
         setIdentityLoading(false);
         e.target.value = "";
      }
   };

   const handleIncorpUpload = async (e) => {
      setCinLoading(true);
      const file = e.target.files[0];

      if (!file) return;

      try {
         const fileData = new FormData();
         fileData.append("document", file);

         const { data } = await axios.post(
            `${backendUrl}/api/docs/extract-corp-details`,
            fileData,
         );

         if (data.success) {
            const { companyName, cin, businessType } = data;

            const newErrors = { ...errors };
            const updatedFormData = { ...formData };

            if (companyName) {
               if (!formData.companyName) {
                  updatedFormData.companyName = companyName;
                  delete newErrors.companyName;
               } else {
                  if (formData.companyName !== cin) {
                     newErrors.companyName = `The extracted CIN Number doesn't match with the entered number. Please check or try again`;
                  } else {
                     delete newErrors.companyName;
                  }
               }

               setTimeout(() => addBorder(newErrors, "companyName"), 0);
            } else {
               newErrors.companyName = `Couldn't detect Company Name`
            }

            if (cin) {
               if (!formData.cinNumber) {
                  updatedFormData.cinNumber = cin;
                  delete newErrors.cinNumber;
               } else {
                  if (formData.cinNumber !== cin) {
                     newErrors.cinNumber = `The extracted CIN Number doesn't match with the entered number. Please check or try again`;
                  } else {
                     delete newErrors.cinNumber;
                  }
               }

               setTimeout(() => addBorder(newErrors, "cinNumber"), 0);
            } else {
               newErrors.cinNumber = `Couldn't detect CIN Number`
            }

            if (businessType) {
               if (!formData.businessType) {
                  updatedFormData.businessType = businessType;
                  delete newErrors.businessType;
               } else {
                  if (formData.businessType !== businessType) {
                     newErrors.businessType = `The extracted Business Type doesn't match with the entered number. Please check or try again`;
                  } else {
                     delete newErrors.businessType;
                  }
               }

               setTimeout(() => addBorder(newErrors, "businessType"), 0);
            } else {
               newErrors.businessType = `Couldn't detect Business Type`
            }

            setErrors(newErrors);
            setFormData(updatedFormData);
         }
      } catch (err) {
         setFormError(err.response?.data?.message);
      } finally {
         setCinLoading(false);
         e.target.value = "";
      }
   };

   const handleUdyamUpload = async (e) => {
      setUrnLoading(true);
      const file = e.target.files[0];

      if (!file) return;

      try {
         const fileData = new FormData();
         fileData.append("document", file);

         const { data } = await axios.post(
            `${backendUrl}/api/docs/extract-udyam`,
            fileData,
         );

         if (data.success) {
            const { urn } = data

            const newErrors = { ...errors };
            const updatedFormData = { ...formData };

            if (!formData.urnNumber) {
               updatedFormData.urnNumber = urn;
               delete newErrors.urnNumber;
            } else {
               if (formData.urnNumber !== urn) {
                  newErrors.urnNumber = `The extracted URN Number doesn't match with the entered number. Please check or try again`;
               } else {
                  delete newErrors.urnNumber;
               }
            }

            setTimeout(() => addBorder(newErrors, "urnNumber"), 0);

            setErrors(newErrors);
            setFormData(updatedFormData);
         }
      } catch (err) {
         setFormError(err.response?.data?.message);
      } finally {
         setUrnLoading(false);
         e.target.value = "";
      }
   };

   const handleGstinUpload = async (e) => {
      setGstinLoading(true);
      const file = e.target.files[0];

      if (!file) return;

      try {
         const fileData = new FormData();
         fileData.append("document", file);

         const { data } = await axios.post(
            `${backendUrl}/api/docs/extract-gstin`,
            fileData,
         );

         if (data.success) {
            const { gstin } = data

            const newErrors = { ...errors };
            const updatedFormData = { ...formData };

            if (!formData.gstinNumber) {
               updatedFormData.gstinNumber = gstin;
               delete newErrors.gstinNumber;
            } else {
               if (formData.gstinNumber !== gstin) {
                  newErrors.gstinNumber = `The extracted GSTIN Number doesn't match with the entered number. Please check or try again`;
               } else {
                  delete newErrors.gstinNumber;
               }
            }

            setTimeout(() => addBorder(newErrors, "gstinNumber"), 0);

            setErrors(newErrors);
            setFormData(updatedFormData);
         }
      } catch (err) {
         setFormError(err.response?.data?.message);
      } finally {
         setGstinLoading(false);
         e.target.value = "";
      }
   }

   return (
      <>
         <Navbar />
         <main className="auth-main auth-main-centered details-main-viewport">
            <div className="form-card detail-form-card">
               <h1>OCR Test form</h1>
               <p>Fill in your details to get started</p>
               {formError && <div className="auth-error">{formError}</div>}
               {formSuccess && (
                  <div className="auth-success">{formSuccess}</div>
               )}

               <form>
                  <div className="input-group">
                     <label htmlFor="name">Full Name</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={User03Icon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           onChange={handleChange}
                           value={formData.name}
                           name="name"
                           placeholder="Rahul Sharma"
                        />
                        <span className="error-text">{errors.name}</span>
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="email">Email Address</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={Mail01Icon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="email"
                           onChange={handleChange}
                           value={formData.email}
                           name="email"
                           placeholder="rahul@example.com"
                        />
                        <span className="error-text">{errors.email}</span>
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="phone">Phone Number</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={Call02Icon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           inputMode="numeric"
                           onChange={handleChange}
                           value={formData.phone}
                           name="phone"
                           maxLength={10}
                           placeholder="9638527410"
                        />
                        <span className="error-text">{errors.phone}</span>
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="identificationNumber">
                        Identification Number{" "}
                        {`(${selectedIdentity === "pan" ? "PAN" : "Aadhar"} Number)`}
                     </label>
                     <select
                        className="identity-select"
                        value={selectedIdentity}
                        onChange={(e) => {
                           setSelectedIdentity(e.target.value);
                           setFormData((prev) => ({
                              ...prev,
                              identificationNumber: "",
                           }));
                           setErrors((prev) => {
                              const clean = { ...prev };
                              delete clean.identificationNumber;
                              return clean;
                           });
                           e.target.parentElement.classList.remove(
                              "error",
                              "correct",
                           );
                        }}
                        disabled={identityLoading}
                     >
                        <option value="pan">PAN Number</option>
                        <option value="aadhar">Aadhar Number</option>
                     </select>
                     <div className="input-wrapper file-input-wrapper">
                        <HugeiconsIcon
                           icon={HashtagIcon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           inputMode={
                              selectedIdentity === "pan" ? "text" : "numeric"
                           }
                           onChange={handleChange}
                           id="identificationNumber"
                           value={formData.identificationNumber}
                           name="identificationNumber"
                           maxLength={selectedIdentity === "pan" ? 10 : 14}
                           placeholder={
                              selectedIdentity === "pan"
                                 ? "ABCDE1234F"
                                 : "1234 4567 9654"
                           }
                           disabled={identityLoading}
                        />
                        <input
                           type="file"
                           accept=".jpeg, .png, .jpg"
                           onChange={(e) => handleUpload(e, selectedIdentity)}
                           disabled={identityLoading}
                        />
                        <span className="error-text">
                           {errors.identificationNumber}
                        </span>
                        {identityLoading ? (
                           <span className="text-extract-loading">
                              <HugeiconsIcon
                                 icon={Loading03Icon}
                                 size={14}
                                 className="spin-animation"
                              />{" "}
                              Extracting Identification Number....
                           </span>
                        ) : (
                           <span className="text-extract-loading label-info">
                              <HugeiconsIcon icon={Alert02Icon} size={12} />{" "}
                              Please verify the extracted text before submitting
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="companyName">Company Name</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={Building03Icon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           id="companyName"
                           onChange={handleChange}
                           value={formData.companyName}
                           name="companyName"
                           placeholder="e.g., ABC Company"
                           disabled={cinLoading}
                        />
                        <span className="error-text">{errors.companyName}</span>
                        {cinLoading ? (
                           <span className="text-extract-loading">
                              <HugeiconsIcon
                                 icon={Loading03Icon}
                                 size={14}
                                 className="spin-animation"
                              />{" "}
                              Extracting Company Name....
                           </span>
                        ) : (
                           <span className="text-extract-loading label-info">
                              <HugeiconsIcon icon={Alert02Icon} size={12} />{" "}
                              Please verify the extracted text before submitting
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="businessType">Business Type</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={Building03Icon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           id="businessType"
                           onChange={handleChange}
                           value={formData.businessType}
                           name="businessType"
                           placeholder="e.g., PRIVATE LIMITED"
                           disabled={cinLoading}
                        />
                        <span className="error-text">
                           {errors.businessType}
                        </span>
                        {cinLoading ? (
                           <span className="text-extract-loading">
                              <HugeiconsIcon
                                 icon={Loading03Icon}
                                 size={14}
                                 className="spin-animation"
                              />{" "}
                              Extracting Business Type....
                           </span>
                        ) : (
                           <span className="text-extract-loading label-info">
                              <HugeiconsIcon icon={Alert02Icon} size={12} />{" "}
                              Please verify the extracted text before submitting
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="cin">Company Identification Number (CIN)</label>
                     <div className="input-wrapper file-input-wrapper">
                        <HugeiconsIcon
                           icon={HashtagIcon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           id="cin"
                           onChange={handleChange}
                           value={formData.cinNumber}
                           name="cinNumber"
                           maxLength={21}
                           placeholder="e.g., U00000RJ2026PTC000000"
                           disabled={cinLoading}
                        />
                        <input
                           type="file"
                           accept=".jpeg, .png, .jpg"
                           onChange={handleIncorpUpload}
                           disabled={cinLoading}
                        />
                        <span className="error-text">{errors.cinNumber}</span>
                        {cinLoading ? (
                           <span className="text-extract-loading">
                              <HugeiconsIcon
                                 icon={Loading03Icon}
                                 size={14}
                                 className="spin-animation"
                              />{" "}
                              Extracting CIN Number....
                           </span>
                        ) : (
                           <span className="text-extract-loading label-info">
                              <HugeiconsIcon icon={Alert02Icon} size={12} />{" "}
                              Please verify the extracted text before submitting
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="urn">
                        Udyam Registration Number (URN) of the Company
                     </label>
                     <div className="input-wrapper file-input-wrapper">
                        <HugeiconsIcon
                           icon={HashtagIcon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           id="urn"
                           onChange={handleChange}
                           value={formData.urnNumber}
                           name="urnNumber"
                           maxLength={19}
                           placeholder="e.g., UDYAM-XX-00-0000000"
                           disabled={urnLoading}
                        />
                        <input
                           type="file"
                           accept=".jpeg, .png, .jpg"
                           onChange={handleUdyamUpload}
                           disabled={urnLoading}
                        />
                        <span className="error-text">{errors.urnNumber}</span>
                        {urnLoading ? (
                           <span className="text-extract-loading">
                              <HugeiconsIcon
                                 icon={Loading03Icon}
                                 size={14}
                                 className="spin-animation"
                              />{" "}
                              Extracting URN Number....
                           </span>
                        ) : (
                           <span className="text-extract-loading label-info">
                              <HugeiconsIcon icon={Alert02Icon} size={12} />{" "}
                              Please verify the extracted text before submitting
                           </span>
                        )}
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="gstin">
                        GSTIN of the Company
                     </label>
                     <div className="input-wrapper file-input-wrapper">
                        <HugeiconsIcon
                           icon={HashtagIcon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           id="gstin"
                           onChange={handleChange}
                           value={formData.gstinNumber}
                           name="gstinNumber"
                           maxLength={19}
                           placeholder="e.g., 00ABCDE1234F1Z5"
                           disabled={gstinLoading}
                        />
                        <input
                           type="file"
                           accept=".jpeg, .png, .jpg"
                           onChange={handleGstinUpload}
                           disabled={gstinLoading}
                        />
                        <span className="error-text">{errors.gstinNumber}</span>
                        {gstinLoading ? (
                           <span className="text-extract-loading">
                              <HugeiconsIcon
                                 icon={Loading03Icon}
                                 size={14}
                                 className="spin-animation"
                              />{" "}
                              Extracting GSTIN Number....
                           </span>
                        ) : (
                           <span className="text-extract-loading label-info">
                              <HugeiconsIcon icon={Alert02Icon} size={12} />{" "}
                              Please verify the extracted text before submitting
                           </span>
                        )}
                     </div>
                  </div>

                  <button
                     className="form-btn"
                     onClick={handleSubmit}
                     disabled={loading}
                  >
                     {loading ? "Submitting..." : "Submit"}
                  </button>
               </form>
            </div>
         </main>
      </>
   );
};

export default DetailsForm;
