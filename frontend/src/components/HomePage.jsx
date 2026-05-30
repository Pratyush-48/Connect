import React from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <button className="brand" onClick={() => navigate("/")}>Connect</button>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="btn-ghost" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-stage">
          <div className="hero-copy">
            <p className="eyebrow">Award-level workspace chat</p>
            <h1 className="hero-title">
              The calm control room for <span>fast-moving teams</span>.
            </h1>
            <p className="hero-sub">
              Connect brings clarity to every conversation with live presence,
              instant delivery, and a layout built to look great on any screen.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/signup")}>
                Start your workspace
              </button>
              <button className="btn-secondary" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
            <div className="hero-metrics">
              <div className="metric-card">
                <p className="metric-value">99.9%</p>
                <p className="metric-label">Delivery SLA</p>
              </div>
              <div className="metric-card">
                <p className="metric-value">12s</p>
                <p className="metric-label">Avg response</p>
              </div>
              <div className="metric-card">
                <p className="metric-value">24/7</p>
                <p className="metric-label">Presence sync</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-orb"></div>
            <div className="visual-panel visual-panel-main">
              <div className="panel-header">
                <div>
                  <p className="panel-title">Sprint Room</p>
                  <p className="panel-subtitle">Live presence</p>
                </div>
                <span className="panel-status">Online</span>
              </div>
              <div className="panel-list">
                <div className="panel-row">
                  <span className="panel-dot online"></span>
                  <span>Alex Morgan</span>
                  <span className="panel-role">Product</span>
                </div>
                <div className="panel-row">
                  <span className="panel-dot online"></span>
                  <span>Priya Singh</span>
                  <span className="panel-role">Engineering</span>
                </div>
                <div className="panel-row">
                  <span className="panel-dot offline"></span>
                  <span>Jamie Lee</span>
                  <span className="panel-role">Design</span>
                </div>
              </div>
            </div>
            <div className="visual-panel visual-panel-side">
              <p className="panel-kicker">Now playing</p>
              <p className="panel-highlight">Standup in 5 minutes</p>
              <p className="panel-note">Share blockers before kickoff.</p>
            </div>
            <div className="visual-badge">Zero clutter UI</div>
          </div>
        </section>

        <section className="signal-strip" aria-hidden="true">
          <div className="signal-track">
            <span className="signal">Presence</span>
            <span className="signal">Secure sync</span>
            <span className="signal">Multi-device</span>
            <span className="signal">Encrypted rooms</span>
            <span className="signal">Smart search</span>
            <span className="signal">Presence</span>
            <span className="signal">Secure sync</span>
            <span className="signal">Multi-device</span>
            <span className="signal">Encrypted rooms</span>
            <span className="signal">Smart search</span>
          </div>
        </section>

        <section className="feature-stack">
          <article className="feature-row">
            <div className="feature-number">01</div>
            <div className="feature-body">
              <h3 className="feature-title">Presence you can trust</h3>
              <p className="feature-text">
                Live indicators update instantly so you never wonder who is
                available.
              </p>
              <div className="feature-pills">
                <span className="pill">Online</span>
                <span className="pill">Idle</span>
                <span className="pill">Offline</span>
              </div>
            </div>
          </article>
          <article className="feature-row">
            <div className="feature-number">02</div>
            <div className="feature-body">
              <h3 className="feature-title">Instant, reliable delivery</h3>
              <p className="feature-text">
                Messages land in real time with durable history across devices.
              </p>
              <div className="feature-pills">
                <span className="pill">Sync</span>
                <span className="pill">History</span>
                <span className="pill">Realtime</span>
              </div>
            </div>
          </article>
          <article className="feature-row">
            <div className="feature-number">03</div>
            <div className="feature-body">
              <h3 className="feature-title">Designed for every screen</h3>
              <p className="feature-text">
                A responsive layout that feels premium on phone, tablet,
                desktop, or TV.
              </p>
              <div className="feature-pills">
                <span className="pill">Phone</span>
                <span className="pill">Tablet</span>
                <span className="pill">Desktop</span>
              </div>
            </div>
          </article>
        </section>

        <section className="proof-grid">
          <div className="proof-card">
            <p className="proof-label">Security</p>
            <p className="proof-value">Encrypted by default</p>
            <p className="proof-note">Private rooms with key rotation.</p>
          </div>
          <div className="proof-card">
            <p className="proof-label">Focus</p>
            <p className="proof-value">Zero clutter</p>
            <p className="proof-note">Clean UI built for teams.</p>
          </div>
          <div className="proof-card">
            <p className="proof-label">Speed</p>
            <p className="proof-value">Sub-second delivery</p>
            <p className="proof-note">Optimized sockets and caching.</p>
          </div>
        </section>

        <section className="cta-panel">
          <div>
            <h2>Ready to move faster together?</h2>
            <p>Start a new workspace and keep everyone aligned in minutes.</p>
          </div>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Create your account
            </button>
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
