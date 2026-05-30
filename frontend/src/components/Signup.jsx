import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "..";
import ThemeToggle from "./ThemeToggle";
import './responsive.css';
const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const navigate = useNavigate();
  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Please try again.";
      toast.error(message);
      console.log(error);
    }
    setUser({
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
      gender: "",
    });
  };
  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <button className="brand" onClick={() => navigate("/")}>Connect</button>
        <ThemeToggle compact />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join and start chatting with your team.</p>
        </div>
        <form onSubmit={onSubmitHandler} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className="input-field"
              type="text"
              placeholder="Enter your full name"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="input-field"
              type="text"
              placeholder="Choose a username"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="input-field"
              type="password"
              placeholder="Create a password"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              className="input-field"
              type="password"
              placeholder="Confirm password"
            />
          </div>
          <div className="auth-toggle">
            <span>Gender</span>
            <div className="auth-toggle-group">
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={user.gender === "male"}
                  onChange={() => handleCheckbox("male")}
                />
                <span>Male</span>
              </label>
              <label className="toggle-option">
                <input
                  type="checkbox"
                  checked={user.gender === "female"}
                  onChange={() => handleCheckbox("female")}
                />
                <span>Female</span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn-primary auth-submit">
            Signup
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
