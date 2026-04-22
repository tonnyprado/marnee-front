import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import Logo from "../Component/Logo";
import LoadingTransition from "../Component/LoadingTransition";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setError("Invalid verification link");
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      await api.verifyEmail(token);
      setStatus("success");
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Verification failed");
    }
  };

  if (status === "verifying") {
    return <LoadingTransition isLoading={true} message="Verifying your email..." />;
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[rgba(30,30,30,0.1)] rounded p-8 shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <Logo dark={true} size="large" />
        </div>

        {status === "success" ? (
          <>
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
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </>
        ) : (
          <>
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
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/auth")}
              className="px-6 py-2.5 bg-[#40086d] text-white rounded-lg hover:bg-[#5a0a9d] transition-colors font-medium"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
