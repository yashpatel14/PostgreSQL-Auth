// db/index.js
import dotenv from "dotenv"
import pkg from 'pg';
import { DB_NAME } from "../constants.js";


dotenv.config({
    path:"./.env"
})

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: DB_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  // options: '-c search_path=public'
});

const connectDB = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected successfully.");
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error);
    throw error;
  }
};

export { connectDB, pool };
