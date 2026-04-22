import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Logo from "../Component/Logo";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[rgba(30,30,30,0.1)] rounded p-8 shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <Logo dark={true} size="large" />
          </div>

          <div className="mb-4">
            <svg
              className="w-16 h-16 text-green-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-4">
            If an account exists for {email}, we've sent a password reset link.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The link will expire in 1 hour.
          </p>

          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-[#40086d] text-white font-medium py-3 rounded transition hover:bg-[#5a0a9d]"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[rgba(30,30,30,0.1)] rounded p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hover:opacity-80 transition"
          >
            <Logo dark={true} size="large" />
          </div>
          <div className="h-px w-16 bg-[rgba(64,8,109,0.2)] mt-4" />
        </div>

        <h2 className="text-2xl text-gray-900 text-center mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1e1e] hover:bg-[#dccaf4] hover:text-[#1a0530] text-white font-medium py-3 rounded transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/auth")}
              className="text-sm text-[#40086d] hover:text-[#1a0530] font-medium"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
