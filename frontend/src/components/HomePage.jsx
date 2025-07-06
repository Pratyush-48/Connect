import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Application } from "@splinetool/runtime";
import "./HomePage.css";
import "./responsive.css";
const HomePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const splineApp = new Application(canvasRef.current);
    splineApp
      .load("https://prod.spline.design/rtiWekBI2eqWUxYn/scene.splinecode")
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error("Spline error:", error);
        setIsLoading(false);
      });

    return () => {
      if (splineApp) splineApp.dispose();
    };
  }, []);

  return (
    <div className="app">
      {/* Content Container (Left Side) */}
      <div className="content-container">
        <nav className="navbar">
          <h1 className="logo" onClick={() => navigate("/")}>
            ChatConnect
          </h1>
          <div className="auth-buttons">
            <button className="btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </nav>

        <main className="main-content">
          <div className="hero-section">
            <h1 className="main-heading">
              Connect Instantly,
              <br />
              Chat Effortlessly
            </h1>
            <p className="subheading">
              Experience seamless real-time text messaging with unlimited
              conversations
            </p>
          </div>

          <div className="cta-buttons">
            <button className="btn" onClick={() => navigate("/signup")}>
              Get Started
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <h3>⚡ Instant Text</h3>
              <p>Messages delivered in real-time</p>
            </div>
            <div className="feature-card">
              <h3>📱 Always Available</h3>
              <p>Continue conversations across devices</p>
            </div>
            <div className="feature-card">
              <h3>📅 Conversation History</h3>
              <p>All your messages are saved</p>
            </div>
            <div className="feature-card">
              <h3>🌙 Dark Mode</h3>
              <p>Comfortable nighttime chatting</p>
            </div>
          </div>
        </main>
      </div>

      {/* Spline Container (Right Side) */}
      <div className="spline-container">
        <canvas ref={canvasRef} className="spline-canvas" />
        {isLoading && (
          <div className="spline-loading">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
