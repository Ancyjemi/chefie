👨‍🍳 Chefie - AI Restaurant Chatbot

Chefie is an AI-powered restaurant chatbot app where users can interact with an AI waiter, view the menu, customize their food, and place orders seamlessly. Admins can manage menu items and orders through an admin panel.


 🌟 Features

👤 User Features
- 🧠 Chat with an AI waiter to place food orders.
- 📋 Browse categorized menu with images and prices.
- 🛠 Customize orders (spice level, salt, quantity, etc.).
- 🧾 See order summary and pricing before checkout.
- 💸 Pay via QR code or cash.

 🛠️ Admin Features
- ➕ Add/edit/delete menu items (with image upload).
- 📂 Manage menu categories.
- 🚦 Toggle item availability.
- 📦 View and manage user orders (accept/reject).
- 📈 Real-time order status updates.



 🏗️ Tech Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- AI API: Groq (for AI chat response)
- Image Upload: Multer
- Deployment: Coming soon




 🚀 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/Ancyjemi/chefie.git
cd chefie

# Install backend
cd server
npm install
npm server.js

# Install frontend
cd ../client
npm install
npm run dev
