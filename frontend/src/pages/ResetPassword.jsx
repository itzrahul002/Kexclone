import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // extract token from URL (http://localhost:5173/reset-password?token=xxxx)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/reset-password", {
        token,
        password,
      });

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card border-0 text-center p-5 register-card">
        <h5 className="mb-4 text-secondary">Reset Password</h5>

        <form onSubmit={handleReset}>
          {/* New Password */}
          <div className="mb-3">
            <input
              type="password"
              className="reginp"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <input
              type="password"
              className="reginp"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Error/Success message */}
          {error && <p className="text-danger">{error}</p>}
          {success && <p className="text-success">{success}</p>}

          {/* Submit */}
          <div className="mb-4 d-grid gap-2">
            <button type="submit" className="btn btn-main py-2">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
