import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";
import TaskModal from "../components/TaskModal";
import TaskViewModal from "../components/TaskViewModal";
import { Button, MenuItem, Select } from "@mui/material";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [sortMode, setSortMode] = useState("deadline");

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(null);

  // default date for creation
  const [tempDate] = useState(new Date());

  const load = async () => {
    try {
      const res = await axios.get(API_PATHS.TASKS.BASE);
      setTasks(res.data);
    } catch (err) {
      console.error("TASK LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sorted = () => {
    const arr = [...tasks];

    if (sortMode === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      arr.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    if (sortMode === "deadline") {
      arr.sort((a, b) => a.date?.localeCompare(b.date));
    }

    return arr;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tasks</h2>

      <Button 
        variant="contained" 
        onClick={() => setOpenCreate(true)}
        sx={{ mt: 1 }}
      >
        Add Task
      </Button>

      <br /><br />

      <Select 
        value={sortMode} 
        onChange={e => setSortMode(e.target.value)}
      >
        <MenuItem value="deadline">By Date</MenuItem>
        <MenuItem value="priority">By Priority</MenuItem>
      </Select>

      <div style={{ marginTop: 20 }}>
        {sorted().map(t => (
          <div
            key={t._id}
            onClick={() => setOpenView(t)}
            style={{
              padding: "12px 16px",
              marginBottom: 10,
              borderRadius: 8,
              cursor: "pointer",
              border: "1px solid #ccc",
              background:
                t.priority === "High"
                  ? "#ffe5e5"
                  : t.priority === "Medium"
                  ? "#fff7da"
                  : "#e5ffe5",
            }}
          >
            <b>{t.title}</b>
            <div>Date: {t.date}</div>
            <div>Status: {t.status}</div>
          </div>
        ))}
      </div>

      {openCreate && (
        <TaskModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSaved={load}
          date={tempDate}
        />
      )}

      {openView && (
        <TaskViewModal
          task={openView}
          onClose={() => setOpenView(null)}
          reload={load}
        />
      )}
    </div>
  );
}
