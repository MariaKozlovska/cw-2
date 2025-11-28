import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  MenuItem,
  Grid,
  Box   
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

  // -------------------------
  //     TIMER SYSTEM
  // -------------------------
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
    clearInterval(intervalRef.current);

    // convert seconds → minutes
    const minutesSpent = Math.round(timerSeconds / 60);

    // merge with existing spent time
    setMinutes((prev) => {
      return Number(prev || 0);
    });

    saveTimeToTask(minutesSpent);
  };

  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(false);
    clearInterval(intervalRef.current);
  };

  const saveTimeToTask = async (minutesSpent) => {
    if (!editingTask || !editingTask.id) return;

    try {
      await axios.put(`${API_PATHS.TASKS.BASE}/${editingTask.id}`, {
        spentTimeMinutes: (editingTask.spentTimeMinutes || 0) + minutesSpent,
      });

      onSaved?.();
    } catch (err) {
      console.error("SAVE TIME ERROR:", err);
    }
  };

  // Display timer as MM:SS
  const formatTimer = () => {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // -------------------------
  // FORMAT DATE TO yyyy-mm-dd
  // -------------------------
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // -------------------------
  // LOAD FOR EDIT
  // -------------------------
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setDeadline(editingTask.deadline || "");

      setHours(editingTask.expectedTimeHours ?? "");
      setMinutes(editingTask.expectedTimeMinutes ?? "");

      setPriority(editingTask.priority || "Medium");
      setStatus(editingTask.status || "Pending");

      setStagesText("");
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
      setHours("");
      setMinutes("");
      setPriority("Medium");
      setStatus("Pending");
      setStagesText("");
    }

    resetTimer();
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

  // -------------------------
  // SAVE TASK
  // -------------------------
  const save = async () => {
    setErr("");

    if (!title) return setErr("Title required");
    if (!deadline) return setErr("Deadline required");
    if (!date) return setErr("Internal date error");

    const selectedDate = formatDate(date);

    const h = Number(hours || 0);
    const m = Number(minutes || 0);
    const decimal = h + m / 60;

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
      expectedTimeDecimal: decimal,
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>

      <DialogContent>
        {err && <Typography color="error">{err}</Typography>}

        {/* BASIC INPUTS */}
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

        {/* TIMER SECTION */}
        {editingTask && (
          <Box sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography sx={{ mb: 1 }}>
              ⏱ Time Spent: <b>{formatTimer()}</b>
            </Typography>

            <Button
              variant="contained"
              color={timerRunning ? "error" : "success"}
              onClick={timerRunning ? stopTimer : startTimer}
              sx={{ mr: 1 }}
            >
              {timerRunning ? "Stop" : "Start"}
            </Button>

            <Button
              variant="outlined"
              onClick={resetTimer}
              disabled={timerRunning}
            >
              Reset
            </Button>

            <Typography sx={{ mt: 2, fontSize: "14px" }}>
              Total saved time: <b>{editingTask.spentTimeMinutes || 0} min</b>
            </Typography>
          </Box>
        )}

        {/* TIME INPUT */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField fullWidth label="Hours" type="number"
              value={hours} onChange={(e) => setHours(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Minutes" type="number"
              value={minutes} onChange={(e) => setMinutes(e.target.value)} />
          </Grid>
        </Grid>

        {/* OTHER FIELDS */}
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
      </DialogContent>

      <DialogActions>
        {/* DELETE */}
        {editingTask && editingTask.id && (
          <Button
            color="error"
            onClick={async () => {
              await axios.delete(`${API_PATHS.TASKS.BASE}/${editingTask.id}`);
              onSaved?.();
              onClose();
            }}
          >
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
