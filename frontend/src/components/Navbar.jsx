import { useContext } from "react";
import "../css/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import axios from "axios";

const Navbar = ({ mode }) => {
   const { userData, backendUrl, setUserData, setIsLoggedIn, setFaceVerified } =
      useContext(AuthContext);
   const navigate = useNavigate();

   const logout = async () => {
      try {
         const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {
            withCredentials: true,
         });

         data.success && setIsLoggedIn(false);
         data.success && setUserData(false);
         sessionStorage.removeItem("faceVerified");
         setFaceVerified(false);
         navigate("/");
      } catch (err) {
         console.log(err.message);
      }
   };

   return (
      <header className="navbar">
         <Link to="/" className="logo">
            <div className="logo-icon">
               <img src="/logo.svg" alt="SlotSync logo" />
            </div>
            SlotSync
         </Link>
         {userData ? (
            <div className="user-icon">
               {userData.name[0].toUpperCase()}
               <div className="user-icon-hover-box">
                  <ul>
                     <li onClick={logout}>
                        <HugeiconsIcon icon={Logout01Icon} size={17} /> Logout
                     </li>
                  </ul>
               </div>
            </div>
         ) : mode === "register" ? (
            <div className="login-link">
               Already have an account?{" "}
               <Link to="/login" className="link">
                  Login
               </Link>
            </div>
         ) : mode === "login" ? (
            <div className="login-link">
               Don't have an account?{" "}
               <Link to="/register" className="link">
                  Register
               </Link>
            </div>
         ) : (
            <div className="auth-btns">
               <Link to="/login" className="login-btn" viewTransition>
                  Log in
               </Link>
               <Link to="/register" className="register-btn" viewTransition>
                  Get Started
               </Link>
            </div>
         )}
      </header>
   );
};

export default Navbar;
