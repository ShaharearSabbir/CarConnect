"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const db_1 = require("../../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getUsers = async () => {
    const result = await db_1.pool.query(`
        SELECT * FROM users
        `);
    return result;
};
const userFieldSet = new Set(["name", "email", "password", "phone", "role"]);
const updateUser = async (id, payload) => {
    if (payload.length === 0) {
        return { success: false, message: "no field to update" };
    }
    const updates = [];
    const params = [];
    let paramIndex = 1;
    userFieldSet.forEach((key) => {
        if (key === "password" && payload[key] !== undefined) {
            payload.password = bcryptjs_1.default.hashSync(payload.password, 10);
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
    const result = await db_1.pool.query(`
        UPDATE users SET ${setField} WHERE id=$${paramIndex} RETURNING *
        `, params);
    return {
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
    };
};
const deleteUSer = async (id) => {
    const isActiveBooking = await db_1.pool.query(`
    SELECT status FROM bookings WHERE customer_id = $1 AND status = $2 
    `, [id, "active"]);
    if (isActiveBooking.rowCount !== 0) {
        return { success: false, message: "this user has active booking" };
    }
    const result = await db_1.pool.query(`
        DELETE FROM users WHERE id=$1
        `, [id]);
    return { success: true, message: "User deleted successfully" };
};
exports.userService = {
    getUsers,
    updateUser,
    deleteUSer,
};
