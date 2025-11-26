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
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Focus — Concentration App</Typography>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/calendar">Calendar</Button>
              <Button color="inherit" component={Link} to="/tasks">Tasks</Button>
              <Button color="inherit" component={Link} to="/analytics">Analytics</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </>
  );
}
