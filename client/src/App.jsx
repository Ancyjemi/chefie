import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import AdminViewMenu from "./pages/AdminViewMenu";
import AddCategory from "./pages/AddCategory";
import AdminOrder from "./pages/AdminOrder";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-menu" element={<AdminMenu />} />
        <Route path="/admin/view-menu" element={<AdminViewMenu />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/orders" element={<AdminOrder />} />
      </Routes>
    </Router>
  );
}
