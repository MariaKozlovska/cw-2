import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { Box, Paper, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TaskModal from "../components/TaskModal";
import axios from "../utils/axiosInstance";
import API_PATHS from "../utils/apiPaths";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matrix, setMatrix] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState(null);

  // LOAD TASKS
  const loadTasks = async () => {
    try {
      const month = format(currentDate, "yyyy-MM");  
      const res = await axios.get(`${API_PATHS.TASKS.BASE}?month=${month}`);
      setTasks(res.data);
    } catch (error) {
      console.error("TASKS LOAD ERROR:", error);
    }
  };

  useEffect(() => {
    loadTasks();
    generateMatrix();
  }, [currentDate]);

  // GENERATE CALENDAR GRID
  const generateMatrix = () => {
    let start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    let end = endOfMonth(currentDate);

    const weeks = [];
    let day = start;

    while (day <= end || weeks.length < 6) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      weeks.push(week);
    }
    setMatrix(weeks);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setEditingTask(null);
    setModalOpen(true);
  };

  const tasksForDate = (day) => {
    const d = format(day, "yyyy-MM-dd");
    return tasks.filter((t) => t.date === d);
  };

  const onPrev = () => setCurrentDate((prev) => addDays(prev, -30));
  const onNext = () => setCurrentDate((prev) => addDays(prev, 30));

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto" }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={onPrev}><ArrowBackIosNewIcon /></IconButton>
        <Typography variant="h5">
          {format(currentDate, "MMMM yyyy")}
        </Typography>
        <IconButton onClick={onNext}><ArrowForwardIosIcon /></IconButton>
      </Box>

      {/* CALENDAR */}
      <Paper sx={{ p: 2 }}>
        {/* Weekday names */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            textAlign: "center",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((w) => (
            <Box key={w}>{w}</Box>
          ))}
        </Box>

        {/* Calendar grid */}
        {matrix.map((week, wi) => (
          <Box
            key={wi}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {week.map((day, di) => {
              const dayTasks = tasksForDate(day);

              return (
                <Paper
                  key={di}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    p: 1,
                    minHeight: 80,
                    cursor: "pointer",
                    bgcolor: isSameMonth(day, currentDate)
                      ? "white"
                      : "#f5f5f5",
                    border: isSameDay(day, new Date())
                      ? "2px solid #1976d2"
                      : "1px solid #ddd",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {format(day, "d")}
                  </Typography>

                  {/* TASK LABELS */}
                  {dayTasks.map((t) => (
                    <Box
                      key={t._id}
                      sx={{
                        bgcolor:
                          t.priority === "High"
                            ? "#ffcccc"
                            : t.priority === "Medium"
                            ? "#ffe9b3"
                            : "#d8ffd8",
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.2,
                        my: 0.3,
                        fontSize: "11px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDate(day);
                        setEditingTask(t);
                        setModalOpen(true);
                      }}
                    >
                      {t.title}
                    </Box>
                  ))}
                </Paper>
              );
            })}
          </Box>
        ))}
      </Paper>

      {/* MODAL */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        editingTask={editingTask}
        onSaved={loadTasks}
      />
    </Box>
  );
}
