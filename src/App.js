// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { MarneeProvider } from "./context/MarneeContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { getAuthSession } from "./services/api";
import LanguageSwitcher from "./Component/LanguageSwitcher";

import LandingPage from "./Pages/LandingPage";
import PresentationPage from "./Pages/PresentationPage";
import AuthPage from "./Pages/AuthPage";
import BrandingTestIntro from "./Pages/BrandingTestIntro";
import BrandTestPage from "./Pages/BrandTestPage";
import TestSelectionPage from "./Pages/TestSelectionPage";
import BusinessTestPage from "./Pages/BusinessTestPage";

import AppLayout from "./Layout/Layout";
import IAWebPage from "./Pages/Tools/IAWebPage"; // Old chat - kept as backup
import CalendarPage from "./Pages/Tools/CalendarPage";
import TestChatPage from "./Pages/Tools/TestChatPage"; // New working chat
import BillingPage from "./Pages/Tools/BillingPage";
import ProfileSettingsPage from "./Pages/Tools/ProfileSettingsPage";
import HelpSupportPage from "./Pages/Tools/HelpSupportPage";
import MyDashboard from "./Pages/Tools/MyDashboard";

// Admin pages
import RequireAdmin from "./guards/RequireAdmin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UserManagement from "./admin/pages/UserManagement";
import SubscriptionPlans from "./admin/pages/SubscriptionPlans";
import SeoManagement from "./admin/pages/SeoManagement";
import AnalyticsDashboard from "./admin/pages/AnalyticsDashboard";

function RequireAuth({ children }) {
  const session = getAuthSession();
  if (!session || !session.token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const [globalError, setGlobalError] = React.useState("");
  const { t } = useLanguage();

  React.useEffect(() => {
    let timer;
    const handler = (event) => {
      const message = event?.detail?.message || t("app.defaultError");
      setGlobalError(message);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setGlobalError(""), 4000);
    };
    window.addEventListener("app-error", handler);
    return () => {
      window.removeEventListener("app-error", handler);
      if (timer) clearTimeout(timer);
    };
  }, [t]);

  return (
    <MarneeProvider>
      <LanguageSwitcher className="fixed right-4 top-4 z-[60]" />
      <Routes>
        {/* públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/presentation" element={<PresentationPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/brand-test/intro" element={<BrandingTestIntro />} />
        <Route path="/test-selection" element={<TestSelectionPage />} />
        <Route path="/business-test/questions" element={<BusinessTestPage />} />
        <Route path="/brand-test/questions" element={<BrandTestPage />} />

        {/* CHAT VIEJO - BACKUP (por si acaso) */}
        <Route
          path="/chat-viejo"
          element={
            <RequireAuth>
              <IAWebPage />
            </RequireAuth>
          }
        />

        {/* privadas / con navbar */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          {/* /app → NUEVO CHAT QUE SÍ FUNCIONA */}
          <Route index element={<TestChatPage />} />
          {/* /app/calendar */}
          <Route path="calendar" element={<CalendarPage />} />
          {/* /app/billing */}
          <Route path="billing" element={<BillingPage />} />
          {/* /app/profile-settings */}
          <Route path="profile-settings" element={<ProfileSettingsPage />} />
          {/* /app/help-support */}
          <Route path="help-support" element={<HelpSupportPage />} />
          {/* /app/dashboard */}
          <Route path="dashboard" element={<MyDashboard />} />
        </Route>

        {/* Admin panel - Only for ADMIN role */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="subscriptions" element={<SubscriptionPlans />} />
          <Route path="seo" element={<SeoManagement />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
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
              aria-label={t("common.close")}
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
