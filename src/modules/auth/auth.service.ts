import { Request } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, phone) VALUES($1,$2, $3, $4) RETURNING *
    `,
    [name, (email as string).toLowerCase(), hashedPassword, phone]
  );

  return result;
};

const loginUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email]
  );

  const userFromDB = result.rows[0];

  if (!userFromDB) {
    return { success: false, message: `no user registered with ${email}` };
  }

  const isMatched = await bcrypt.compare(
    password as string,
    userFromDB.password
  );

  if (!isMatched) {
    return { success: false, message: "incorrect password" };
  }

  await pool.query(
    `
    UPDATE users SET last_login=NOW() WHERE email=$1 RETURNING *
    `,
    [email]
  );

  const token = jwt.sign(
    {
      email,
      name: userFromDB.name,
      role: userFromDB.role,
    },
    config.JWT_SECRET
  );

  delete userFromDB.password;

  return {
    success: true,
    message: "Login successful",
    data: {
      token: token,
      user: userFromDB,
    },
  };
};

export const authServices = {
  createUser,
  loginUser,
};
