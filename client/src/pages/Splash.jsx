import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cheifie-logo.png";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 2500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="h-screen flex items-center justify-center bg-orange-100">
      <img src={logo} alt="Chefie" className="w-48 animate-bounce" />
    </div>
  );
}
