import express from "express";
const router = express.Router()
import { app_register_post, app_register_get, app_login_post, app_login_get, app_logout_get } from "../controllers/authController.js";
router.get('/register',app_register_get)
router.post('/register',app_register_post)
router.get('/login', app_login_get)
router.post('/login', app_login_post)
router.get('/logout', app_logout_get)

export default router