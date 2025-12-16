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
  IconButton
} from "@mui/material";

import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";
import TaskModal from "../components/TaskModal";
import DeleteIcon from "@mui/icons-material/Delete";

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
      console.error("TASK LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filterByMonth = (task) => {
    if (!task.deadline) return false;

    const d = new Date(task.deadline);
    const now = new Date();

    const tMonth = d.getMonth();
    const tYear = d.getFullYear();
    const cMonth = now.getMonth();
    const cYear = now.getFullYear();

    if (sortType === "month_this") {
      return tMonth === cMonth && tYear === cYear;
    }

    if (sortType === "month_prev") {
      const prevMonth = cMonth === 0 ? 11 : cMonth - 1;
      const prevYear = cMonth === 0 ? cYear - 1 : cYear;
      return tMonth === prevMonth && tYear === prevYear;
    }

    if (sortType === "month_next") {
      const nextMonth = cMonth === 11 ? 0 : cMonth + 1;
      const nextYear = cMonth === 11 ? cYear + 1 : cYear;
      return tMonth === nextMonth && tYear === nextYear;
    }

    return true;
  };

  const sortedTasks = [...tasks]
    .filter(filterByMonth)
    .sort((a, b) => {
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

  const updateStatus = async (task, newStatus) => {
    try {
      await axios.put(`${API_PATHS.TASKS.BASE}/${task.id}`, {
        ...task,
        status: newStatus,
      });
      loadTasks();
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_PATHS.TASKS.BASE}/${taskId}`);
      loadTasks();
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const statusColor = (s) =>
    s === "Pending"
      ? "#fff6cc"
      : s === "In Progress"
      ? "#e0edff"
      : "#d7f8d7";

  return (
    <Box sx={{ maxWidth: 580, mx: "auto", mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Tasks
      </Typography>

      {/* SORTING */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort / Filter By</InputLabel>
          <Select
            value={sortType}
            label="Sort / Filter By"
            onChange={(e) => setSortType(e.target.value)}
          >
            <MenuItem value="deadline">Deadline</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="month_this">This Month</MenuItem>
            <MenuItem value="month_prev">Previous Month</MenuItem>
            <MenuItem value="month_next">Next Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* TASK LIST */}
      {sortedTasks.map((task) => (
        <Paper
          key={task.id}
          sx={{
            p: 1.3,
            mb: 1.3,
            backgroundColor: statusColor(task.status),
            borderLeft: "5px solid #777",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            transition: "0.2s",
            "&:hover": { transform: "scale(1.01)" },
            width: "100%"
          }}
          onClick={() => {
            setEditingTask(task);
            setModalOpen(true);
          }}
        >
          <Box sx={{ width: "75%" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {task.title}
            </Typography>

            <Typography sx={{ fontSize: "13px", mt: 0.3 }}>
              Deadline: {task.deadline}
            </Typography>

            <Typography sx={{ fontSize: "13px", mt: 0.3 }}>
              Priority: {task.priority}
            </Typography>

            <TextField
              select
              size="small"
              label="Status"
              value={task.status}
              sx={{ mt: 1, width: 135 }}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateStatus(task, e.target.value)}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Box>

          {/* DELETE BUTTON */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}

      {/* MODAL */}
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
