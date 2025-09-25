import React, { useState } from "react";
import RegLogo from "../assets/logo.png";
import '../App.css'
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [Email, setEmail] = useState("");
  const [ClientId, setClientId] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post("http://localhost:3000/api/register", {
  //       Email,
  //       ClientId
  //     });
  //     alert("Record created successfully!");
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error("Error:", err.response?.data || err.message);
  //     alert("Failed to create record");
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:3000/api/register", {
      Email,
      ClientId
    });
    alert("Record created successfully!");
    console.log(res.data);
  } catch (err) {
    if (err.response?.status === 400) {
      alert("ClientID already used. Please choose another one.");
    } else {
      alert("Failed to create record. Try again later.");
    }
    console.error("Error:", err.response?.data || err.message);
  }
};


  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card border-0 text-center p-5 register-card">
        <img src={RegLogo} className="mb-5 align-items-center" alt="Kex" style={{ width: "230px" }} />
        <h5 className="mb-4 text-secondary">Register</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 form-field d-flex align-items-center">
            <input
              type="email"
              className="reginp"
              placeholder="Email Address"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4 form-field d-flex align-items-center">
            <input
              type="text"
              className="reginp"
              placeholder="Client ID"
              value={ClientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </div>

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-main py-2">Submit</button>
            <Link to='/login' type="button" className="btn btn-main py-2">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
