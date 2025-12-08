import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/tasks", label: "Tasks", icon: "📋" },
    { to: "/calendar", label: "Calendar", icon: "📅" },
    { to: "/analytics", label: "Analytics", icon: "📊" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpen(false);
    navigate("/login");
  };

  // Закриває меню при переході
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Блокуємо скролл позаду
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      {/* Бургер-кнопка */}
      <button
        className={`burger-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Темний фон */}
      <div
        className={`burger-overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Бокове меню */}
      <nav className={`burger-sidebar ${open ? "active" : ""}`}>
        <h2 className="sidebar-title">FocusApp</h2>

        <ul className="burger-menu-list">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={
                  location.pathname === item.to
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}

          <li>
            <button
              className="nav-link logout-btn"
              onClick={handleLogout}
            >
              <span className="icon">🚪</span> Log Out
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
