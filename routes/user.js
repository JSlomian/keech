import express from "express";
const router = express.Router()
import { register_post, register_get } from "../controllers/userController.js";
router.get('/', register_get)
router.post('/',register_post)
export default router