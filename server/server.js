import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import aiChatRoutes from "./routes/aiChatRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import Order from "./models/Order.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/menu", menuRoutes);
app.use("/api/ai", aiChatRoutes);
app.use("/api/order", orderRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
