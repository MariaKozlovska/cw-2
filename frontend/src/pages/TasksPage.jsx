import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  TextField,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";
import TaskModal from "../components/TaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [sortType, setSortType] = useState("deadline");

  const [editingTask, setEditingTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await axios.get(API_PATHS.TASKS.BASE);
      setTasks(res.data);
    } catch (err) {
      console.error("TASKS LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ----- SORTING -----
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortType === "deadline") {
      return (a.deadline || "").localeCompare(b.deadline || "");
    }
    if (sortType === "priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (sortType === "status") {
      const order = { Pending: 1, "In Progress": 2, Completed: 3 };
      return order[a.status] - order[b.status];
    }
    return 0;
  });

  // ----- UPDATE STATUS -----
  const updateStatus = async (task, newStatus) => {
    try {
      await axios.put(`${API_PATHS.TASKS.BASE}/${task.id}`, {
        ...task,
        status: newStatus,
      });
      loadTasks();
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#fff4cc";
      case "In Progress":
        return "#cfe2ff";
      case "Completed":
        return "#d4f8d4";
      default:
        return "white";
    }
  };

  return (
    <Box sx={{ maxWidth: 850, mx: "auto", mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Tasks
      </Typography>

      {/* SORTING BAR */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortType}
            label="Sort By"
            onChange={(e) => setSortType(e.target.value)}
          >
            <MenuItem value="deadline">Deadline</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* TASK LIST */}
      {sortedTasks.length === 0 && (
        <Typography>No tasks yet.</Typography>
      )}

      {sortedTasks.map((task) => (
        <Paper
          key={task.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: getStatusColor(task.status),
            borderLeft: "6px solid #555",
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": { transform: "scale(1.01)" },
          }}
          onClick={() => {
            setEditingTask(task);
            setModalOpen(true);
          }}
        >
          <Typography variant="h6">{task.title}</Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>Deadline:</strong> {task.deadline}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>Description:</strong> {task.description || "(none)"}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>Priority:</strong> {task.priority}
          </Typography>

          {/* STATUS SELECT */}
          <Box sx={{ mt: 2, maxWidth: 160 }}>
            <TextField
              select
              label="Status"
              value={task.status}
              size="small"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateStatus(task, e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>
        </Paper>
      ))}

      {/* EDIT MODAL */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingTask={editingTask}
        date={editingTask ? new Date(editingTask.date) : new Date()}
        onSaved={loadTasks}
      />
    </Box>
  );
}
