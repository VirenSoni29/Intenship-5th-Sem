import { USER_ROLE } from "../utils/constants.js";
import { sendError } from "../utils/response.js";

const isAdmin = (req, res, next) => {
   if (req.user?.role !== USER_ROLE.ADMIN) {
      return sendError(res, 403, 'Access denied. Admin privileges required.')
   }
   next();
};

export {
   isAdmin
}