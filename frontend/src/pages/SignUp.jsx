import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../style.css";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/api/auth/register", {
        fullName,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/calendar");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
