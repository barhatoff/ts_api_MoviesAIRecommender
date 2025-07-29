import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.POSTGRESSQL_USER,
  host: "localhost",
  database: "testdb",
  password: process.env.POSTGRESSQL_PASWD,
  port: 5432,
});
