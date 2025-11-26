import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Select, MenuItem
} from "@mui/material";
import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

export default function TaskViewModal({ task, onClose, reload }) {
  const [status, setStatus] = useState(task.status);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const saveStatus = async () => {
    await axios.put(`${API_PATHS.TASKS.BASE}/${task._id}`, { status });
    reload();
    onClose();
  };

  const deleteTask = async () => {
    await axios.delete(`${API_PATHS.TASKS.BASE}/${task._id}`);
    reload();
    onClose();
  };

  const saveTimeSpent = async () => {
    const minutes = Math.floor(seconds / 60);
    await axios.put(`${API_PATHS.TASKS.BASE}/${task._id}`, {
      spentTimeMinutes: (task.spentTimeMinutes || 0) + minutes,
    });
    reload();
    setSeconds(0);
    setTimerRunning(false);
  };

  return (
    <Dialog open={!!task} onClose={onClose} fullWidth>
      <DialogTitle>{task.title}</DialogTitle>

      <DialogContent>
        <Typography><b>Description:</b> {task.description}</Typography>
        <Typography><b>Deadline:</b> {task.deadline}</Typography>
        <Typography><b>Priority:</b> {task.priority}</Typography>
        <Typography><b>Time spent:</b> {task.spentTimeMinutes || 0} min</Typography>

        <br />

        <Typography><b>Status:</b></Typography>
        <Select
          fullWidth
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>

        <br /><br />

        <Typography variant="h6">Timer</Typography>
        <Typography>
          {Math.floor(seconds / 60)}m {seconds % 60}s
        </Typography>

        <Button onClick={() => setTimerRunning(!timerRunning)}>
          {timerRunning ? "Pause" : "Start"}
        </Button>

        <Button
          onClick={saveTimeSpent}
          disabled={seconds < 60}
          variant="contained"
          color="success"
          style={{ marginLeft: 10 }}
        >
          Save Time
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={deleteTask} color="error">Delete</Button>
        <Button onClick={saveStatus} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
