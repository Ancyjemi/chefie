import express from "express";
import multer from "multer";
import {
  uploadMenuItem,
  getAllMenu,
  toggleAvailability,
  deleteMenuItem,
  editMenuItem,
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../controller/menuController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/add", upload.single("image"), uploadMenuItem);
router.get("/", getAllMenu);
router.patch("/menu/:id/availability", toggleAvailability);
router.delete("/delete/:id", deleteMenuItem);
router.put("/edit/:id", upload.single("image"), editMenuItem);
router.post("/category", addCategory);
router.get("/categories", getAllCategories);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

export default router;
