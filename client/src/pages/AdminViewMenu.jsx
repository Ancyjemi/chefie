import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminViewMenu = () => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      if (res.data.categories) {
        setMenuData(res.data.categories);
      } else {
        setMenuData([]);
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      setMenuData([]);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        🍽️ Our Delicious Menu
      </h1>

      {menuData.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No menu items found.
        </p>
      ) : (
        menuData.map((category) => (
          <div key={category._id} className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {category.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-orange-600 font-bold mt-1">
                    ₹{item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminViewMenu;
