// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { MarneeProvider } from "./context/MarneeContext";
import { getAuthSession } from "./services/api";

import LandingPage from "./Pages/LandingPage";
import PresentationPage from "./Pages/PresentationPage";
import AuthPage from "./Pages/AuthPage";
import BrandingTestIntro from "./Pages/BrandingTestIntro";
import BrandTestPage from "./Pages/BrandTestPage";

import AppLayout from "./Layout/Layout";
import IAWebPage from "./Pages/Tools/IAWebPage";
import CalendarPage from "./Pages/Tools/CalendarPage";
import MyDashboard from "./Pages/Tools/MyDashboard";

function RequireAuth({ children }) {
  const session = getAuthSession();
  if (!session || !session.token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  const [globalError, setGlobalError] = React.useState("");

  React.useEffect(() => {
    let timer;
    const handler = (event) => {
      const message = event?.detail?.message || "Ocurrió un error.";
      setGlobalError(message);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setGlobalError(""), 4000);
    };
    window.addEventListener("app-error", handler);
    return () => {
      window.removeEventListener("app-error", handler);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <MarneeProvider>
    <Routes>
      {/* públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/presentation" element={<PresentationPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/brand-test/intro" element={<BrandingTestIntro />} />
      <Route path="/brand-test/questions" element={<BrandTestPage />} />

      {/* privadas / con navbar */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        {/* /app → chat */}
        <Route index element={<IAWebPage />} />
        {/* /app/calendar */}
        <Route path="calendar" element={<CalendarPage />} />
        {/* /app/dashboard */}
        <Route path="dashboard" element={<MyDashboard />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    {globalError && (
      <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-red-500" />
          <div className="flex-1">{globalError}</div>
          <button
            onClick={() => setGlobalError("")}
            className="text-red-500 hover:text-red-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>
    )}
    </MarneeProvider>
  );
}

export default App;
