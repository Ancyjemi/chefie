// // routes/orderRoutes.js
// import express from "express";
// import {
//   createOrder,
//   getAllOrders,
//   updateOrderStatus,
// } from "../controller/orderController.js";

// const router = express.Router();

// router.post("/", createOrder); // POST /api/order
// router.get("/", getAllOrders); // GET /api/order
// router.patch("/:id/status", updateOrderStatus); // PATCH /api/order/:id/status

// export default router;
import express from "express";
import {
  handleAIOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controller/orderController.js";

const router = express.Router();
router.post("/ai", handleAIOrder);
router.get("/", getAllOrders);
router.put("/status/:id", updateOrderStatus);

export default router;
