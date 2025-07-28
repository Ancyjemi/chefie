import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      const user = res.data.user;
      const role = res.data.user.role;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      setMsg("Login successful");
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/chat");
      }
      // setTimeout(() => {
      //   navigate("/chat");
      // }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-lg w-full max-w-sm">
        <h1 className="text-4xl font-logo text-white text-center mb-8">
          Chefie
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-sm text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
          >
            Log In
          </button>
          <p className="mt-3 text-red-500">{msg}</p>
        </form>

        <div className="text-center mt-2">
          <a href="#" className="text-white text-xs">
            Forgot password?
          </a>
        </div>
      </div>

      <div className="mt-4 bg-zinc-900 border border-zinc-700 text-white w-full max-w-sm p-4 text-center rounded">
        Don’t have an account?{" "}
        <Link to="/signin" className="text-blue-500 font-semibold">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
