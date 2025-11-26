import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography } from '@mui/material';
import axios from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';

export default function TaskModal({ open, onClose, date, onSaved, editingTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stagesText, setStagesText] = useState(''); // each line -> stage name
  const [err, setErr] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStagesText((editingTask.stages || []).map(s => s.name + (s.completed ? ' [x]' : '')).join('\n'));
    } else {
      setTitle('');
      setDescription('');
      setStagesText('');
    }
  }, [editingTask]);

  const parseStages = (text) => {
    return text.split('\n').map(line => {
      const t = line.trim();
      if (!t) return null;
      // allow "name [x]" to mark completed
      const m = t.match(/^(.*?)\s*\[x\]$/i);
      if (m) return { name: m[1].trim(), completed: true, timeSpent: 0 };
      return { name: t, completed: false, timeSpent: 0 };
    }).filter(Boolean);
  };

  const save = async () => {
    try {
      const stages = parseStages(stagesText);
      if (!title) { setErr('Title required'); return; }
      const payload = { title, description, date: date.toISOString().slice(0,10), stages };

      if (editingTask) {
        await axios.put(`${API_PATHS.TASKS.BASE}/${editingTask._id}`, payload);
      } else {
        await axios.post(API_PATHS.TASKS.BASE, payload);
      }
      if (onSaved) onSaved();
      onClose();
    } catch (error) {
      setErr(error?.response?.data?.message || 'Error saving task');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editingTask ? 'Edit Task' : 'Add Task'} — {date.toDateString()}</DialogTitle>
      <DialogContent>
        {err && <Typography color="error">{err}</Typography>}
        <TextField label="Title" fullWidth margin="normal" value={title} onChange={e=>setTitle(e.target.value)} />
        <TextField label="Description" fullWidth margin="normal" multiline minRows={2} value={description} onChange={e=>setDescription(e.target.value)} />
        <TextField label="Stages (one per line, end with [x] to mark completed)" fullWidth margin="normal" multiline minRows={3} value={stagesText} onChange={e=>setStagesText(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>{editingTask ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
}
