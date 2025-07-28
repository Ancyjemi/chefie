import React, { useEffect, useState } from "react";
import axios from "axios";
const AddCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/menu/category/${editId}`, {
          name,
        });
        setMessage("Category updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/menu/category", { name });
        setMessage("Category added successfully");
      }
      setName("");
      setEditId(null);
      fetchCategories();
    } catch (err) {
      setMessage(err.response?.data?.error || "Action failed");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/category/${id}`);
        fetchCategories();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">
        📂 Manage Categories
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mb-4 space-y-3 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          {editId ? "✏️ Update Category" : "➕ Add Category"}
        </button>
        {message && (
          <p className="text-sm text-center text-gray-600">{message}</p>
        )}
      </form>

      <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">📋 Categories</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="flex justify-between items-center border-b py-1"
              >
                <span>{cat.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default AddCategory;
