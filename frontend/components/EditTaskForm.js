"use client";

import { useState } from "react";
import { updateTask } from "@/lib/api";

export default function EditTaskForm({
  task,
  users,
  tasks,
  onClose,
  onTaskUpdated,
}) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [priority, setPriority] = useState(
    task.priority || "Medium"
  );
  const [status, setStatus] = useState(
    task.status || "To Do"
  );
  const [assignedTo, setAssignedTo] = useState(
    task.assignedTo ? String(task.assignedTo) : ""
  );
  const [dependency, setDependency] = useState(
    task.dependency ? String(task.dependency) : ""
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }

    if (
      dependency &&
      Number(dependency) === Number(task.id)
    ) {
      setError("A task cannot depend on itself.");
      return;
    }

    try {
      setSaving(true);

      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assignedTo: assignedTo
          ? Number(assignedTo)
          : null,
        dependency: dependency
          ? Number(dependency)
          : null,
      });

      await onTaskUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-bold">
              Edit Task
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Update task details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>

        </div>

        {/* Error */}
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
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
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
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="To Do">
                  To Do
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Done">
                  Done
                </option>
              </select>
            </div>

          </div>

          {/* User + Dependency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Assign User
              </label>

              <select
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(e.target.value)
                }
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
                value={dependency}
                onChange={(e) =>
                  setDependency(e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 outline-none"
              >
                <option value="">
                  No Dependency
                </option>

                {tasks
                  .filter(
                    (item) =>
                      item.id !== task.id
                  )
                  .map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      #{item.id} - {item.title}
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
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}