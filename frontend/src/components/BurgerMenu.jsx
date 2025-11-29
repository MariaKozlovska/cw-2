// src/components/BurgerMenu.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/calendar", label: "Календар", icon: "📅" },
    { path: "/tasks", label: "Завдання", icon: "📋" },
    { path: "/analytics", label: "Аналітика", icon: "📊" },
    { path: "/profile", label: "Профіль", icon: "👤" },
  ];

  useEffect(() => setIsOpen(false), [location]);

  const handleLogout = () => {
    localStorage.clear();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <button
        className={`burger-menu ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="burger-icon">
          <span></span><span></span><span></span>
        </div>
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      <nav className={`sidebar-nav ${isOpen ? "active" : ""}`}>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}

          <li className="logout-item">
            <button className="logout-menu-btn" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Вийти
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
