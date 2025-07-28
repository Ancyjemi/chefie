import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-700">
        🧑‍🍳 Admin Dashboard
      </h1>

      <div className="max-w-md mx-auto space-y-4">
        <Link
          to="/admin/add-menu"
          className="block bg-orange-500 text-white text-center py-3 rounded shadow hover:bg-orange-600"
        >
          ➕ Add Menu Item
        </Link>

        <Link
          to="/admin/view-menu"
          className="block bg-orange-500 text-white text-center py-3 rounded shadow hover:bg-orange-600"
        >
          👀 View Menu Items
        </Link>

        <Link
          to="/admin/orders"
          className="block bg-orange-500 text-white text-center py-3 rounded shadow hover:bg-orange-600"
        >
          📦 View Orders
        </Link>
        <Link
          to="/admin/add-category"
          className="block bg-purple-600 text-white text-center py-3 rounded shadow hover:bg-purple-700"
        >
          🗂️ Add Category
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
