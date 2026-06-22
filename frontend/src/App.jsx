import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from './components/ProtectedRoute'
import AdminPanel from "./pages/AdminPanel";
import Unauthorized from "./pages/Unauthorized";
import DetailsForm from "./pages/DetailsForm";
import {Toaster} from 'sonner'

const App = () => {
   return (
      <>
      <Toaster position="top-right" richColors />
      
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/register" element={<Register />} />
         <Route path="/login" element={<Login />} />
         <Route path="/forget-password" element={<ForgetPassword />} />
         
         <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route path='/details-form' element={<DetailsForm />} />
         </Route>
         
         <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-panel" element={<AdminPanel />} />
         </Route>

         <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
      </>
   );
};

export default App;
