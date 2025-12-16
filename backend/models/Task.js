const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  timeSpent: { type: Number, default: 0 },
});

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, default: "" },

    // Дата в календарі (клітинка)
    date: {
      type: String, // yyyy-MM-dd
      required: true,
    },

    deadline: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    expectedTimeHours: Number,
    expectedTimeMinutes: Number,
    expectedTimeDecimal: Number,

    stages: [stageSchema],

    spentTimeMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
