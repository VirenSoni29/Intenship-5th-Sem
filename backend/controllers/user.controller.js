import * as userModel from '../models/user.model.js';
import { USER_ROLE_LABEL } from '../utils/constants.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const getUserData = async (req, res) => {
   try {
      const { id } = req.user;

      const user = await userModel.findById(id);
      if (!user) {
         return sendError(res, 404, 'User not found!');
      }

      return sendSuccess(res, 200, '', {
         userData: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: USER_ROLE_LABEL[user.role],
            faceEnrolled: user.face_enrolled
         }
      })
   } catch (err) {
      return sendError(res, 500, err.message);
   }
};