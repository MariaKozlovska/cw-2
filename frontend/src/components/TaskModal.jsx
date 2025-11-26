import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
  MenuItem,
  Grid
} from '@mui/material';

import axios from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';

export default function TaskModal({ open, onClose, date, onSaved, editingTask }) {

  // --- FORM FIELDS ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');

  const [stagesText, setStagesText] = useState('');
  const [err, setErr] = useState('');


  // ===========================
  //   FIX: LOCAL DATE FORMAT
  // ===========================
  const formatLocalDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };


  // ====================================
  //   LOAD EDITING DATA (if editingTask)
  // ====================================
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');

      setHours(editingTask.expectedTimeHours ?? '');
      setMinutes(editingTask.expectedTimeMinutes ?? '');

      setPriority(editingTask.priority || 'Medium');
      setStatus(editingTask.status || 'Pending');

      setStagesText(
        (editingTask.stages || [])
          .map(s => s.name + (s.completed ? ' [x]' : ''))
          .join('\n')
      );
    } else {
      setTitle('');
      setDescription('');
      setHours('');
      setMinutes('');
      setPriority('Medium');
      setStatus('Pending');
      setStagesText('');
    }
  }, [editingTask]);


  // ===========================
  //   PARSE STAGES INPUT
  // ===========================
  const parseStages = (text) => {
    return text
      .split('\n')
      .map(line => {
        const t = line.trim();
        if (!t) return null;

        const m = t.match(/^(.*?)\s*\[x\]$/i);
        if (m) {
          return { name: m[1].trim(), completed: true, timeSpent: 0 };
        }

        return { name: t, completed: false, timeSpent: 0 };
      })
      .filter(Boolean);
  };


  // ===========================
  //     SAVE TASK
  // ===========================
  const save = async () => {
    try {
      setErr('');

      if (!title) return setErr("Title is required");

      if (hours === '' || hours < 0) return setErr("Hours must be ≥ 0");
      if (minutes === '' || minutes < 0 || minutes > 59)
        return setErr("Minutes must be 0–59");

      const h = Number(hours);
      const m = Number(minutes);

      const decimal = h + m / 60;

      const stages = parseStages(stagesText);

      const payload = {
        title,
        description,
        date: formatLocalDate(date),

        expectedTimeHours: h,
        expectedTimeMinutes: m,
        expectedTimeDecimal: decimal,

        priority,
        status,
        stages
      };

      if (editingTask) {
        await axios.put(`${API_PATHS.TASKS.BASE}/${editingTask._id}`, payload);
      } else {
        await axios.post(API_PATHS.TASKS.BASE, payload);
      }

      onSaved?.();
      onClose();

    } catch (error) {
      setErr(error?.response?.data?.message || "Error saving task");
    }
  };


  // ===========================
  //    RENDER MODAL
  // ===========================
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {editingTask ? "Edit Task" : "Add Task"} — {date.toDateString()}
      </DialogTitle>

      <DialogContent>
        {err && <Typography color="error">{err}</Typography>}

               {/* TITLE */}
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

              {/* DESCRIPTION */}
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

              {/* TIME INPUTS */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Hours"
              type="number"
              fullWidth
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Minutes"
              type="number"
              fullWidth
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </Grid>
        </Grid>


              {/* PRIORITY */}
        <TextField
          select
          label="Priority"
          fullWidth
          margin="normal"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </TextField>

              {/* STATUS */}
        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>


              {/* STAGES */}
        <TextField
          label="Stages (one per line, add [x] for completed)"
          fullWidth
          margin="normal"
          multiline
          minRows={3}
          value={stagesText}
          onChange={(e) => setStagesText(e.target.value)}
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
