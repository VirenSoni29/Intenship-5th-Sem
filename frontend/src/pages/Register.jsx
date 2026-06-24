import { HugeiconsIcon } from "@hugeicons/react";
import Navbar from "../components/Navbar";
import {
   Call02Icon,
   CheckmarkCircle02Icon,
   LockPasswordIcon,
   Mail01Icon,
   User03Icon,
} from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "react-router-dom";
import "../css/register.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { delay } from '../helpers/helpers.js'

const LeftPanel = () => {
   return (
      <div className="left-panel">
         <span className="tag">Join Slotsync</span>
         <h2>
            Book appointments
            <br />
            without the hassle.
         </h2>
         <p>
            Create your free account and start booking slots from hundreds of
            services near you.
         </p>
         <div className="check-list">
            <div>
               <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="list-icon"
               />{" "}
               No booking fees
            </div>
            <div>
               <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="list-icon"
               />{" "}
               Instant confirmation via email
            </div>
            <div>
               <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="list-icon"
               />{" "}
               Cancel or reschedule anytime
            </div>
         </div>
      </div>
   );
};

const RightPanel = () => {
   const { backendUrl, setIsLoggedIn } = useContext(AuthContext);
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
   });

   const [errors, setErrors] = useState({});
   const [authError, setAuthError] = useState("");
   const [authSuccess, setAuthSuccess] = useState('')
   const [loading, setLoading] = useState(false)

   const nameRegex = /^[a-zA-z\s]{3,}$/;
   const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
   const phoneRegex = /^\d{10}$/;

   const isValidPassword = (value) => {
      const symbolRegex = /[!@#$%^&*()_]/;
      const numberRegex = /\d/;
      const lowerCaseRegex = /[a-z]/;
      const upperCaseRegex = /[A-Z]/;

      return (
         value.length >= 8 &&
         symbolRegex.test(value) &&
         numberRegex.test(value) &&
         lowerCaseRegex.test(value) &&
         upperCaseRegex.test(value)
      );
   };

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
         case "password":
            if (!formData.password) {
               return "Password is required!";
            } else if (!isValidPassword(formData.password)) {
               return "Password should at least contain 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character!";
            }
            break;
         default:
            return "";
      }
      return "";
   };

   const addBorder = (errorObject, fdName) => {
      let parentEle = document.getElementsByName(fdName)[0].parentElement;
      console.log(errorObject[fdName]);
      console.log(errorObject[fdName] && true);
      if (!errorObject[fdName]) {
         parentEle.classList.add("correct");
         console.log("correct added");
         parentEle.classList.remove("error");
         console.log("error removed");
      } else {
         parentEle.classList.add("error");
         console.log("error added");
         parentEle.classList.remove("correct");
         console.log("correct removed");
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

      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const isValid = validateForm();

      if (isValid) {
         setLoading(true)
         try {
            setAuthError("");
            axios.defaults.withCredentials = true
            const {data} = await axios.post(`${backendUrl}/api/auth/register`, formData)

            if (data.success) {
               setAuthSuccess(data.message)
               setIsLoggedIn(true);
               await delay(1400)
               navigate("/");
            } else {
               setAuthError(data.message);
            }
         } catch (err) {
            setAuthError(err.response?.data?.message || 'Server Error. Please try later.');
         }
      }
      setLoading(false)
   };

   return (
      <div className="right-panel">
         <div className="form-card width">
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
            {authError && <div className="auth-error">{authError}</div>}
            {authSuccess && <div className="auth-success">{authSuccess}</div>}

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
                        style={{ width: "50%" }}
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
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                     <HugeiconsIcon
                        icon={LockPasswordIcon}
                        strokeWidth={2}
                        className="input-icon"
                     />
                     <input
                        type="password"
                        onChange={handleChange}
                        value={formData.password}
                        name="password"
                        placeholder="Minimum 8 characters"
                     />
                     <span className="error-text">{errors.password}</span>
                  </div>
               </div>
               <button className="form-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'}
               </button>
            </form>
            <p className="terms">
               By signing up you agree to our{" "}
               <Link className="link">Terms of Service</Link> and{" "}
               <Link className="link">Privacy Policy</Link>.
            </p>
         </div>
      </div>
   );
};

const Register = () => {
   return (
      <>
         <Navbar mode="register" />
         <main className="auth-main">
            <LeftPanel />
            <RightPanel />
         </main>
      </>
   );
};

export default Register;
