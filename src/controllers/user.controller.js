import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { pool } from "../db/index.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/helper.js";
import { generateCookieOptions } from "../configs/cookies.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!hashedPassword) {
    throw new ApiError(500, "Something went wrong");
  }

  let avatarUrl;
  
  if (req.files) {
    try {
      const uploaded = await uploadOnCloudinary(req.files.avatar[0].path);

      avatarUrl = uploaded?.secure_url;
      
    } catch (err) {
      console.log(err)
    }
  }

  const user = await pool.query(
    "INSERT INTO users (username,email,password,avatar) VALUES ($1,$2,$3,$4) RETURNING id, username, email,avatar",
    [username, email, hashedPassword, avatarUrl]
  );

  if (!user) {
    throw new ApiError(500, "Something went wrong");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user.rows[0], "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (user.rows.length === 0) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(password, user.rows[0].password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const loggedInUser = await pool.query(
    "SELECT id,username,email FROM users WHERE email = $1",
    [user.rows[0].email]
  );

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

//   console.log(refreshToken);


  await pool.query("UPDATE users SET refreshtoken = $1 WHERE id = $2", [
    refreshToken,user.rows[0].id
  ]);

  res
    .status(200)
    .cookie("accessToken", accessToken, generateCookieOptions())
    .cookie("refreshToken", refreshToken, generateCookieOptions())
    .json(
      new ApiResponse(200, loggedInUser.rows[0], "User logged in successfully")
    );
});

const logout = asyncHandler(async (req, res) => {
  console.log(req.user);

  await pool.query("UPDATE users SET refreshToken = NULL WHERE id = $1", [
    req.user.id,
  ]);

  res
    .status(200)
    .clearCookie("accessToken", generateCookieOptions())
    .clearCookie("refreshToken", generateCookieOptions())
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export { register, login, logout, getCurrentUser };
