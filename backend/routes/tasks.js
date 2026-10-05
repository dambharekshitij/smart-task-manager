const express = require("express");

const {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getBlockedTasks,
} = require("../controllers/taskController");

const router = express.Router();

// Get all tasks
router.get("/", getTasks);

// Get blocked tasks
router.get("/blocked", getBlockedTasks);

// Get tasks assigned to a user
router.get("/user/:userId", getMyTasks);

// Create task
router.post("/", createTask);

// Update task
router.put("/:id", updateTask);

// Delete task
router.delete("/:id", deleteTask);

// Mark task as complete
router.patch("/:id/complete", completeTask);

module.exports = router;