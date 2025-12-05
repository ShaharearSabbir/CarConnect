import { Request } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone } = payload;

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, phone) VALUES($1,$2, $3, $4) RETURNING *
    `,
    [name, email, hashedPassword, phone]
  );

  return result;
};

export const authServices = {
  createUser,
};
