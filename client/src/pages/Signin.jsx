import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setMsg("Passwords do not match");
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      setMsg(res.data.message);
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg w-full max-w-sm"
      >
        <h2 className="text-2xl text-white font-bold text-center mb-6">
          Signup to Chefie
        </h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={form.username}
          onChange={handleChange}
          className="mb-3 w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="mb-3 w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="mb-3 w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="mb-3 w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-2 text-sm text-white"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded font-semibold"
        >
          Sign Up
        </button>
        <p className="mt-3 text-red-500">{msg}</p>
        <div className="mt-4 bg-zinc-900 border border-zinc-700 text-white w-full max-w-sm p-4 text-center rounded">
          Have an account already?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
