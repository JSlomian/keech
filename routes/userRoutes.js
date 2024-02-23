import express from "express";
const router = express.Router()
import app_user_profile from "../controllers/userController.js";
router.get('/profile', app_user_profile)
export default router