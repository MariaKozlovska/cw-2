const Task = require("../models/Task");

// GET ALL TASKS
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      deadline: 1,
      createdAt: 1,
    });
    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      deadline,
      priority,
      status,
      stages,
      expectedTimeHours,
      expectedTimeMinutes,
      expectedTimeDecimal
    } = req.body;

    if (!title || !deadline)
      return res.status(400).json({ message: "Title and deadline required" });

    const task = new Task({
      userId: req.user.id,
      title,
      description,
      deadline,
      priority,
      status,
      stages,
      expectedTimeHours,
      expectedTimeMinutes,
      expectedTimeDecimal,
    });

    await task.save();
    res.json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const updates = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ANALYTICS
exports.analytics = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    const total = tasks.length;

    const byStatus = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    };

    const byPriority = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    let totalExpected = 0;
    let totalSpent = 0;

    tasks.forEach(t => {
      if (byStatus[t.status] !== undefined) byStatus[t.status]++;
      if (byPriority[t.priority] !== undefined) byPriority[t.priority]++;

      totalExpected += t.expectedTimeDecimal || 0;
      totalSpent += t.spentTime || 0;
    });

    res.json({
      total,
      byStatus,
      byPriority,
      totalExpected,
      totalSpent
    });

  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
