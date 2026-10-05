const express = require("express");

const {
  createUser,
  loginUser,
  getUsers,
} = require("../controllers/userController");

const router = express.Router();

// Create user
router.post("/", createUser);

// Login
router.post("/login", loginUser);

// Get all users
router.get("/", getUsers);

module.exports = router;