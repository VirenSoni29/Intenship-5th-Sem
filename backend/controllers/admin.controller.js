import transporter from '../config/nodemailer.js';
import * as userModel from '../models/user.model.js';
import * as adminModel from '../models/admin.model.js'
import { sendError, sendSuccess } from '../utils/response.js';
import calculateFaceDistance from '../helpers/calculateFaceDistance.js';
import { USER_ROLE_LABEL, USER_STATUS_LABEL } from '../utils/constants.js';
import config from '../config/config.js';

const getAllUsers = async (req, res) => {
   const { search = '', status = 'all', role = 'all', sort = 'id-greatest', page, limit } = req.query;

   try {
      const [users, totalUsers, pageNum, lim] = await adminModel.getUsers(search, status, role, sort, page, limit);
      if (!users) {
         return sendSuccess(res, 200, 'No users were found.');
      }

      return sendSuccess(res, 200, '', {
         users: users.map(user => ({
               ...user,
               status: USER_STATUS_LABEL[user.status],
               role: USER_ROLE_LABEL[user.role]
            })),
         pagination: {
            totalUsers,
            currentPage: pageNum,
            usersPerPage: lim,
            totalPages: Math.max(Math.ceil(totalUsers / lim), 1)
         }
      })
   } catch (err) {
      console.log(err);
      return sendError(res, 500, err.message);
   }
};

const pending = async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return sendError(res, 400, 'User ID is required!')
   }

   try {
      const user = await userModel.findById(id);
      if (!user) {
         return sendError(res, 404, 'User not found!')
      }
      await adminModel.setUserPending(user.id);

      if (!user.is_test) {
         await transporter.sendMail({
            from: `Team SlotSync ${config.EMAIL_USER}`,
            to: user.email,
            subject: 'Account Status',
            html: `<p>Dear, <b>${user.name}</b></p>
                  <p>Your account registration request has been put into pending and will soon be reviewed by an admin.</p>`
         });
      }

      return sendSuccess(res, 200, 'User was put in pending state.')

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const approve = async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return sendError(res, 400, 'User ID is required!')
   }

   try {
      const user = await userModel.findById(id);
      if (!user) {
         return sendError(res, 404, 'User not found!')
      }
      await adminModel.approveUser(user.id);

      if (!user.is_test) {
         await transporter.sendMail({
            from: `Team SlotSync ${config.EMAIL_USER}`,
            to: user.email,
            subject: 'Account Approval',
            html: `<p>Congratulations, <b>${user.name}</b></p>
                  <p>Your account registration has been approved and you can now.</p>
                  <p><a href='http://localhost:5173/login'>Login Here</a></p>`
         });
      }

      return sendSuccess(res, 200, 'User was successfully approved.')

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const reject = async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return sendError(res, 400, 'User ID is required!')
   }

   try {
      const user = await userModel.findById(id);
      if (!user) {
         return sendError(res, 404, 'User not found!')
      }
      await adminModel.rejectUser(user.id);

      if (!user.is_test) {
         await transporter.sendMail({
            from: `Team SlotSync ${config.EMAIL_USER}`,
            to: user.email,
            subject: 'Account Rejection',
            html: `<p>Sorry, <b>${user.name}</b></p>
                  <p>Your account registration request has been rejected by us after careful consideration</p>`
         });
      }

      return sendSuccess(res, 200, 'User was successfully rejected.')

   } catch (err) {
      return sendError(res, 500, err.message);
   }
};

const enrollFaceController = async (req, res) => {
   const { descriptor } = req.body
   const { id } = req.user

   if (!descriptor) {
      return sendError(res, 400, 'Face is missing!')
   }

   try {
      const user = await userModel.findById(id);
      if (!user) {
         return sendError(res, 404, 'User not found!')
      }
      await adminModel.enrollFace({ id, descriptor })

      return sendSuccess(res, 200, 'Face Enrolled successfully!')
   } catch (err) {
      return sendError(res, 500, err.message)
   }
}

const verifyFace = async (req, res) => {
   const { descriptor } = req.body
   const { id } = req.user

   if (!descriptor) {
      return sendError(res, 400, 'Face is missing!')
   }

   try {
      const faceData = await adminModel.getFaceDescriptor(id)
      if (!faceData) {
         return sendError(res, 404, 'User not found!')
      }

      if (!faceData.face_enrolled) {
         return sendError(res, 400, 'Face not registered')
      }

      const storedDescriptor = faceData.face_descriptor

      const distance = calculateFaceDistance(descriptor, storedDescriptor)
      console.log(distance)

      const THRESHOLD = 0.55

      if (distance > THRESHOLD) {
         return sendError(res, 401, 'Face verification failed!')
      }

      return sendSuccess(res, 200, 'Face verified successfully!')
   } catch (err) {
      return sendError(res, 500, err.message)
   }
}

export {
   getAllUsers,
   pending,
   approve,
   reject,
   enrollFaceController,
   verifyFace
};