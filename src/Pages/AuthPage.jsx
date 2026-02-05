import React, { useState } from "react";
import Logo from "../Component/Logo";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "/app";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-40" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo dark={true} size="large" />
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-purple-300 to-transparent mt-4" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          {mode === "signin"
            ? "Enter your credentials to continue"
            : "It takes less than a minute"}
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Extra field only on Sign up */}
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand / Company name (optional)
              </label>
              <input
                type="text"
                placeholder="Marnee Studio, DNHub, etc."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          )}

          {/* Remember + Forgot */}
          {mode === "signin" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="accent-purple-500 rounded" />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-purple-500/25"
          >
            {mode === "signin" ? "Log in" : "Create account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "signin" ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() =>
              setMode((prev) => (prev === "signin" ? "signup" : "signin"))
            }
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
