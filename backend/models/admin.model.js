import db from '../config/db.js'
import { USER_STATUS } from '../utils/constants.js';
import { ROLE_MAP, STATUS_MAP } from '../utils/maps.js';

const setUserPending = async (id) => {
   await db.execute(
      `UPDATE users SET status = ${USER_STATUS.PENDING} WHERE id = ?`,
      [id]
   );
};

const approveUser = async (id) => {
   await db.execute(
      `UPDATE users SET status = ${USER_STATUS.APPROVED} WHERE id = ?`,
      [id]
   );
};

const rejectUser = async (id) => {
   await db.execute(
      `UPDATE users SET status = ${USER_STATUS.REJECTED} WHERE id = ?`,
      [id]
   );
};

const getUsers = async (search, status, role, sort, page, limit) => {
   const conditions = [];
   const queryValues = [];

   const allowedSorts = {
      'id-greatest': 'id DESC',
      'id-least': 'id',
      'created-newest': 'created_at DESC',
      'created-oldest': 'created_at',
      'updated-newest': 'updated_at DESC',
      'updated-oldest': 'updated_at',
      'az': 'name',
      'za': 'name DESC'
   };

   if (status !== 'all') {
      conditions.push('status = ?');
      queryValues.push(STATUS_MAP[status]);
   }

   if (role !== 'all') {
      conditions.push('role = ?');
      queryValues.push(ROLE_MAP[role]);
   }

   const trimmedSearch = search.trim();

   if (trimmedSearch !== '') {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
      queryValues.push(`%${trimmedSearch}%`, `%${trimmedSearch}%`, `%${trimmedSearch}%`);
   }

   const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

   const orderByClause = allowedSorts[sort] ? `ORDER BY ${allowedSorts[sort]}` : '';

   const pageNum = Number(page) || 1;
   const lim = Number(limit) || 10;
   const offset = (pageNum - 1) * lim;

   const [rows] = await db.execute(
      `SELECT id, name, email, phone, role, status, created_at, updated_at FROM users ${whereClause} ${orderByClause} LIMIT ? OFFSET ?`,
      [...queryValues, String(lim), String(offset)]
   );

   const [count] = await db.execute(`SELECT COUNT(*) AS totalUsers FROM users ${whereClause}`, queryValues);

   return [rows || null, count[0].totalUsers, pageNum, lim];
};

const enrollFace = async ({ descriptor, id }) => {
   await db.execute(
      `UPDATE users SET face_descriptor = ?, face_enrolled = TRUE WHERE id = ?`,
      [descriptor, id]
   )
}

const getFaceDescriptor = async (id) => {
   const [rows] = await db.execute(
      `SELECT face_descriptor, face_enrolled FROM users WHERE id = ?`,
      [id]
   )

   return rows[0] || null
}

export {   
   setUserPending,
   approveUser,
   rejectUser,
   getUsers,
   enrollFace,
   getFaceDescriptor
}