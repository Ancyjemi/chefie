// // AdminMenu.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (form.image) {
      const objectUrl = URL.createObjectURL(form.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [form.image]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      const flatItems = res.data?.categories?.flatMap((cat) => cat.items) || [];
      setMenuItems(flatItems);
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      setLoading(true);
      let response;
      if (editId) {
        response = await axios.put(
          `http://localhost:5000/api/menu/edit/${editId}`,
          data
        );
        alert("✅ Item updated!");
        setMenuItems((prev) =>
          prev.map((item) => (item._id === editId ? response.data.item : item))
        );
      } else {
        response = await axios.post("http://localhost:5000/api/menu/add", data);
        alert("✅ Item added!");
        setMenuItems((prev) => [...prev, response.data.item]);
      }
      resetForm();
    } catch (err) {
      console.error("❌ Upload Error", err);
      alert("❌ Failed to upload item");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      category: "",
      image: null,
    });
    setPreview(null);
    setEditId(null);
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      description: item.description,
      category: item.category,
      image: null,
    });
    setEditId(item._id);
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/delete/${id}`);
        setMenuItems((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        alert("❌ Delete failed");
      }
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/menu/menu/${id}/availability`
      );
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
        )
      );
    } catch (err) {
      alert("❌ Availability toggle failed");
    }
  };

  const groupedItems = menuItems.reduce((acc, item) => {
    const catId = item.category;
    acc[catId] = acc[catId] || [];
    acc[catId].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🍽️ Admin Menu Management</h1>
      <div className="max-w-md mx-auto mb-6 bg-white p-5 rounded shadow space-y-3">
        <h2 className="text-xl font-bold text-orange-600 text-center">
          {editId ? "✏️ Edit Item" : "➕ Add Menu Item"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Item Name"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover border rounded"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Processing..." : editId ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>

      {Object.keys(groupedItems).length > 0 ? (
        Object.entries(groupedItems).map(([categoryId, items]) => {
          const categoryName =
            categories.find((cat) => cat._id === categoryId)?.name || "Unknown";
          return (
            <div
              key={categoryId}
              className="bg-white shadow rounded p-4 mb-6 max-w-4xl mx-auto"
            >
              <h2 className="text-lg font-semibold mb-2">📋 {categoryName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded p-3 shadow space-y-2"
                  >
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded"
                    />
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="text-orange-600 font-bold">₹{item.price}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAvailability(item._id)}
                        className={`text-sm px-3 py-1 rounded ${
                          item.isAvailable ? "bg-green-500" : "bg-red-500"
                        } text-white`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item._id)}
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-white max-w-md mx-auto shadow p-4 rounded text-center">
          <h2 className="text-lg font-bold mb-2">🍽️ Menu Items</h2>
          <p className="text-sm text-gray-500">No menu items found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
