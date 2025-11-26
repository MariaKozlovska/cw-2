import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line,
  ResponsiveContainer
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await axios.get(API_PATHS.TASKS.ANALYTICS);
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  // ---------- Pie chart (by status) ----------
  const statusData = Object.entries(data.byStatus).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const COLORS = ["#4caf50", "#ff9800", "#f44336"];

  // ---------- Priority Chart ----------
  const priorityCount = { Low: 0, Medium: 0, High: 0 };
  data.tasks?.forEach(t => priorityCount[t.priority]++);

  const priorityData = Object.entries(priorityCount).map(([k, v]) => ({
    name: k,
    value: v
  }));

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Analytics Dashboard</h2>
      <p>Total tasks: {data.total}</p>

      {/* --- STATUS PIE CHART --- */}
      <h3>Tasks by Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie 
            dataKey="value" 
            data={statusData} 
            label 
            outerRadius={120}
          >
            {statusData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* --- TASKS BY PRIORITY --- */}
      <h3>Tasks by Priority</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityData}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3f51b5" />
        </BarChart>
      </ResponsiveContainer>

      {/* --- ADD MORE CHARTS LATER --- */}
    </div>
  );
}
