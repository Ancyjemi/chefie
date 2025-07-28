import express from "express";
import { handleAIChat } from "../controller/aiChatController.js";

const router = express.Router();

router.post("/chat", handleAIChat);
export default router;
