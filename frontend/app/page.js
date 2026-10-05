"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getTasks,
  getUsers,
  completeTask,
  deleteTask,
} from "@/lib/api";

import TaskForm from "@/components/TaskForm";
import EditTaskForm from "@/components/EditTaskForm";

export default function Home() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [view, setView] = useState("all");
  const [priority, setPriority] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Check login
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
    } catch {
      localStorage.removeItem("loggedInUser");
      router.push("/login");
    }
  }, [router]);

  // Load tasks and users
  const loadData = async () => {
    try {
      setLoading(true);

      const taskData = await getTasks();
      const userData = await getUsers();

      setTasks(taskData);
      setUsers(userData);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  // Complete task
  const handleComplete = async (id) => {
    try {
      await completeTask(id);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(id);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Get user name
  const getUserName = (userId) => {
    const user = users.find(
      (item) => Number(item.id) === Number(userId)
    );

    if (!user) {
      return "Unassigned";
    }

    return user.name;
  };

  // Statistics
  const totalTasks = tasks.length;

  const myTaskCount = tasks.filter(
    (task) =>
      Number(task.assignedTo) === Number(currentUser?.id)
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const blockedTasks = tasks.filter(
    (task) => task.blocked
  ).length;

  // Filter tasks
  let displayedTasks = tasks;

  if (view === "my") {
    displayedTasks = displayedTasks.filter(
      (task) =>
        Number(task.assignedTo) ===
        Number(currentUser?.id)
    );
  }

  if (priority !== "All") {
    displayedTasks = displayedTasks.filter(
      (task) => task.priority === priority
    );
  }

  // Loading screen
  if (loading || !currentUser) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-lg">
          Loading Smart Task Manager...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              Smart Task Manager
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Manage tasks, priorities and dependencies
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="px-4 py-2 bg-slate-800 rounded-lg text-sm">
              {currentUser.name}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-800 text-red-300">
            {error}
          </div>
        )}

        {/* STATISTICS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

          <StatCard
            title="Total Tasks"
            value={totalTasks}
          />

          <StatCard
            title="My Tasks"
            value={myTaskCount}
          />

          <StatCard
            title="In Progress"
            value={inProgressTasks}
          />

          <StatCard
            title="Completed"
            value={completedTasks}
          />

          <StatCard
            title="Blocked Tasks"
            value={blockedTasks}
          />

        </div>

        {/* TASK AREA */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

          {/* TITLE */}

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              {view === "my" ? "My Tasks" : "All Tasks"}
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              {view === "my"
                ? "Tasks assigned to you"
                : "Track and manage your team's tasks"}
            </p>

          </div>

          {/* VIEW BUTTONS */}

          <div className="flex flex-wrap gap-3 mb-4">

            <button
              type="button"
              onClick={() => setView("all")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
            >
              All Tasks
            </button>

            <button
              type="button"
              onClick={() => setView("my")}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
            >
              My Tasks
            </button>

          </div>

          {/* PRIORITY BUTTONS */}

          <div className="flex flex-wrap gap-3 mb-6">

            <button
              type="button"
              onClick={() => setPriority("All")}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setPriority("High")}
              className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm"
            >
              High
            </button>

            <button
              type="button"
              onClick={() => setPriority("Medium")}
              className="px-4 py-2 rounded-lg bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 text-sm"
            >
              Medium
            </button>

            <button
              type="button"
              onClick={() => setPriority("Low")}
              className="px-4 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 text-sm"
            >
              Low
            </button>

            <button
              type="button"
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm"
            >
              + New Task
            </button>

          </div>

          {/* TASK COUNT */}

          <p className="text-sm text-slate-500 mb-5">
            Showing {displayedTasks.length} task
            {displayedTasks.length !== 1 ? "s" : ""}
          </p>

          {/* TASK LIST */}

          {displayedTasks.length === 0 ? (

            <div className="py-16 text-center text-slate-400">

              <p className="text-lg">
                No tasks found.
              </p>

              {view === "my" && (
                <p className="text-sm mt-2">
                  No tasks are currently assigned to you.
                </p>
              )}

            </div>

          ) : (

            <div className="space-y-4">

              {displayedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  userName={getUserName(task.assignedTo)}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  onEdit={setEditingTask}
                />
              ))}

            </div>

          )}

        </section>

      </div>

      {/* CREATE TASK MODAL */}

      {showTaskForm && (
        <TaskForm
          users={users}
          tasks={tasks}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={async () => {
            setShowTaskForm(false);
            await loadData();
          }}
        />
      )}

      {/* EDIT TASK MODAL */}

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          users={users}
          tasks={tasks}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={async () => {
            setEditingTask(null);
            await loadData();
          }}
        />
      )}

    </main>
  );
}


/* ==================================================
   STAT CARD
================================================== */

function StatCard({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}


/* ==================================================
   TASK CARD
================================================== */

function TaskCard({
  task,
  userName,
  onComplete,
  onDelete,
  onEdit,
}) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-lg font-semibold">
              {task.title}
            </h3>

            <PriorityBadge
              priority={task.priority}
            />

            <StatusBadge
              status={task.status}
            />

            {task.blocked && (
              <span className="px-3 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                Blocked
              </span>
            )}

          </div>

          <p className="text-sm text-slate-400 mt-2">
            {task.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">

            <span>
              Assigned to:

              <span className="text-slate-300 ml-1">
                {userName}
              </span>
            </span>

            {task.dependency && (
              <span>
                Depends on Task #{task.dependency}
              </span>
            )}

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => onEdit(task)}
            className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-sm"
          >
            Edit
          </button>

          {task.status !== "Done" && (
            <button
              type="button"
              onClick={() => onComplete(task.id)}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-sm"
            >
              Complete
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}


/* ==================================================
   PRIORITY BADGE
================================================== */

function PriorityBadge({ priority }) {
  let className =
    "px-3 py-1 rounded-full text-xs border ";

  if (priority === "High") {
    className +=
      "bg-red-500/10 text-red-400 border-red-500/20";
  } else if (priority === "Medium") {
    className +=
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  } else {
    className +=
      "bg-green-500/10 text-green-400 border-green-500/20";
  }

  return (
    <span className={className}>
      {priority}
    </span>
  );
}


/* ==================================================
   STATUS BADGE
================================================== */

function StatusBadge({ status }) {
  let className =
    "px-3 py-1 rounded-full text-xs border ";

  if (status === "Done") {
    className +=
      "bg-green-500/10 text-green-400 border-green-500/20";
  } else if (status === "In Progress") {
    className +=
      "bg-blue-500/10 text-blue-400 border-blue-500/20";
  } else {
    className +=
      "bg-slate-500/10 text-slate-300 border-slate-500/20";
  }

  return (
    <span className={className}>
      {status}
    </span>
  );
}