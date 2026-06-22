import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ allowedRoles }) => {
   const { isLoggedIn, userData, authLoading } = useContext(AuthContext)
   const location = useLocation()

   if (authLoading) return <p>Loading.... Please Wait</p>

   if (!isLoggedIn) return <Navigate to='/login' replace state={{ from: location }} viewTransition />

   if (!userData) {
      return <p>Loading user profile...</p>;
   }

   if (!allowedRoles.includes(userData.role)) {
      return <Navigate to='/unauthorized' replace viewTransition />
   }
   
   return <Outlet />
}

export default ProtectedRoute
