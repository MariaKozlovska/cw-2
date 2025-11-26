import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';
import { Container, Typography, Paper } from '@mui/material';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetch = async () => {
    try {
      const res = await axios.get(API_PATHS.TASKS.BASE);
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>All Tasks</Typography>
        <button onClick={() => { setEditingTask(null); setOpen(true); }}>Add Task</button>
        {tasks.map(t => (
          <TaskItem key={t._id} task={t} onDeleted={fetch} onEdit={(x)=>{ setEditingTask(x); setOpen(true); }} />
        ))}
      </Paper>

      <TaskModal open={open} onClose={() => setOpen(false)} date={new Date()} onSaved={fetch} editingTask={editingTask} />
    </Container>
  );
}
