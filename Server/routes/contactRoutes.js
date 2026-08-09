import express from "express";

import {
  sendContactMessage,
  getContactMessages,
  deleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", sendContactMessage);
router.get("/", getContactMessages);
router.delete("/:id", deleteContactMessage);

export default router;