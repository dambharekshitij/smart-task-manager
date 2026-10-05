const { users, getNextUserId } = require("../data/store");

// Create a new user
const createUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required.",
    });
  }

  // Check whether email already exists
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      message: "User with this email already exists.",
    });
  }

  const newUser = {
    id: getNextUserId(),
    name,
    email,
    password,
  };

  users.push(newUser);

  // Don't return password
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    message: "User created successfully.",
    user: userWithoutPassword,
  });
};

// Mock login
const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  const user = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: "Login successful.",
    user: userWithoutPassword,
  });
};

// Get all users
const getUsers = (req, res) => {
  const safeUsers = users.map(({ password, ...user }) => user);

  res.json(safeUsers);
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
};