
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export function generateCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",

  };
}