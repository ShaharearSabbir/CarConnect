"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const createUser = async (payload) => {
    const { name, email, password, phone } = payload;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const result = await db_1.pool.query(`
    INSERT INTO users(name, email, password, phone) VALUES($1,$2, $3, $4) RETURNING *
    `, [name, email.toLowerCase(), hashedPassword, phone]);
    return result;
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const result = await db_1.pool.query(`
    SELECT * FROM users WHERE email=$1
    `, [email]);
    const userFromDB = result.rows[0];
    if (!userFromDB) {
        return { success: false, message: `no user registered with ${email}` };
    }
    const isMatched = await bcryptjs_1.default.compare(password, userFromDB.password);
    if (!isMatched) {
        return { success: false, message: "incorrect password" };
    }
    await db_1.pool.query(`
    UPDATE users SET last_login=NOW() WHERE email=$1 RETURNING *
    `, [email]);
    const token = jsonwebtoken_1.default.sign({ id: userFromDB.id, email, name: userFromDB.name, role: userFromDB.role }, config_1.default.JWT_SECRET, { expiresIn: "7d" });
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
exports.authServices = {
    createUser,
    loginUser,
};
