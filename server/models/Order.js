import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  name: String,
  quantity: { type: Number, default: 1 },
  price: Number,
  customization: String,
  total: Number,
});

const orderSchema = new mongoose.Schema(
  {
    items: [orderItemSchema],
    phoneNumber: String,
    address: String,
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    adminNotes: String,
    rejectionReason: String,
  },
  { timestamps: true }
);

// Method to calculate total
orderSchema.methods.calculateTotal = function () {
  this.items.forEach((item) => {
    item.total = item.quantity * item.price;
  });
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
