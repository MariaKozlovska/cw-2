import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Закриваємо меню при зміні сторінки
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Блокуємо scroll body коли меню відкрите
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    { path: '/tasks', label: 'Завдання', icon: '📋' },
    { path: '/calendar', label: 'Календар', icon: '📅' },
    { path: '/analytics', label: 'Аналітика', icon: '📊' },
    { path: '/profile', label: 'Профіль', icon: '👤' },
  ];

  return (
    <>
      {/* Burger Button */}
      <button
        className={`burger-menu ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="burger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      />

      {/* Sidebar Navigation */}
      <nav className={`sidebar-nav ${isOpen ? 'active' : ''}`}>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <Link to="/logout" style={{ color: '#dc2626' }}>
              <span style={{ marginRight: '10px' }}>🚪</span>
              Вийти
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default BurgerMenu;