import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response.js';

const userAuth = async (req, res, next) => {
   const { token } = req.cookies;

   if (!token) {
      return sendError(res, 401, 'Not Authorized. Login again.');
   }

   try {
      const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

      if (tokenDecode.id) {
         req.user = tokenDecode
      } else {
         return sendError(res, 401, 'Not Authorized. Login again.');
      }

      next();
   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

export default userAuth;