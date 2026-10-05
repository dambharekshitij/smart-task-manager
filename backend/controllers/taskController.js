const {
  tasks,
  users,
  getNextTaskId,
} = require("../data/store");

// Allowed values
const validPriorities = ["Low", "Medium", "High"];
const validStatuses = ["To Do", "In Progress", "Done"];

// Check whether a task's dependency is completed
const isTaskBlocked = (task) => {
  if (!task.dependency) {
    return false;
  }

  const dependencyTask = tasks.find(
    (item) => item.id === task.dependency
  );

  // If dependency doesn't exist, consider it blocked
  if (!dependencyTask) {
    return true;
  }

  return dependencyTask.status !== "Done";
};

// Get all tasks
const getTasks = (req, res) => {
  const tasksWithDetails = tasks.map((task) => {
    const assignedUser = users.find(
      (user) => user.id === task.assignedTo
    );

    return {
      ...task,
      assignedUser: assignedUser
        ? {
            id: assignedUser.id,
            name: assignedUser.name,
            email: assignedUser.email,
          }
        : null,
      blocked: isTaskBlocked(task),
    };
  });

  res.json(tasksWithDetails);
};

// Get tasks for a specific user
const getMyTasks = (req, res) => {
  const userId = Number(req.params.userId);

  const userTasks = tasks
    .filter((task) => task.assignedTo === userId)
    .map((task) => ({
      ...task,
      blocked: isTaskBlocked(task),
    }));

  res.json(userTasks);
};

// Create task
const createTask = (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    assignedTo,
    dependency,
  } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({
      message: "Title, description and priority are required.",
    });
  }

  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Priority must be Low, Medium, or High.",
    });
  }

  const taskStatus = status || "To Do";

  if (!validStatuses.includes(taskStatus)) {
    return res.status(400).json({
      message: "Invalid task status.",
    });
  }

  // Check assigned user
  if (assignedTo !== undefined && assignedTo !== null) {
    const userExists = users.some(
      (user) => user.id === Number(assignedTo)
    );

    if (!userExists) {
      return res.status(404).json({
        message: "Assigned user not found.",
      });
    }
  }

  // Check dependency
  if (dependency !== undefined && dependency !== null) {
    const dependencyExists = tasks.some(
      (task) => task.id === Number(dependency)
    );

    if (!dependencyExists) {
      return res.status(404).json({
        message: "Dependency task not found.",
      });
    }
  }

  const newTask = {
    id: getNextTaskId(),
    title,
    description,
    priority,
    status: taskStatus,
    assignedTo:
      assignedTo !== undefined && assignedTo !== null
        ? Number(assignedTo)
        : null,
    dependency:
      dependency !== undefined && dependency !== null
        ? Number(dependency)
        : null,
  };

  // Prevent creating a task that is immediately marked Done
  // while its dependency is incomplete.
  if (newTask.status === "Done" && isTaskBlocked(newTask)) {
    return res.status(400).json({
      message: "Task cannot be marked Done because its dependency is incomplete.",
    });
  }

  tasks.push(newTask);

  res.status(201).json({
    message: "Task created successfully.",
    task: {
      ...newTask,
      blocked: isTaskBlocked(newTask),
    },
  });
};

// Update task
const updateTask = (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return res.status(404).json({
      message: "Task not found.",
    });
  }

  const {
    title,
    description,
    priority,
    status,
    assignedTo,
    dependency,
  } = req.body;

  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Priority must be Low, Medium, or High.",
    });
  }

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid task status.",
    });
  }

  if (assignedTo !== undefined && assignedTo !== null) {
    const userExists = users.some(
      (user) => user.id === Number(assignedTo)
    );

    if (!userExists) {
      return res.status(404).json({
        message: "Assigned user not found.",
      });
    }
  }

  if (dependency !== undefined && dependency !== null) {
    const dependencyId = Number(dependency);

    if (dependencyId === taskId) {
      return res.status(400).json({
        message: "A task cannot depend on itself.",
      });
    }

    const dependencyExists = tasks.some(
      (item) => item.id === dependencyId
    );

    if (!dependencyExists) {
      return res.status(404).json({
        message: "Dependency task not found.",
      });
    }
  }

  // Apply changes
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (assignedTo !== undefined) {
    task.assignedTo =
      assignedTo === null ? null : Number(assignedTo);
  }
  if (dependency !== undefined) {
    task.dependency =
      dependency === null ? null : Number(dependency);
  }

  // Important dependency rule
  if (status === "Done") {
    if (isTaskBlocked(task)) {
      return res.status(400).json({
        message:
          "Task cannot be marked Done because its dependency is incomplete.",
      });
    }
  }

  if (status !== undefined) {
    task.status = status;
  }

  res.json({
    message: "Task updated successfully.",
    task: {
      ...task,
      blocked: isTaskBlocked(task),
    },
  });
};

// Delete task
const deleteTask = (req, res) => {
  const taskId = Number(req.params.id);

  const index = tasks.findIndex(
    (task) => task.id === taskId
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found.",
    });
  }

  // Check if another task depends on this task
  const dependentTask = tasks.find(
    (task) => task.dependency === taskId
  );

  if (dependentTask) {
    return res.status(400).json({
      message: `Cannot delete this task because "${dependentTask.title}" depends on it.`,
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.json({
    message: "Task deleted successfully.",
    task: deletedTask,
  });
};

// Mark task as complete
const completeTask = (req, res) => {
  const taskId = Number(req.params.id);

  const task = tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found.",
    });
  }

  if (isTaskBlocked(task)) {
    return res.status(400).json({
      message:
        "Task is blocked. Complete its dependency first.",
    });
  }

  task.status = "Done";

  res.json({
    message: "Task marked as completed.",
    task: {
      ...task,
      blocked: false,
    },
  });
};

// Get blocked tasks
const getBlockedTasks = (req, res) => {
  const blockedTasks = tasks
    .filter((task) => isTaskBlocked(task))
    .map((task) => ({
      ...task,
      blocked: true,
    }));

  res.json(blockedTasks);
};

module.exports = {
  getTasks,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getBlockedTasks,
};