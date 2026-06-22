import { HugeiconsIcon } from "@hugeicons/react";
import Navbar from "../components/Navbar";
import {
   CheckmarkCircle02Icon,
   LockPasswordIcon,
   Mail01Icon,
} from "@hugeicons/core-free-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/register.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { delay } from "../helpers/helpers.js";

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
   const { backendUrl, setIsLoggedIn, getUserData } = useContext(AuthContext);
   const navigate = useNavigate();
   const location = useLocation()
   const from = location.state?.from?.pathname

   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const [errors, setErrors] = useState({});
   const [authError, setAuthError] = useState("");
   const [authSuccess, setAuthSuccess] = useState('')
   const [loading, setLoading] = useState(false);

   const validateField = (fieldName) => {
      switch (fieldName) {
         case "email":
            if (!formData.email) {
               return "Email is required!";
            }
            break;
         case "password":
            if (!formData.password) {
               return "Password is required!";
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
         setLoading(true);
         try {
            console.log(formData, JSON.stringify(formData));
            setAuthError("");
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(
               `${backendUrl}/api/auth/login`,
               formData,
            );

            if (data.success) {
               setAuthSuccess(data.message)
               setIsLoggedIn(true);
               await delay(1400);
               getUserData();
               navigate(from || "/", { replace: true, viewTransition: true });
            } else {
               setAuthError(data.message);
            }
         } catch (err) {
            setAuthError(err.response?.data?.message || err.message);
         }
      }
      setLoading(false);
   };

   return (
      <div className="right-panel">
         <div className="form-card width">
            <h1>Welcome back</h1>
            <p>Fill in your details to get started</p>
            {authError && <div className="auth-error">{authError}</div>}
            {authSuccess && <div className="auth-success">{authSuccess}</div>}

            <form onSubmit={handleSubmit}>
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
                  <label htmlFor="password">
                     Password{" "}
                     <Link to="/forget-password" className="link forget-link">
                        Forgot Password?
                     </Link>
                  </label>
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
               <button className="form-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Log In"}
               </button>
            </form>
         </div>
      </div>
   );
};

const Login = () => {
   return (
      <>
         <Navbar mode="login" />
         <main className="auth-main">
            <LeftPanel />
            <RightPanel />
         </main>
      </>
   );
};

export default Login;
