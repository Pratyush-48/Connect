import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";
import { BASE_URL } from "..";
import ThemeToggle from "./ThemeToggle";
import './responsive.css';
const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      navigate("/chat");
      console.log(res);
      dispatch(setAuthUser(res.data));
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please try again.";
      toast.error(message);
      console.log(error);
    }
    setUser({
      username: "",
      password: "",
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue the conversation.</p>
        </div>
        <form onSubmit={onSubmitHandler} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="input-field"
              type="text"
              placeholder="Enter your username"
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="input-field"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn-primary auth-submit">
            Login
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
