import Menu from "../models/Menu.js";
import Category from "../models/Category.js";
import fs from "fs";
import mongoose from "mongoose";
export const uploadMenuItem = async (req, res) => {
  try {
    console.log("🟡 Request Body:", req.body);
    console.log("🟡 File:", req.file);

    const { name, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image not uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const cat = mongoose.Types.ObjectId.isValid(category)
      ? await Category.findById(category)
      : await Category.findOne({ name: category });

    if (!cat) {
      console.error("❌ Invalid category:", category);
      return res.status(400).json({ error: "Invalid category selected" });
    }

    const newItem = new Menu({
      name,
      description,
      price,
      category: cat._id,
      imageUrl,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (err) {
    console.error("🔥 Error uploading item:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

export const getAllMenu = async (req, res) => {
  try {
    const categories = await Category.find();
    const data = await Promise.all(
      categories.map(async (cat) => {
        const items = await Menu.find({ category: cat._id });
        return { ...cat._doc, items };
      })
    );
    res.json({ categories: data });
  } catch (err) {
    res.status(500).json({ error: "Fetching menu failed" });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ message: "Availability updated", item });
  } catch (err) {
    res.status(500).json({ error: "Toggle failed" });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.imageUrl && fs.existsSync("." + item.imageUrl)) {
      fs.unlinkSync("." + item.imageUrl);
    }

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

export const editMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.name = name;
    item.description = description;
    item.price = price;
    item.category = category;

    if (req.file) {
      if (item.imageUrl && fs.existsSync("." + item.imageUrl)) {
        fs.unlinkSync("." + item.imageUrl);
      }
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    await item.save();
    res.json({ message: "Item updated", item });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ error: "Category exists" });

    const newCategory = new Category({ name });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category created", category: newCategory });
  } catch (err) {
    res.status(500).json({ error: "Adding category failed" });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Fetching categories failed" });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.json({ message: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};
