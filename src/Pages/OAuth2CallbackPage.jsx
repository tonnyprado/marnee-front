import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthSession } from "../services/api";
import LoadingTransition from "../Component/LoadingTransition";

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      return;
    }

    if (token && userId && email) {
      // Save session
      setAuthSession({
        token,
        type: "Bearer",
        userId,
        email: decodeURIComponent(email),
        name: name ? decodeURIComponent(name) : email,
      });

      // Redirect to app
      navigate("/app", { replace: true });
    } else {
      setError("Invalid OAuth response. Missing required parameters.");
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    }
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
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
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <LoadingTransition isLoading={true} message="Completing authentication..." />
  );
}
