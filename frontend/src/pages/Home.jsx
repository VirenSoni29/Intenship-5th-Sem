import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/home.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, Mail01Icon } from "@hugeicons/core-free-icons";

const Home = () => {
   const { userData } = useContext(AuthContext);
   const navigate = useNavigate();

   return (
      <div>
         <Navbar mode="home" />
         <main className="home-main">
            <div className="container">
               <h1>{userData ? `Hey, ${userData.name}` : "Welcome"}</h1>
               {!userData ? (
                  <p>
                     This is a test authentication app,{" "}
                     <Link className="home-links" to="/login">
                        Login
                     </Link>{" "}
                     or{" "}
                     <Link className="home-links" to="/register">
                        Register
                     </Link>{" "}
                     to test the app
                  </p>
               ) : (
                  <div className="user-details">
                     <div className="detail">
                        <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />{" "}
                        Email: {userData.email}
                     </div>
                     <div className="detail">
                        <HugeiconsIcon icon={Call02Icon} strokeWidth={2} />{" "}
                        Phone Number: {userData.phone}
                     </div>
                     <div className="detail">Role: {userData.role}</div>
                     {userData.role === "admin" && (
                        <button
                           className="home-admin-btn"
                           onClick={() => navigate("/admin-panel")}
                        >
                           Go to admin panel
                        </button>
                     )}
                     <button
                        className="home-admin-btn"
                        onClick={() => navigate("/details-form")}
                     >
                        <span className="btn-heading">Details form</span>
                        <span className="btn-desc">Fill this form to test the implementation for OCR</span>
                     </button>
                  </div>
               )}
            </div>
         </main>
      </div>
   );
};

export default Home;
