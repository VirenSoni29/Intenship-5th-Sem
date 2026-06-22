import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import "../css/register.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   ArrowLeft01Icon,
   LockPasswordIcon,
   Mail01Icon,
   MatrixIcon,
} from "@hugeicons/core-free-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { delay } from "../helpers/helpers.js";

const ForgetPasswordNav = () => {
   return (
      <header className="navbar">
         <Link to="/" className="logo">
            <div className="logo-icon">
               <img src="/logo.svg" alt="SlotSync logo" />
            </div>
            SlotSync
         </Link>
         <div className="login-link">
            Remembered it?{" "}
            <Link to="/login" className="link">
               Login
            </Link>
         </div>
      </header>
   );
};

const ForgetPasswordContainer = () => {
   const navigate = useNavigate();
   const [state, setState] = useState("email");
   const { backendUrl } = useContext(AuthContext);

   const [email, setEmail] = useState("");
   const [otpCode, setOtpCode] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [resetError, setResetError] = useState("");
   const [resetSuccess, setResetSuccess] = useState("");
   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

   const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;

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
         case "email":
            if (!email) {
               return "Email is required!";
            } else if (!emailRegex.test(email)) {
               return "Invalid Email format!";
            }
            break;
         case "otpCode":
            if (!otpCode) {
               return "OTP is required";
            }
            break;
         case "newPassword":
            if (!newPassword) {
               return "Password is required!";
            } else if (!isValidPassword(newPassword)) {
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

   const validateForm = (fields) => {
      const newErrors = {};

      fields.forEach((field) => {
         let err = validateField(field);
         if (err) {
            newErrors[field] = err;
         }
         addBorder(newErrors, field);
      });
      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
   };

   const sendResetOtp = async () => {
      const isValid = validateForm(["email"]);
      if (isValid) {
         setResetError("");
         setResetSuccess("");
         setLoading(true);
         try {
            const { data } = await axios.post(
               `${backendUrl}/api/auth/send-reset-otp`,
               { email },
            );
            if (data.success) {
               setResetError("");
               setResetSuccess(data.message);
               setState("otp");
            } else {
               setResetSuccess("");
               setResetError(data.message);
            }
         } catch (err) {
            setResetSuccess("");
            setResetError(err.response?.data?.message || err.message);
         }
         setLoading(false);
      }
      setLoading(false);
   };

   const handleResetPassword = async () => {
      const isValid = validateForm(["otpCode", "newPassword"]);
      if (isValid) {
         setResetError("");
         setResetSuccess("");
         setLoading(true);
         try {
            const { data } = await axios.patch(
               `${backendUrl}/api/auth/reset-password`,
               { email, otpCode, newPassword },
            );
            if (data.success) {
               setResetError("");
               setResetSuccess(data.message);
               await delay(1200);
               navigate("/login");
            } else {
               setResetSuccess("");
               setResetError(data.message);
            }
         } catch (err) {
            setResetSuccess("");
            setResetError(err.response?.data?.message || err.message);
         }
      }
      setLoading(false);
   };

   return (
      <main className="auth-main auth-main-centered">
         <div className="form-card forget-card">
            {state === "email" && (
               <>
                  <div className="forget-icon-wrap">
                     <HugeiconsIcon icon={LockPasswordIcon} strokeWidth={2} />
                  </div>
                  <h1>Forgot Password?</h1>
                  <p>Enter your email and we'll send you a reset code.</p>
               </>
            )}
            {state === "otp" && (
               <>
                  <div className="forget-icon-wrap">
                     🔐
                  </div>
                  <h1>Reset your Password</h1>
                  <p>Enter the OTP and your New Password.</p>
               </>
            )}
            {resetError && <div className="auth-error">{resetError}</div>}
            {resetSuccess && <div className="auth-success">{resetSuccess}</div>}

            {state === "email" && (
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
                        name="email"
                        value={email}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") sendResetOtp();
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@example.com"
                     />
                     <span className="error-text">{errors.email}</span>
                  </div>
               </div>
            )}
            {state === "otp" && (
               <>
                  <div className="input-group">
                     <label htmlFor="email">Enter OTP</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={MatrixIcon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           name="otpCode"
                           inputMode="numeric"
                           maxLength={6}
                           value={otpCode}
                           onChange={(e) => {
                              const cleanValue = e.target.value.replace(
                                 /\D/g,
                                 "",
                              );
                              setOtpCode(cleanValue);
                           }}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") handleResetPassword();
                           }}
                           placeholder="OTP Code"
                        />
                        <span className="error-text">{errors.otpCode}</span>
                     </div>
                  </div>
                  <div className="input-group">
                     <label htmlFor="email">Enter New Password</label>
                     <div className="input-wrapper">
                        <HugeiconsIcon
                           icon={LockPasswordIcon}
                           strokeWidth={2}
                           className="input-icon"
                        />
                        <input
                           type="password"
                           name="newPassword"
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") handleResetPassword();
                           }}
                           placeholder="Minimum 8 characters"
                        />
                        <span className="error-text">{errors.newPassword}</span>
                     </div>
                  </div>
               </>
            )}

            {state === "email" && (
               <>
                  <button
                     className="form-btn"
                     onClick={sendResetOtp}
                     disabled={loading}
                  >
                     {loading ? "Sending..." : "Send Reset OTP"}
                  </button>
                  <Link to="/login" className="back-login">
                     <HugeiconsIcon icon={ArrowLeft01Icon} /> Back to Login
                  </Link>
               </>
            )}
            {state === "otp" && (
               <button
                  className="form-btn"
                  onClick={handleResetPassword}
                  disabled={loading}
               >
                  {loading ? "Wait..." : "Reset Password"}
               </button>
            )}
         </div>
      </main>
   );
};

const ForgetPassword = () => {
   return (
      <>
         <ForgetPasswordNav />
         <ForgetPasswordContainer />
      </>
   );
};

export default ForgetPassword;
