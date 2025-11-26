import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CalendarPage from "./pages/CalendarPage";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";

import "./style.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  </BrowserRouter>
);
