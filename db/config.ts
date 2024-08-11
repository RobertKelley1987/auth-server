import mysql from "mysql2/promise";
import ExpressError from "../util/express-error";

if (!process.env.DB_PORT) {
  throw new ExpressError(500, "Environment variables not found.");
}
const dbPort = parseInt(process.env.DB_PORT) || 3306;

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: dbPort,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
