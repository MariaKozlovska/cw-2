import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);

  const load = async () => {
    const res = await axios.get(API_PATHS.TASKS.BASE);
    setTasks(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>All Tasks</h2>
      {tasks.map(t => (
        <div key={t._id} style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
          <b>{t.title}</b> — {t.date}  
          <br />
          Priority: {t.priority} | Status: {t.status}
        </div>
      ))}
    </div>
  );
}
