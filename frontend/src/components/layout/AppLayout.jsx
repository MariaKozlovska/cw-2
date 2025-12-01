import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BurgerMenu from "../BurgerMenu";

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const navigationItems = [
    { path: "/tasks", label: "Завдання", icon: "📋" },
    { path: "/calendar", label: "Календар", icon: "📅" },
    { path: "/analytics", label: "Аналітика", icon: "📊" },
    { path: "/profile", label: "Профіль", icon: "👤" },
  ];

  return (
    <div className="app-container">
      {/* Desktop Navigation */}
      <aside className="desktop-nav">
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#3b78ff",
              margin: "0 0 8px 0",
            }}
          >
            FocusApp
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Керуй своїм часом
          </p>
        </div>

        <ul>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span style={{ marginRight: "12px", fontSize: "18px" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}

          {/* Logout */}
          <li
            style={{
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button
              className="nav-link desktop-logout-btn"
              onClick={handleLogout}
            >
              <span style={{ marginRight: "12px", fontSize: "18px" }}>🚪</span>
              Вийти
            </button>
          </li>
        </ul>
      </aside>

      {/* Mobile Header */}
      <header className="mobile-header">
        <h1>FocusApp</h1>
        <BurgerMenu />
      </header>

      {/* Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}
