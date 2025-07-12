import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { pool } from "../db/index.js";


export const verifyJWT = asyncHandler(async(req,_,next) =>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401,"Unauthorized")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await pool.query('SELECT id,username,email FROM users WHERE id = $1', [decodedToken.id])

    if(!user.rows[0]){
        throw new ApiError(401,"Invalid Access Token")
    }

    req.user = user.rows[0]
    next()
}) 