import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Button,
  Typography, MenuItem, Grid
} from "@mui/material";

import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

export default function TaskModal({ open, onClose, onSaved, editingTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [deadline, setDeadline] = useState("");

  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  const [stagesText, setStagesText] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDeadline(editingTask.deadline);

      setHours(editingTask.expectedTimeHours || "");
      setMinutes(editingTask.expectedTimeMinutes || "");

      setPriority(editingTask.priority);
      setStatus(editingTask.status);

      setStagesText(
        (editingTask.stages || [])
          .map(s => s.name + (s.completed ? " [x]" : ""))
          .join("\n")
      );
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
  }, [editingTask]);

  const parseStages = text =>
    text
      .split("\n")
      .map(line => {
        const t = line.trim();
        if (!t) return null;

        const m = t.match(/^(.*?)\s*\[x\]$/i);
        if (m) return { name: m[1].trim(), completed: true, timeSpent: 0 };

        return { name: t, completed: false, timeSpent: 0 };
      })
      .filter(Boolean);

  const save = async () => {
    if (!title) return setErr("Title required");
    if (!deadline) return setErr("Deadline required");

    const h = Number(hours || 0);
    const m = Number(minutes || 0);
    const decimal = h + m / 60;

    const payload = {
      title,
      description,
      deadline,
      priority,
      status,
      stages: parseStages(stagesText),

      expectedTimeHours: h,
      expectedTimeMinutes: m,
      expectedTimeDecimal: decimal,
    };

    try {
      if (editingTask) {
        await axios.put(`${API_PATHS.TASKS.BASE}/${editingTask._id}`, payload);
      } else {
        await axios.post(API_PATHS.TASKS.BASE, payload);
      }

      onSaved?.();
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Error saving task");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingTask ? "Edit Task" : "Create Task"}</DialogTitle>

      <DialogContent>
        {err && <Typography color="error">{err}</Typography>}

        <TextField fullWidth label="Title" margin="normal"
          value={title} onChange={e => setTitle(e.target.value)} />

        <TextField fullWidth label="Description" margin="normal"
          value={description} multiline minRows={2}
          onChange={e => setDescription(e.target.value)} />

        {/* DEADLINE */}
        <TextField
          fullWidth
          label="Deadline"
          type="date"
          margin="normal"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Hours"
              type="number"
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Minutes"
              type="number"
              value={minutes}
              onChange={e => setMinutes(e.target.value)}
            />
          </Grid>
        </Grid>

        <TextField
          fullWidth select margin="normal"
          label="Priority" value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

        <TextField
          fullWidth select margin="normal"
          label="Status" value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField
          fullWidth multiline minRows={3}
          label="Stages (one per line, [x] = completed)"
          margin="normal"
          value={stagesText}
          onChange={e => setStagesText(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>
          {editingTask ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
