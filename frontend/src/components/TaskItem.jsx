import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';

export default function TaskItem({ task, onDeleted, onEdit }) {
  const del = async () => {
    if (!confirm('Delete task?')) return;
    try {
      await axios.delete(`${API_PATHS.TASKS.BASE}/${task._id}`);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <div>
            <Typography variant="subtitle1">{task.title}</Typography>
            <Typography variant="body2" color="text.secondary">{task.date} • {task.status}</Typography>
            <Typography variant="body2">{task.description}</Typography>
            <Typography variant="caption">Stages: {task.stages?.map(s => `${s.name}${s.completed ? ' ✓' : ''}`).join(', ') || '—'}</Typography>
          </div>
          <div>
            <IconButton onClick={() => onEdit(task)}><EditIcon /></IconButton>
            <IconButton onClick={del}><DeleteIcon /></IconButton>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}
