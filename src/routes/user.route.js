import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.post("/register",register)
router.post("/login",login)
router.post("/logout",verifyJWT,logout)
router.post("/get-user",verifyJWT,getCurrentUser)

export default router