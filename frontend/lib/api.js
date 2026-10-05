const API_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Users
export const getUsers = () => request("/users");

export const createUser = (user) =>
  request("/users", {
    method: "POST",
    body: JSON.stringify(user),
  });

export const loginUser = (credentials) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// Tasks
export const getTasks = () => request("/tasks");

export const getMyTasks = (userId) =>
  request(`/tasks/user/${userId}`);

export const getBlockedTasks = () =>
  request("/tasks/blocked");

export const createTask = (task) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: "DELETE",
  });

export const completeTask = (id) =>
  request(`/tasks/${id}/complete`, {
    method: "PATCH",
  });