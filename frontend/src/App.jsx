import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Logout from "./pages/Logout";


import CalendarPage from "./pages/CalendarPage";
import TasksPage from "./pages/TasksPage";
import AnalyticsPage from "./pages/AnalyticsPage";

import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <Routes>
      {/* AUTH PAGES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/logout" element={<Logout />} />

      {/* MAIN AREA */}
      <Route
        path="/*"
        element={
          <AppLayout>
            <Routes>
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
}
