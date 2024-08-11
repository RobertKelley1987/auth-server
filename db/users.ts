import db from "./config";
import ExpressError from "../util/express-error";
import { v4 as uuid } from "uuid";
import type { QueryError, RowDataPacket } from "mysql2";

interface UserResult extends RowDataPacket {
  id: string;
  email: string;
  password: string;
}

export async function createUser(email: string, password: string) {
  const userId = uuid();
  const sql = "INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)";
  const values = [userId, email, password];

  try {
    await db.query(sql, values);
    return { id: userId };
  } catch (error) {
    console.log(error);

    // Notify client if user already exists.
    const dbError = error as QueryError;
    if (dbError.code === "ER_DUP_ENTRY") {
      throw new ExpressError(400, "User already exists.");
    }

    // Otherwise send generic error message.
    throw new ExpressError(500, "Failed to create user in db.");
  }
}

export async function findUserByEmail(email: string) {
  const sql =
    "SELECT user_id AS id, email, password, refresh_token AS refreshToken FROM users WHERE email = ?";
  const values = [email];
  try {
    const [result] = await db.query<UserResult[]>(sql, values);
    return result[0];
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to find user in db.");
  }
}

export async function findUserByToken(token: string) {
  const sql =
    "SELECT user_id AS id, email, password, refresh_token AS refreshToken FROM users WHERE refresh_token = ?";
  const values = [token];
  try {
    const [result] = await db.query<UserResult[]>(sql, values);
    return result[0];
  } catch (error) {
    console.log(error);
    throw new ExpressError(500, "Failed to find user in db.");
  }
}

export async function updateUserToken(userId: string, token: string) {
  const sql = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
  const values = [token, userId];
  try {
    const [result] = await db.query(sql, values);
    return result;
  } catch (error) {
    throw new ExpressError(500, "Failed to update refresh token in db.");
  }
}
