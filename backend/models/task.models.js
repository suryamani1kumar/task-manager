import mongoose from "mongoose";
import Counter from "./counter.models.js";

const taskSchema = new mongoose.Schema(
  {
    taskId: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    dueDate: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-increment taskId
taskSchema.pre("save", async function (next) {
  if (this.taskId) return next();
  const counter = await Counter.findOneAndUpdate(
    { name: "taskId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  this.taskId = counter.seq;
  next();
});

export default mongoose.model("Task", taskSchema);
