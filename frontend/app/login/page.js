"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  loginUser,
  createUser,
} from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("123456");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser({
        email: email.trim(),
        password,
      });

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError(
        "Name, email and password are required."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await createUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(
        "Account created successfully. You can now login."
      );

      setMode("login");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(
      mode === "login"
        ? "register"
        : "login"
    );

    setError("");
    setSuccess("");

    if (mode === "login") {
      setName("");
      setEmail("");
      setPassword("");
    } else {
      setEmail("admin@example.com");
      setPassword("123456");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      {/* Background decoration */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-150px] left-[-150px] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="absolute bottom-[-150px] right-[-150px] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      </div>

      <div className="relative w-full max-w-md">

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* HEADER */}

          <div className="text-center mb-8">

            <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">

              <span className="text-2xl font-bold">
                T
              </span>

            </div>

            <h1 className="text-3xl font-bold text-white">
              Smart Task Manager
            </h1>

            <p className="text-slate-400 mt-2">
              {mode === "login"
                ? "Login to manage your tasks"
                : "Create your account"}
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* LOGIN */}

          {mode === "login" && (
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>
          )}

          {/* REGISTER */}

          {mode === "register" && (
            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a password"
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />

                <p className="text-xs text-slate-500 mt-2">
                  Password must be at least 6 characters.
                </p>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>
          )}

          {/* SWITCH MODE */}

          <div className="mt-6 text-center">

            {mode === "login" ? (
              <p className="text-sm text-slate-500">

                Don't have an account?{" "}

                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create Account
                </button>

              </p>
            ) : (
              <p className="text-sm text-slate-500">

                Already have an account?{" "}

                <button
                  type="button"
                  onClick={switchMode}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Login
                </button>

              </p>
            )}

          </div>

          {/* DEMO CREDENTIALS */}

          {mode === "login" && (
            <div className="mt-6 p-4 rounded-lg bg-slate-950 border border-slate-800">

              <p className="text-sm font-medium text-slate-300 mb-2">
                Demo Admin Account
              </p>

              <p className="text-sm text-slate-500">
                Email:
                <span className="text-slate-300 ml-1">
                  admin@example.com
                </span>
              </p>

              <p className="text-sm text-slate-500">
                Password:
                <span className="text-slate-300 ml-1">
                  123456
                </span>
              </p>

            </div>
          )}

        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Smart Task Manager • Task Management System
        </p>

      </div>

    </main>
  );
}