import { createContext, useEffect, useState } from "react";
import axios from 'axios'

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
   const backendUrl = import.meta.env.VITE_BACKEND_URL;
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userData, setUserData] = useState(null);
   const [authLoading, setAuthLoading] = useState(true)

   const [faceVerified, setFaceVerified] = useState(
      sessionStorage.getItem('faceVerified') === 'true'
   )

   const getUserData = async () => {
      try {
         axios.defaults.withCredentials = true
         const { data } = await axios.get(`${backendUrl}/api/user/data`)
         data.success ? setUserData(data.userData) : console.log(data.message);
      } catch (err) {
         console.log(err.response?.data?.message || err.message);
      }
   };

   useEffect(() => {
      let active = true;

      const initializeAuth = async () => {
         try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`)

            if (data.success && active) {
               setIsLoggedIn(true);
               const { data: userDataResult } = await axios.get(`${backendUrl}/api/user/data`)
               
               if (userDataResult.success && active) {
                  setUserData(userDataResult.userData);
               }
            }
         } catch (err) {
            if (active) console.log(err.response?.data?.message || err.message);
         } finally {
            if (active) setAuthLoading(false)
         }
      };

      initializeAuth();
      return () => {
         active = false;
      };
   }, [backendUrl]);

   const value = {
      backendUrl,
      isLoggedIn,
      setIsLoggedIn,
      authLoading,
      userData,
      setUserData,
      getUserData,
      faceVerified,
      setFaceVerified
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
