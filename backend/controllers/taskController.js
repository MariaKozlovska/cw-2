const Task = require('../models/Task');

// Get all tasks for user (optionally filter by month)
exports.getTasks = async (req, res) => {
  try {
    // optional query ?month=2025-07
    const filter = { userId: req.user.id };
    if (req.query.month) {
      // expect "YYYY-MM"
      const month = req.query.month;
      // match date starting with month
      filter.date = { $regex: `^${month}` };
    }
    const tasks = await Task.find(filter).sort({ date: 1, createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, date, stages } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Missing fields' });

    const task = new Task({
      userId: req.user.id,
      title,
      description: description || '',
      date,
      stages: Array.isArray(stages) ? stages : []
    });

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    // If updating stages, recalc totalTime and status optionally
    if (updates.stages) {
      let total = 0;
      let allCompleted = true;
      updates.stages.forEach(s => {
        total += Number(s.timeSpent || 0);
        if (!s.completed) allCompleted = false;
      });
      updates.totalTime = total;
      updates.status = allCompleted ? 'done' : (updates.status || undefined);
    }

    const task = await Task.findOneAndUpdate({ _id: taskId, userId: req.user.id }, updates, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics endpoint: tasks count by status & stage summary for a given month (optional)
exports.analytics = async (req, res) => {
  try {
    const month = req.query.month; // "YYYY-MM" optional
    const match = { userId: req.user.id };
    if (month) match.date = { $regex: `^${month}` };

    const tasks = await Task.find(match);
    const total = tasks.length;
    const byStatus = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    // stages summary: count tasks that have a stage with name and completed true/false
    const stagesMap = {}; // name -> { completed: n, total: n }
    tasks.forEach(t => {
      (t.stages || []).forEach(s => {
        if (!stagesMap[s.name]) stagesMap[s.name] = { completed: 0, total: 0 };
        stagesMap[s.name].total += 1;
        if (s.completed) stagesMap[s.name].completed += 1;
      });
    });

    res.json({ total, byStatus, stages: stagesMap });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
