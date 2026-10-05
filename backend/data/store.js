// In-memory data store
// Data will reset whenever the backend server restarts.

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
  },
];

const tasks = [
  {
    id: 1,
    title: "Setup Project",
    description: "Create the initial project structure.",
    priority: "High",
    status: "Done",
    assignedTo: 1,
    dependency: null,
  },
  {
    id: 2,
    title: "Build Authentication",
    description: "Implement mock user authentication.",
    priority: "High",
    status: "To Do",
    assignedTo: 1,
    dependency: 1,
  },
];

let nextUserId = 2;
let nextTaskId = 3;

module.exports = {
  users,
  tasks,
  getNextUserId: () => nextUserId++,
  getNextTaskId: () => nextTaskId++,
};