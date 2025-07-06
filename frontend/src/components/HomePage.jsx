import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Application } from '@splinetool/runtime';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const splineApp = new Application(canvasRef.current);
    splineApp.load('https://prod.spline.design/rtiWekBI2eqWUxYn/scene.splinecode')
      .then(() => setIsLoading(false))
      .catch((error) => {
        console.error('Spline error:', error);
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
          <h1 className="logo" onClick={() => navigate('/')}>ChatConnect</h1>
          <div className="auth-buttons">
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </nav>

        <main className="main-content">
          <div className="hero-section">
            <h1 className="main-heading">Connect Instantly,<br />Chat Effortlessly</h1>
            <p className="subheading">
              Experience seamless real-time messaging with end-to-end encryption
              and unlimited customization options.
            </p>
          </div>

          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>

          <div className="features">
            <div className="feature-card">
              <h3>⚡ Real-time</h3>
              <p>Messages delivered instantly with no delays</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Secure</h3>
              <p>Military-grade encryption for all conversations</p>
            </div>
            <div className="feature-card">
              <h3>💬 Unlimited</h3>
              <p>No limits on messages or media sharing</p>
            </div>
            <div className="feature-card">
              <h3>💬 Unlimited</h3>
              <p>No limits on messages or media sharing</p>
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