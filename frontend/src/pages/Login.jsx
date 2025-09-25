import React, { useState } from "react";
import RegLogo from "../assets/logo.png";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        Email,
        Password
      });
      alert("Login successful!");
      console.log(res.data);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to dashboard or home
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card border-0 text-center p-5 register-card">
        <img src={RegLogo} className="mb-5 align-items-center" alt="Kex" style={{ width: "230px" }} />
        <h5 className="mb-4 text-secondary">Login</h5>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="reginp"
              placeholder="Email Address"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="reginp pe-5"
              placeholder="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Login button */}
          <div className="mb-4 d-grid gap-2">
            <button type="submit" className="btn btn-main py-2">Login</button>
          </div>

          {/* Links */}
          <div className="d-flex justify-content-between">
            <Link to="/register" className="coll-green">Register</Link>
            <Link to="/f-password" className="coll-red">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
