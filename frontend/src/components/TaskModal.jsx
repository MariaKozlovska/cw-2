import React, { useState, useEffect, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Button,
  Typography, MenuItem, Grid, Box
} from "@mui/material";

import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

export default function TaskModal({ open, onClose, onSaved, editingTask, date }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [stagesText, setStagesText] = useState("");
  const [err, setErr] = useState("");

  // --- TIMER ---
  const [spentTimeSeconds, setSpentTimeSeconds] = useState(0);
  const timerRef = useRef(null);
  const [running, setRunning] = useState(false);

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    timerRef.current = setInterval(() => {
      setSpentTimeSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setRunning(false);
    clearInterval(timerRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setSpentTimeSeconds(0);
  };

  // Format normal date (no timezone shift)
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Load data when editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setDeadline(editingTask.deadline || "");
      setHours(editingTask.expectedTimeHours ?? "");
      setMinutes(editingTask.expectedTimeMinutes ?? "");
      setPriority(editingTask.priority || "Medium");
      setStatus(editingTask.status || "Pending");

      // If task already has spent seconds — load them
      setSpentTimeSeconds(editingTask.spentTimeSeconds || 0);
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
      setHours("");
      setMinutes("");
      setPriority("Medium");
      setStatus("Pending");
      setStagesText("");
      setSpentTimeSeconds(0);
    }
  }, [editingTask, open]);

  const parseStages = (text) =>
    text
      .split("\n")
      .map((line) => {
        const t = line.trim();
        if (!t) return null;
        const m = t.match(/^(.*?)\s*\[x\]$/i);
        if (m) return { name: m[1].trim(), completed: true };
        return { name: t, completed: false };
      })
      .filter(Boolean);

  const save = async () => {
    setErr("");
    if (!title) return setErr("Title required");
    if (!deadline) return setErr("Deadline required");
    if (!date) return setErr("Internal date error");

    const selectedDate = formatDate(date);
    const h = Number(hours || 0);
    const m = Number(minutes || 0);

    const payload = {
      title,
      description,
      date: selectedDate,
      deadline,
      priority,
      status,
      stages: parseStages(stagesText),
      expectedTimeHours: h,
      expectedTimeMinutes: m,
      expectedTimeDecimal: h + m / 60,
      spentTimeSeconds, // 🔥 SEND TIMER DATA
    };

    try {
      if (editingTask && editingTask.id) {
        await axios.put(`${API_PATHS.TASKS.BASE}/${editingTask.id}`, payload);
      } else {
        await axios.post(API_PATHS.TASKS.BASE, payload);
      }

      onSaved?.();
      onClose();
    } catch (e) {
      console.log("SAVE ERROR:", e);
      setErr(e?.response?.data?.message || "Error saving task");
    }
  };

  // Format seconds nicely
  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>

      <DialogContent>
        {err && <Typography color="error">{err}</Typography>}

        <TextField fullWidth label="Title" margin="normal"
          value={title} onChange={(e) => setTitle(e.target.value)} />

        <TextField fullWidth label="Description" margin="normal"
          value={description} multiline minRows={2}
          onChange={(e) => setDescription(e.target.value)} />

        <TextField
          fullWidth label="Deadline" type="date" margin="normal"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        {/* Timer */}
        <Box sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
          <Typography variant="subtitle1">Time Spent:</Typography>
          <Typography sx={{ fontSize: "20px", mt: 1, fontWeight: 600 }}>
            {formatTime(spentTimeSeconds)}
          </Typography>

          <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={startTimer} disabled={running}>Start</Button>
            <Button variant="contained" onClick={stopTimer} disabled={!running}>Stop</Button>
            <Button variant="outlined" onClick={resetTimer}>Reset</Button>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField fullWidth type="number" label="Hours"
              value={hours} onChange={(e) => setHours(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth type="number" label="Minutes"
              value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </Grid>
        </Grid>

        <TextField fullWidth select margin="normal"
          label="Priority" value={priority}
          onChange={(e) => setPriority(e.target.value)}>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        <TextField fullWidth select margin="normal"
          label="Status" value={status}
          onChange={(e) => setStatus(e.target.value)}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField fullWidth multiline minRows={3}
          label="Stages (one per line, [x] = completed)"
          margin="normal"
          value={stagesText}
          onChange={(e) => setStagesText(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        {editingTask && editingTask.id && (
          <Button color="error" onClick={async () => {
            await axios.delete(`${API_PATHS.TASKS.BASE}/${editingTask.id}`);
            onSaved?.();
            onClose();
          }}>
            Delete
          </Button>
        )}

        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>
          {editingTask ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
