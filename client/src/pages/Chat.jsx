import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
export default function Chat() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setChat([
      {
        role: "ai",
        text: "🍽️ Hello! I'm Chefie, your AI waiter. Type 'menu' to see our full menu or tell me what you're craving! 😊",
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.toLowerCase().trim();
    setChat((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      if (userMessage.includes("menu")) {
        await fetchAndShowMenu();
        return;
      }

      if (
        userMessage.includes("confirm order") ||
        userMessage.includes("place order")
      ) {
        if (currentOrder.length === 0) {
          setChat((prev) => [
            ...prev,
            {
              role: "ai",
              text: "❌ You don't have any items in your cart yet! Please add some items first.",
            },
          ]);
          return;
        }

        if (!userAddress) {
          setShowAddressModal(true);
          setChat((prev) => [
            ...prev,
            {
              role: "ai",
              text: "📍 I need your delivery address to place the order. Please provide your address.",
            },
          ]);
          return;
        }

        await confirmOrder();
        return;
      }

      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: input,
      });

      let aiReply = res.data.reply;
      let addedToOrder = false;

      try {
        const parsed = JSON.parse(aiReply);
        if (parsed?.items && Array.isArray(parsed.items)) {
          setCurrentOrder((prev) => {
            const updated = [...prev];
            parsed.items.forEach((item) => {
              const price = 90;
              updated.push({
                ...item,
                total: price * item.quantity,
              });
            });
            return updated;
          });
          addedToOrder = true;
        }
      } catch (err) {}

      setChat((prev) => [
        ...prev,
        { role: "ai", text: aiReply },
        ...(addedToOrder
          ? [
              {
                role: "ai",
                text: "✅ I've added the item(s) to your cart!",
              },
            ]
          : []),
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Sorry, I'm having trouble right now. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndShowMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      const menuData = res.data;

      if (!menuData.categories || menuData.categories.length === 0) {
        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text: "⚠️ Menu is currently empty. Please try again later.",
          },
        ]);
        return;
      }

      const allItems = menuData.categories.flatMap((cat) => cat.items || []);

      if (allItems.length === 0) {
        setChat((prev) => [
          ...prev,
          {
            role: "ai",
            text: "📋 Menu is currently empty. Please try again later.",
          },
        ]);
        return;
      }

      let menuText = "📋 OUR MENU:\n\n";

      menuData.categories.forEach((category) => {
        if (category.items && category.items.length > 0) {
          menuText += `🍽️ ${category.name}\n`;
          category.items.forEach((item, index) => {
            menuText += `${index + 1}. ${item.name} - ₹${item.price}\n`;
            if (item.description) menuText += `   📝 ${item.description}\n`;
            menuText += "\n";
          });
        }
      });

      menuText +=
        "👉 You can order by typing something like:\n'I want 2 Veg Soup with extra spice'\nOr just chat with me naturally! 😊";

      setChat((prev) => [...prev, { role: "ai", text: menuText }]);
    } catch (error) {
      console.error("Menu fetch failed:", error);
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "❌ Sorry, I couldn't fetch the menu right now. Please try again!",
        },
      ]);
    }
  };

  const confirmOrder = async () => {
    try {
      const orderData = {
        items: currentOrder,
        address: userAddress,
        phoneNumber: phoneNumber,
        totalPrice: currentOrder.reduce((sum, item) => sum + item.total, 0),
        status: "Pending",
      };
      const res = await axios.post(
        "http://localhost:5000/api/order/ai",
        orderData
      );
      if (res.data && res.data.order) {
        let summaryText = "✅ ORDER CONFIRMED! ✅\n\n";
        summaryText += "📋 ORDER SUMMARY:**\n";

        currentOrder.forEach((item, index) => {
          summaryText += `${index + 1}. ${item.name} (${item.quantity}x)\n`;
          if (item.customization) {
            summaryText += `   📝 ${item.customization}\n`;
          }
          summaryText += `   💰 ₹${item.total}\n\n`;
        });

        summaryText += `📍 Delivery Address: ${userAddress}\n`;
        summaryText += `💵 Total Amount: ₹${orderData.totalPrice}\n\n`;
        summaryText += `🆔 Order ID: ${res.data.order._id}\n\n`;
        summaryText +=
          "🕐 Your order is being prepared! You'll receive updates soon.\n";
        summaryText += "Thank you for ordering with us! 😊";

        setChat((prev) => [...prev, { role: "ai", text: summaryText }]);
        setCurrentOrder([]);
        setOrderSummary(res.data.order);
      } else {
        throw new Error("Order failed");
      }
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "❌ Sorry, there was an issue placing your order. Please try again!",
        },
      ]);
    }
  };

  const handleAddressSubmit = async () => {
    if (userAddress.trim() && phoneNumber.trim()) {
      setShowAddressModal(false);

      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: `📍 Great! I've saved your address: ${userAddress}\n📞 Phone: ${phoneNumber}\n\nProcessing your order... 🛒`,
        },
      ]);

      await confirmOrder();
    } else {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Please enter both your address and phone number to proceed.",
        },
      ]);
    }
  };

  const clearCart = () => {
    setCurrentOrder([]);
    setChat((prev) => [
      ...prev,
      {
        role: "ai",
        text: "🗑️ Your cart has been cleared! What would you like to order?",
      },
    ]);
  };

  const showCart = () => {
    if (currentOrder.length === 0) {
      setChat((prev) => [
        ...prev,
        {
          role: "ai",
          text: "🛒 Your cart is empty! Add some delicious items first!",
        },
      ]);
      return;
    }

    let cartText = "🛒 YOUR CURRENT ORDER:\n\n";
    let total = 0;

    currentOrder.forEach((item, index) => {
      cartText += `${index + 1}. ${item.name} (${item.quantity}x) - ₹${
        item.total
      }\n`;
      if (item.customization) {
        cartText += `   📝 ${item.customization}\n`;
      }
      total += item.total;
      cartText += "\n";
    });

    cartText += `💰 Total: ₹${total}\n\n`;
    cartText += "Say 'confirm order' to place your order or add more items! 🍽️";

    setChat((prev) => [...prev, { role: "ai", text: cartText }]);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-red-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          🍽️ Chefie AI Restaurant
        </h1>
        <p className="text-center text-orange-100">Your Personal AI Waiter</p>
      </div>

      {currentOrder.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 flex justify-between items-center">
          <div>
            <span className="font-semibold">
              🛒 Cart: {currentOrder.length} items
            </span>
            <span className="ml-4 text-green-600 font-bold">
              ₹{currentOrder.reduce((sum, item) => sum + item.total, 0)}
            </span>
          </div>
          <div className="space-x-2">
            <button
              onClick={showCart}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              View Cart
            </button>
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 shadow-md border"
              }`}
            >
              <div className="text-sm font-semibold mb-1">
                {msg.role === "user" ? "👤 You" : "🤖 Chefie"}
              </div>
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                <span className="text-gray-600">Chefie is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="bg-gray-100 p-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setInput("menu")}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          📋 Show Menu
        </button>
        <button
          onClick={showCart}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          🛒 View Cart
        </button>
        <button
          onClick={() => setInput("confirm order")}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          ✅ Confirm Order
        </button>
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about menu, place order, or chat with Chefie..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            📤 Send
          </button>
        </div>
      </div>
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">📍 Delivery Address</h3>
            <textarea
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              className="w-full border border-gray-300 rounded p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number..."
              className="w-full border border-gray-300 rounded p-3 mt-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddressSubmit}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                ✅ Save Address
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
