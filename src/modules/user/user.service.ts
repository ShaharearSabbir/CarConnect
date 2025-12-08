import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getUsers = async () => {
  const result = await pool.query(`
        SELECT * FROM users
        `);
  return result;
};

const userFieldSet = new Set(["name", "email", "password", "phone", "role"]);

const updateUser = async (id: string, payload: Record<string, unknown>) => {
  if (payload.length === 0) {
    return { success: false, message: "no field to update" };
  }

  const updates: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  userFieldSet.forEach((key) => {
    if (key === "password" && payload[key] !== undefined) {
      payload.password = bcrypt.hashSync(payload.password as string, 10);
    }

    if (payload[key] !== undefined) {
      updates.push(`${key}=$${paramIndex}`);
      params.push(payload[key]);
      paramIndex++;
    }
  });

  params.push(id);

  updates.push(`updated_at=NOW()`);

  const setField = updates.join(", ");

  const result = await pool.query(
    `
        UPDATE users SET ${setField} WHERE id=$${paramIndex} RETURNING *
        `,
    params
  );

  return {
    success: true,
    message: "User updated successfully",
    data: result.rows[0],
  };
};

const deleteUSer = async (id: string) => {
  const result = await pool.query(
    `
        DELETE FROM users WHERE id=$1
        `,
    [id]
  );

  return result;
};

export const userService = {
  getUsers,
  updateUser,
  deleteUSer,
};
