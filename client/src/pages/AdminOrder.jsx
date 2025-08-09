// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);

//   // Fetch all orders on component mount
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/order"); // Update path if needed
//       setOrders(response.data);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
//         📋 Chefie Admin Orders
//       </h2>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading orders...</p>
//       ) : orders.length === 0 ? (
//         <p className="text-center text-gray-600">No orders placed yet.</p>
//       ) : (
//         <div className="grid gap-6">
//           {orders.map((order) => (
//             <div
//               key={order._id}
//               className="bg-white rounded-2xl shadow p-5 border border-gray-200"
//             >
//               <div className="mb-2">
//                 <span className="font-semibold text-gray-700">
//                   🆔 Order ID:
//                 </span>{" "}
//                 <span className="text-sm">{order._id}</span>
//               </div>

//               <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
//                 <p>
//                   <strong>📍 Address:</strong> {order.address}
//                 </p>
//                 <p>
//                   <strong>📞 Phone:</strong> {order.phoneNumber}
//                 </p>
//                 <p>
//                   <strong>📦 Status:</strong> {order.status}
//                 </p>
//                 <p>
//                   <strong>🕐 Placed:</strong>{" "}
//                   {new Date(order.createdAt).toLocaleString()}
//                 </p>
//               </div>

//               <div className="mt-3">
//                 <h4 className="font-semibold text-gray-800 mb-1">🛒 Items:</h4>
//                 {order.items.map((item, idx) => (
//                   <div
//                     key={item._id || idx}
//                     className="ml-4 text-sm text-gray-700 border-l-2 border-gray-200 pl-2 mb-1"
//                   >
//                     🍽️ {item.name} × {item.quantity} — ₹{item.total}
//                     {item.customization && (
//                       <div className="text-xs text-gray-500 italic">
//                         🔧 {item.customization}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="text-right mt-3 font-bold text-gray-800">
//                 💰 Total: ₹{order.total}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/order/${orderId}/status`, {
        status: newStatus,
      });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 rounded mb-4 shadow">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Phone:</strong> {order.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {order.address}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentMethod}{" "}
              {order.paymentMethod === "UPI" && (
                <span className="inline-block w-3 h-3 ml-1 rounded-full bg-green-600"></span>
              )}
            </p>

            <label className="block mt-2 font-semibold">Status:</label>
            {/* <select
              className="border p-1 rounded mt-1"
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select> */}
            <div class="flex gap-2">
              <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2">
                Accept
              </button>
              <button class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded flex items-center gap-2">
                Reject order
              </button>
              <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2"></button>
            </div>

            <div className="mt-4">
              <p className="font-semibold">Items:</p>
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="border p-2 rounded flex items-center gap-2 mb-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    {item.customization && (
                      <div className="text-sm text-gray-600">
                        {typeof item.customization === "string" ? (
                          <p>{item.customization}</p>
                        ) : (
                          Object.entries(item.customization).map(
                            ([key, val]) => (
                              <p key={key}>
                                {key}: {val}
                              </p>
                            )
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm mt-2">
              Placed At:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
