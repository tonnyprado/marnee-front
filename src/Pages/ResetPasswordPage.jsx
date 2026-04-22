import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import Logo from "../Component/Logo";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      setValidatingToken(false);
      return;
    }

    validateToken(token);
  }, [token]);

  const validateToken = async (token) => {
    try {
      await api.validateResetToken(token);
      setTokenValid(true);
    } catch (err) {
      setError(err.message || "Invalid or expired reset link");
      setTokenValid(false);
    } finally {
      setValidatingToken(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setError("Password must contain uppercase, lowercase, and numbers");
      return;
    }

    try {
      setLoading(true);
      await api.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[rgba(30,30,30,0.1)] rounded p-8 shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <Logo dark={true} size="large" />
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#40086d] mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-[rgba(30,30,30,0.1)] rounded p-8 shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <Logo dark={true} size="large" />
          </div>

          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>

          <button
            onClick={() => navigate("/auth/forgot-password")}
            className="w-full bg-[#40086d] text-white font-medium py-3 rounded transition hover:bg-[#5a0a9d] mb-3"
          >
            Request New Link
          </button>

          <button
            onClick={() => navigate("/auth")}
            className="w-full bg-gray-200 text-gray-700 font-medium py-3 rounded transition hover:bg-gray-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Reset Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
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
          Reset Your Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
            />
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded ${
                        level <= passwordStrength
                          ? passwordStrength <= 2
                            ? "bg-red-500"
                            : passwordStrength === 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  {passwordStrength <= 2 && "Weak password"}
                  {passwordStrength === 3 && "Medium strength"}
                  {passwordStrength >= 4 && "Strong password"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1e1e] hover:bg-[#dccaf4] hover:text-[#1a0530] text-white font-medium py-3 rounded transition disabled:opacity-50"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
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
