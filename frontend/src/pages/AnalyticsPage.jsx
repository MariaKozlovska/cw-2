import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  useMediaQuery,
} from "@mui/material";

import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  High: "#ff6b6b",
  Medium: "#f7c948",
  Low: "#51cf66",
};

const formatTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h}h ${m}m ${s}s`;
};

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState([]);
  const [period, setPeriod] = useState("week");

  const isNarrow = useMediaQuery("(max-width: 768px)");

  // Load tasks
  const loadTasks = async () => {
    try {
      const res = await axios.get(API_PATHS.TASKS.BASE);
      setTasks(res.data);
    } catch (error) {
      console.error("ANALYTICS LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Filter by time period
  const filterByPeriod = () => {
    const now = new Date();

    return tasks.filter((t) => {
      const d = new Date(t.date);
      const diff = now - d;

      switch (period) {
        case "day":
          return d.toDateString() === now.toDateString();
        case "week":
          return diff <= 7 * 24 * 60 * 60 * 1000;
        case "month":
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        case "year":
          return d.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const filtered = filterByPeriod();

  // Build time-by-priority map
  const timeByPriority = filtered.reduce(
    (acc, t) => {
      acc[t.priority] += t.spentTimeSeconds || 0;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const totalSeconds =
    timeByPriority.High + timeByPriority.Medium + timeByPriority.Low;

  // PieChart uses PERCENTAGES instead of seconds
  const pieData = Object.keys(timeByPriority).map((key) => ({
    name: key,
    seconds: timeByPriority[key], // needed for tooltip
    value:
      totalSeconds > 0
        ? Math.round((timeByPriority[key] / totalSeconds) * 100)
        : 0,
  }));

  const barData = Object.keys(timeByPriority).map((key) => ({
    name: key,
    value: timeByPriority[key],
  }));

  const lineData = filtered.map((t) => ({
    name: t.title,
    seconds: t.spentTimeSeconds || 0,
  }));

  return (
    <Box
      sx={{
        maxWidth: 980,
        mx: "auto",
        mt: 3,
        px: { xs: 2, md: 0 },
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
      >
        Analytics
      </Typography>

      {/* PERIOD SELECT */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Period</InputLabel>
        <Select
          value={period}
          label="Period"
          onChange={(e) => setPeriod(e.target.value)}
        >
          <MenuItem value="day">Today</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </Select>
      </FormControl>

      {/* SUMMARY */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">
          Total Time: {formatTime(totalSeconds)}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          High Priority: {formatTime(timeByPriority.High)}
        </Typography>
        <Typography>
          Medium Priority: {formatTime(timeByPriority.Medium)}
        </Typography>
        <Typography>
          Low Priority: {formatTime(timeByPriority.Low)}
        </Typography>
      </Paper>

      {/* ===== PIE CHART (PERCENTAGES) ===== */}
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Time Distribution (%)
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label={({ value }) => `${value}%`}
          >
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => {
              const sec = props.payload.seconds;
              return [`${value}% (${formatTime(sec)})`, name];
            }}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* ===== BOTTOM CHARTS ===== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
          gap: 3,
          mt: 4,
        }}
      >
        {/* BAR CHART */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
            Time by Priority
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => formatTime(v)} />
              <Bar dataKey="value">
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* LINE CHART */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
            Time per Task
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v) => formatTime(v)} />
              <Line type="monotone" dataKey="seconds" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}
