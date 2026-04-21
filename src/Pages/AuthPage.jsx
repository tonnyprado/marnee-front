import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Component/Logo";
import { api, getAuthSession, setAuthSession } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function AuthPage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const session = getAuthSession();
    if (session?.token) {
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const validate = () => {
    if (mode === "signup" && !form.name.trim()) {
      return t("auth.errors.emptyName");
    }
    if (!form.email.trim() || !isValidEmail(form.email)) {
      return t("auth.errors.invalidEmail");
    }
    if (mode === "signup" && form.password.trim().length < 6) {
      return t("auth.errors.passwordMin");
    }
    if (mode === "signin" && !form.password.trim()) {
      return t("auth.errors.passwordEmpty");
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const payload =
        mode === "signup"
          ? {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
            }
          : { email: form.email.trim(), password: form.password };

      const response =
        mode === "signup"
          ? await api.register(payload)
          : await api.login(payload);

      setAuthSession({
        token: response.token,
        type: response.type,
        userId: response.userId,
        email: response.email,
        name: response.name,
      });

      navigate("/app");
    } catch (err) {
      setError(err.message || t("auth.errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to backend OAuth endpoint
    api.googleSignIn();
  };

  const handleAppleSignIn = () => {
    // Redirect to backend OAuth endpoint
    api.appleSignIn();
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] relative flex items-center justify-center px-4">
      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-[rgba(30,30,30,0.1)] rounded p-8 shadow-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer hover:opacity-80 transition"
          >
            <Logo dark={true} size="large" />
          </div>
          <div className="h-px w-16 bg-[rgba(64,8,109,0.2)] mt-4" />
        </div>

        {/* Title */}
        <h2 className="text-2xl text-gray-900 text-center">
          {mode === "signin" ? t("auth.welcomeBack") : t("auth.createAccount")}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          {mode === "signin"
            ? t("auth.signinSubtitle")
            : t("auth.signupSubtitle")}
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Name (Sign up) */}
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("auth.name")}
              </label>
              <input
                type="text"
                required
                placeholder={t("auth.namePlaceholder")}
                value={form.name}
                onChange={handleChange("name")}
                className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("auth.email")}
            </label>
            <input
              type="email"
              required
              placeholder={t("auth.emailPlaceholder")}
              value={form.email}
              onChange={handleChange("email")}
              className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("auth.password")}
            </label>
            <input
              type="password"
              required
              placeholder={t("auth.passwordPlaceholder")}
              value={form.password}
              onChange={handleChange("password")}
              className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent transition"
            />
          </div>

          {/* Remember + Forgot */}
          {mode === "signin" && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="accent-[#40086d] rounded" />
                {t("auth.rememberMe")}
              </label>
              <button
                type="button"
                className="text-sm text-[#40086d] hover:text-[#1a0530] font-medium"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e1e1e] hover:bg-[#dccaf4] hover:text-[#1a0530] text-white font-medium py-3 rounded transition"
          >
            {loading
              ? t("auth.processing")
              : mode === "signin"
              ? t("auth.logIn")
              : t("auth.createAccountCta")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(30,30,30,0.1)]" />
            <span className="text-xs text-gray-400">{t("auth.divider")}</span>
            <div className="flex-1 h-px bg-[rgba(30,30,30,0.1)]" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-[rgba(30,30,30,0.1)] rounded py-3 flex items-center justify-center gap-3 text-gray-700 hover:bg-[#f6f6f6] transition font-medium"
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
            {mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
          </button>

          {/* Apple Sign In */}
          <button
            type="button"
            onClick={handleAppleSignIn}
            className="w-full border border-[rgba(30,30,30,0.1)] rounded py-3 flex items-center justify-center gap-3 text-gray-700 hover:bg-[#f6f6f6] transition font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            {mode === "signin" ? "Sign in with Apple" : "Sign up with Apple"}
          </button>
        </form>

        {/* Switch mode */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === "signin" ? `${t("auth.noAccount")} ` : `${t("auth.alreadyRegistered")} `}
          <button
            onClick={() => {
              setMode((prev) => (prev === "signin" ? "signup" : "signin"));
              setError("");
            }}
            className="text-[#40086d] hover:text-[#40086d] font-medium"
          >
            {mode === "signin" ? t("auth.signUp") : t("auth.signIn")}
          </button>
        </p>
      </div>
    </div>
  );
}
