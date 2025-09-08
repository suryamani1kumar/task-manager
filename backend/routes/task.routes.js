import { Router } from "express";
import { body, param } from "express-validator";
import { auth } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controller/task.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */

/**
 * @swagger
 * /api/getTask:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 */

/**
 * @swagger
 * /api/createTask:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Finish project
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-10
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: pending
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/getTaskById/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/updateTask/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Update project title
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-15
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /api/deleteTask/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the task
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */

router.use(auth);

router.get("/getTask", getTasks);

router.post(
  "/createTask",
  [
    body("title").notEmpty(),
    body("dueDate").isISO8601().toDate(),
    body("status").optional().isIn(["pending", "in-progress", "completed"]),
  ],
  createTask
);

router.get("/getTaskById/:id", [param("id").isMongoId()], getTaskById);

router.put(
  "/updateTask/:id",
  [
    param("id").isMongoId(),
    body("title").optional().notEmpty(),
    body("dueDate").optional().isISO8601().toDate(),
    body("status").optional().isIn(["pending", "in-progress", "completed"]),
  ],
  updateTask
);

router.delete("/deleteTask/:id", [param("id").isMongoId()], deleteTask);

export default router;
