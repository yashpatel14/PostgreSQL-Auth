import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config({ path: "./.env" });




export const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user.rows[0].id,
      email: user.rows[0].email,
      username: user.rows[0].username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    {
      id: user.rows[0].id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );