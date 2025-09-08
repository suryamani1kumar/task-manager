import Task from "../models/task.models.js";
import { validationResult } from "express-validator";

export async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
}

export async function getTasks(req, res, next) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Task.find(filter).sort({ dueDate: 1 }).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);
    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    next(e);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (e) {
    next(e);
  }
}

export async function updateTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (e) {
    next(e);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
}
