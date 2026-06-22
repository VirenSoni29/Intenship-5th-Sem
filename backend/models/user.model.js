import db from "../config/db.js";

const createUser = async ({ name, email, phone, password }) => {
   const [result] = await db.execute(
      `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`,
      [name, email, phone, password]
   );
   return result.insertId;
};

const findByEmail = async (email) => {
   const [rows] = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
   );
   return rows[0] || null;
};

const findById = async (id) => {
   const [rows] = await db.execute(
      `SELECT * FROM users WHERE id = ?`,
      [id]
   );
   return rows[0] || null;
};

const changePassword = async ({ id, newPassword }) => {
   const [result] = await db.execute(
      `UPDATE users SET password = ? WHERE id = ?`,
      [newPassword, id]
   );

   return result.affectedRows > 0;
};

const setLastLogin = async (id) => {
   await db.execute(
      `UPDATE users SET last_login = NOW() WHERE id = ?`,
      [id]
   );
};

export {
   createUser,
   findByEmail,
   findById,
   changePassword,
   setLastLogin
};