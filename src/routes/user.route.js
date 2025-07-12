import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.post("/register",upload.fields([{ name: "avatar", maxCount: 1 }]),register)
router.post("/login",login)
router.post("/logout",verifyJWT,logout)
router.post("/get-user",verifyJWT,getCurrentUser)

export default router