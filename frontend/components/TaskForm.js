"use client";

import { useState } from "react";
import { createTask } from "@/lib/api";

export default function TaskForm({
  users,
  tasks,
  onTaskCreated,
  onClose,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    assignedTo: "",
    dependency: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title || !form.description) {
      setError("Title and description are required.");
      return;
    }

    try {
      setSaving(true);

      await createTask({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        assignedTo: form.assignedTo
          ? Number(form.assignedTo)
          : null,
        dependency: form.dependency
          ? Number(form.dependency)
          : null,
      });

      onTaskCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              Create New Task
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Add a task and assign it to a team member.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Title */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Task Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          {/* Assigned User + Dependency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Assign User
              </label>

              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="">
                  Unassigned
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Dependency
              </label>

              <select
                name="dependency"
                value={form.dependency}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="">
                  No Dependency
                </option>

                {tasks.map((task) => (
                  <option
                    key={task.id}
                    value={task.id}
                  >
                    #{task.id} - {task.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}