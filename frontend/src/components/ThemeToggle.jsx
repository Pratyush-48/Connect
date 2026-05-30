import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle ${theme === "dark" ? "is-dark" : ""} ${compact ? "is-compact" : ""}`}
      aria-pressed={theme === "dark"}
      aria-label="Toggle theme"
    >
      <span className="toggle-track">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
};

export default ThemeToggle;
