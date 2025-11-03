import React, { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  const handleSubmit = (e) => {
    e.preventDefault();
    // simulamos login/signup exitoso
    window.location.href = "/app"; // cámbialo por la ruta que quieras
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center px-4">
      {/* Glow top-right */}
      <div className="pointer-events-none absolute -top-16 right-0 h-56 w-56 bg-[radial-gradient(circle_at_center,_#f973ff,_#3b82f6,_transparent_70%)] opacity-70 blur-2xl" />
      {/* Glow bottom-left */}
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 bg-[radial-gradient(circle_at_center,_#3b82f6,_#f973ff,_transparent_70%)] opacity-70 blur-2xl" />

      {/* Grid background (optional) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-black/70 border border-white/5 rounded-3xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl font-extrabold font-serif text-white tracking-tight">
            DnHub
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-3" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white text-center">
          {mode === "signin" ? "Sign in" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          {mode === "signin"
            ? "Enter your credentials to continue"
            : "It takes less than a minute ✨"}
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Extra field only on Sign up */}
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Brand / Company name (optional)
              </label>
              <input
                type="text"
                placeholder="Marnee Studio, DNHub, etc."
                className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Remember + Forgot (solo en login) */}
          {mode === "signin" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" className="accent-purple-500" />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm text-purple-300 hover:text-purple-200"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-400 text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
          >
            {mode === "signin" ? "Log in" : "Create account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full border border-white/10 rounded-lg py-2.5 flex items-center justify-center gap-3 text-white hover:bg-white/5 transition"
          >
            <span className="text-lg">G</span>
            Continue with Google
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm text-gray-400 mt-6">
          {mode === "signin" ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() =>
              setMode((prev) => (prev === "signin" ? "signup" : "signin"))
            }
            className="text-purple-300 hover:text-purple-200 font-medium"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
