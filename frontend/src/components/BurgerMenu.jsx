import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  // Закриття при зміні сторінки
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Блокування скролу при відкритому меню
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const navigationItems = [
    { path: "/calendar", label: "Календар", icon: "📅" },
    { path: "/tasks", label: "Завдання", icon: "📋" },
    { path: "/analytics", label: "Аналітика", icon: "📊" },
    { path: "/profile", label: "Профіль", icon: "👤" },
  ];

  return (
    <>
      {/* BURGER BUTTON */}
      <button
        className={`burger-menu ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="burger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* OVERLAY */}
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR */}
      <nav className={`sidebar-nav ${isOpen ? "active" : ""}`}>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? "active" : ""}
              >
                <span style={{ marginRight: "10px" }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}

          {/* LOGOUT BUTTON */}
          <li
            style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button className="logout-menu-btn" onClick={handleLogout}>
              <span style={{ marginRight: "10px" }}>🚪</span>
              Вийти
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
