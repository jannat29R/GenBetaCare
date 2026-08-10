import express from "express";
import {
  adminLogin,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();


// ADMIN LOGIN

router.post(
  "/login",
  adminLogin
);
router.post("/login", adminLogin);
router.use(adminAuth);

export default router;