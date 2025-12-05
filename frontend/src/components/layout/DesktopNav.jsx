// src/components/layout/DesktopNav.jsx
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const navItems = [
  { path: "/calendar", label: "Календар", icon: "calendar" },
  { path: "/tasks", label: "Завдання", icon: "list-check" },
  { path: "/analytics", label: "Аналітика", icon: "chart-bar" },
];

export default function DesktopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="desktop-nav">
      <div style={{ padding: "24px 20px 16px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#3b78ff" }}>
          FocusApp
        </h2>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
          Керуй своїм часом
        </p>
      </div>

      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              <span style={{ fontSize: "20px", marginRight: "12px" }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        ))}

        <li style={{ marginTop: "auto", paddingTop: "32px" }}>
          <button className="desktop-logout-btn" onClick={handleLogout}>
            Вийти
          </button>
        </li>
      </ul>
    </nav>
  );
}