import Order from "../models/Order.js";
import Menu from "../models/Menu.js";

export const handleAIOrder = async (req, res) => {
  try {
    const { items, phoneNumber, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order." });
    }

    const formattedItems = [];

    for (const item of items) {
      const menuItem = await Menu.findOne({ name: item.name });

      if (!menuItem) {
        return res
          .status(404)
          .json({ error: `Menu item '${item.name}' not found` });
      }

      formattedItems.push({
        itemId: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity || 1,
        price: menuItem.price,
        customization: item.customization || "",
      });
    }

    const order = new Order({
      items: formattedItems,
      phoneNumber,
      address,
      status: "Pending",
    });

    order.calculateTotal();
    await order.save();

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (err) {
    console.error("AI Order Error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong while placing the order" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, rejectionReason } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    if (adminNotes) order.adminNotes = adminNotes;
    if (rejectionReason) order.rejectionReason = rejectionReason;

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order status" });
  }
};
