const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Smart Task Manager API is running.",
  });
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});