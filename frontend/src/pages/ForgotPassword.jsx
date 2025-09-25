import React, { useState } from "react";
import RegLogo from "../assets/logo.png";
import "../App.css";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/api/forgot-password", {
        Email: email, // 👈 Must match backend
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card border-0 text-center p-5 register-card">
        <img
          src={RegLogo}
          className="mb-5 align-items-center"
          alt="Kex"
          style={{ width: "230px" }}
        />

        <h5 className="mb-4 text-secondary">Forgot Password?</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 form-field d-flex align-items-center">
            <input
              type="email"
              className="reginp"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-main py-2" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
            <Link to="/login" type="button" className="btn btn-main py-2">
              Cancel
            </Link>
          </div>
        </form>

        {message && <p className="mt-3 text-success">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
