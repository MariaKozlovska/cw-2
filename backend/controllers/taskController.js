const db = require("../db");

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

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      deadline,
      priority,
      status,
      expectedTimeHours,
      expectedTimeMinutes,
      expectedTimeDecimal
    } = req.body;

    if (!title || !date || !deadline)
      return res.status(400).json({ message: "Missing fields" });

    const now = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO tasks 
      (userId, title, description, date, deadline, priority, status,
       expectedTimeHours, expectedTimeMinutes, expectedTimeDecimal,
       createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

exports.updateTask = async (req, res) => {
  try {
    const id = req.params.id;

    const updates = req.body;
    const now = new Date().toISOString();

    await db.runAsync(
      `UPDATE tasks SET
        title = ?, description = ?, date = ?, deadline = ?, priority = ?, status = ?,
        expectedTimeHours = ?, expectedTimeMinutes = ?, expectedTimeDecimal = ?,
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

exports.analytics = async (req, res) => {
  try {
    const tasks = await db.allAsync(
      "SELECT * FROM tasks WHERE userId = ?", 
      [req.user.id]
    );

    const stats = {
      total: tasks.length,
      byStatus: { Pending: 0, "In Progress": 0, Completed: 0 },
      byPriority: { Low: 0, Medium: 0, High: 0 }
    };

    tasks.forEach(t => {
      stats.byStatus[t.status]++;
      stats.byPriority[t.priority]++;
    });

    res.json(stats);

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
