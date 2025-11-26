const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 } // хвилини
});

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, required: true }, // ISO date string (yyyy-mm-dd), зручно для календаря
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  stages: { type: [StageSchema], default: [] },
  totalTime: { type: Number, default: 0 } // хвилини сумарно
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
