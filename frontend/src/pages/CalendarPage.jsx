import React, { useState, useEffect } from 'react';
import CalendarHeader from '../components/Calendar/CalendarHeader';
import Calendar from '../components/Calendar/Calendar';
import TaskModal from '../components/TaskModal';
import axios from '../utils/axiosInstance';
import API_PATHS from '../utils/apiPaths';
import { Box, Paper } from '@mui/material';
import moment from 'moment';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_PATHS.TASKS.BASE}`);
      const ev = res.data.map(t => ({
        _id: t._id,
        title: t.title,
        start: new Date(t.date + 'T00:00:00'),
        end: new Date(t.date + 'T00:00:00'),
        allDay: true,
        task: t
      }));
      setEvents(ev);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const onPrev = () => setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const onNext = () => setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const onSelectSlot = (slot) => {
    // slot.start is Date (react-big-calendar)
    setSelectedDate(new Date(slot.start));
    setEditingTask(null);
    setModalOpen(true);
  };

  const onSelectEvent = (event) => {
    setSelectedDate(new Date(event.start));
    setEditingTask(event.task);
    setModalOpen(true);
  };

  const onSaved = () => fetchTasks();

  return (
    <Box>
      <CalendarHeader date={date} onPrev={onPrev} onNext={onNext} />
      <Paper sx={{ p: 2 }}>
        <Calendar events={events} onSelectSlot={onSelectSlot} onSelectEvent={onSelectEvent} />
      </Paper>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} date={selectedDate} onSaved={onSaved} editingTask={editingTask} />
    </Box>
  );
}
