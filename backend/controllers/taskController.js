const db = require("../db");

/* ================================
   GET ALL TASKS
================================ */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await db.allAsync(
      "SELECT * FROM tasks WHERE userId = ? ORDER BY date ASC",
      [req.user.id]
    );

    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   CREATE TASK
================================ */
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      deadline,
      priority,
      status,
      stages,
      expectedTimeHours,
      expectedTimeMinutes,
      expectedTimeDecimal,
      spentTimeSeconds = 0    // ← додаємо підтримку
    } = req.body;

    if (!title || !date || !deadline)
      return res.status(400).json({ message: "Missing fields" });

    const now = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO tasks 
      (userId, title, description, date, deadline, priority, status, expectedTimeHours, expectedTimeMinutes, expectedTimeDecimal, spentTimeSeconds, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title,
        description || "",
        date,
        deadline,
        priority || "Medium",
        status || "Pending",
        expectedTimeHours || 0,
        expectedTimeMinutes || 0,
        expectedTimeDecimal || 0,
        spentTimeSeconds || 0,     // ← записуємо в БД
        now,
        now
      ]
    );

    const task = await db.getAsync(
      "SELECT * FROM tasks WHERE id = ?",
      [result.lastID]
    );

    res.json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   UPDATE TASK
================================ */
exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const now = new Date().toISOString();

    await db.runAsync(
      `UPDATE tasks SET
        title = ?, 
        description = ?, 
        date = ?, 
        deadline = ?, 
        priority = ?, 
        status = ?,
        expectedTimeHours = ?, 
        expectedTimeMinutes = ?, 
        expectedTimeDecimal = ?,
        spentTimeSeconds = ?,     -- ← додаємо update
        updatedAt = ?
      WHERE id = ? AND userId = ?`,
      [
        updates.title,
        updates.description,
        updates.date,
        updates.deadline,
        updates.priority,
        updates.status,
        updates.expectedTimeHours,
        updates.expectedTimeMinutes,
        updates.expectedTimeDecimal,
        updates.spentTimeSeconds || 0,  // ← зберігаємо час
        now,
        id,
        req.user.id
      ]
    );

    const task = await db.getAsync(
      "SELECT * FROM tasks WHERE id = ? AND userId = ?",
      [id, req.user.id]
    );

    res.json(task);

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   DELETE TASK
================================ */
exports.deleteTask = async (req, res) => {
  try {
    await db.runAsync(
      "DELETE FROM tasks WHERE id = ? AND userId = ?",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   ANALYTICS
   (тепер показує totalSpentSeconds)
================================ */
exports.analytics = async (req, res) => {
  try {
    const tasks = await db.allAsync(
      "SELECT * FROM tasks WHERE userId = ?",
      [req.user.id]
    );

    const stats = {
      total: tasks.length,
      totalSpentSeconds: 0,     // ← загальний витрачений час
      byStatus: { Pending: 0, "In Progress": 0, Completed: 0 },
      byPriority: {
        Low: { count: 0, time: 0 },
        Medium: { count: 0, time: 0 },
        High: { count: 0, time: 0 }
      }
    };

    tasks.forEach((t) => {
      // Лічильники
      stats.byStatus[t.status]++;
      stats.byPriority[t.priority].count++;

      // Час
      const sec = t.spentTimeSeconds || 0;
      stats.totalSpentSeconds += sec;
      stats.byPriority[t.priority].time += sec;
    });

    res.json(stats);

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
