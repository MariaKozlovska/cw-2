import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {token && (
        <AppBar position="static" sx={{ mb: 2 }}>
          <Toolbar sx={{ display: "flex", gap: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Focus Productivity App
            </Typography>

            <Button color="inherit" component={Link} to="/calendar">Calendar</Button>
            <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
            <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Toolbar>
        </AppBar>
      )}

      <main style={{ padding: 10 }}>
        <Outlet />
      </main>
    </>
  );
}
