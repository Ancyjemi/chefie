import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === statusFilter)
      );
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        adminNotes: adminNotes || "",
      };

      if (newStatus === "Rejected" && rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }

      if (newStatus === "Accepted") {
        updateData.estimatedDeliveryTime = new Date(
          Date.now() + 30 * 60 * 1000
        );
      }

      const response = await axios.put(
        `/api/admin/order/${orderId}`,
        updateData
      );

      setOrders(
        orders.map((order) => (order._id === orderId ? response.data : order))
      );

      setShowOrderModal(false);
      setSelectedOrder(null);
      setAdminNotes("");
      setRejectionReason("");

      alert(`Order ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      Accepted: "bg-green-100 text-green-800 border-green-300",
      Preparing: "bg-blue-100 text-blue-800 border-blue-300",
      Ready: "bg-purple-100 text-purple-800 border-purple-300",
      Delivered: "bg-gray-100 text-gray-800 border-gray-300",
      Rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: "🕐",
      Accepted: "✅",
      Preparing: "👨‍🍳",
      Ready: "🍽️",
      Delivered: "🚚",
      Rejected: "❌",
    };
    return icons[status] || "📋";
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setAdminNotes(order.adminNotes || "");
    setRejectionReason(order.rejectionReason || "");
    setShowOrderModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🍽️ Order Management
        </h1>
        <p className="text-gray-600">Manage customer orders from Chefie AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        {[
          "Pending",
          "Accepted",
          "Preparing",
          "Ready",
          "Delivered",
          "Rejected",
        ].map((status) => {
          const count = orders.filter(
            (order) => order.status === status
          ).length;
          return (
            <div
              key={status}
              className={`p-4 rounded-lg border-2 ${getStatusColor(status)}`}
            >
              <div className="text-2xl mb-1">{getStatusIcon(status)}</div>
              <div className="text-lg font-bold">{count}</div>
              <div className="text-sm">{status}</div>
            </div>
          );
        })}
      </div>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "Pending",
            "Accepted",
            "Preparing",
            "Ready",
            "Delivered",
            "Rejected",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium ${
                statusFilter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}{" "}
              {status !== "All" &&
                `(${orders.filter((o) => o.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">
              {statusFilter === "All"
                ? "No orders have been placed yet."
                : `No ${statusFilter.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        Order #{order._id.slice(-6)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleString()}
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Items:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded">
                            <div className="font-medium">
                              {item.name} (x{item.quantity})
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.customization}
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                              ₹{item.total}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="font-semibold text-gray-800">
                        📍 Address:{" "}
                      </span>
                      <span className="text-gray-600">{order.address}</span>
                    </div>

                    <div className="text-lg font-bold text-green-600">
                      Total: ₹{order.totalAmount}
                    </div>

                    {order.adminNotes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <span className="font-semibold">📝 Notes: </span>
                        <span>{order.adminNotes}</span>
                      </div>
                    )}

                    {order.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded">
                        <span className="font-semibold">
                          ❌ Rejection Reason:{" "}
                        </span>
                        <span>{order.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      {order.status === "Pending" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              updateOrderStatus(order._id, "Accepted");
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => openOrderModal(order)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center gap-2"
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}

                      {order.status === "Accepted" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Preparing")
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                        >
                          👨‍🍳 Start Preparing
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "Ready")}
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center justify-center gap-2"
                        >
                          🍽️ Mark Ready
                        </button>
                      )}

                      {order.status === "Ready" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "Delivered")
                          }
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center gap-2"
                        >
                          🚚 Mark Delivered
                        </button>
                      )}

                      <button
                        onClick={() => openOrderModal(order)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 flex items-center justify-center gap-2"
                      >
                        📝 Add Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Order #{selectedOrder._id.slice(-6)} - {selectedOrder.status}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Admin Notes:
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this order..."
                  className="w-full border border-gray-300 rounded p-3 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedOrder.status === "Pending" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ❌ Rejection Reason:
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Why is this order being rejected?"
                    className="w-full border border-gray-300 rounded p-3 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                {selectedOrder.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateOrderStatus(selectedOrder._id, "Accepted")
                      }
                      className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                    >
                      ✅ Accept Order
                    </button>
                    <button
                      onClick={() => {
                        if (!rejectionReason.trim()) {
                          alert("Please provide a rejection reason");
                          return;
                        }
                        updateOrderStatus(selectedOrder._id, "Rejected");
                      }}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      ❌ Reject Order
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    if (adminNotes !== selectedOrder.adminNotes) {
                      updateOrderStatus(
                        selectedOrder._id,
                        selectedOrder.status
                      );
                    } else {
                      setShowOrderModal(false);
                    }
                  }}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  💾 Save Notes
                </button>

                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedOrder(null);
                    setAdminNotes("");
                    setRejectionReason("");
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
