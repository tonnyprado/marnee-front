// src/App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { MarneeProvider, useMarnee } from "./context/MarneeContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ChatThemeProvider } from "./context/ChatThemeContext";
import { getAuthSession } from "./services/api";
import BrainstormingNotification from "./Component/BrainstormingNotification";
import ScriptSavedNotification from "./Component/ScriptSavedNotification";

// Critical pages - loaded immediately
import PresentationPage from "./Pages/PresentationPage";
import AuthPage from "./Pages/AuthPage";
import OAuth2CallbackPage from "./Pages/OAuth2CallbackPage";
import AppLayout from "./Layout/Layout";
import RequireAdmin from "./guards/RequireAdmin";

// Lazy loaded pages - loaded on demand for smaller initial bundle
const CreatorsLandingPage = lazy(() => import("./Pages/CreatorsLandingPage"));
const VerifyEmailPage = lazy(() => import("./Pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./Pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./Pages/ResetPasswordPage"));
const BrandTestPage = lazy(() => import("./Pages/BrandTestPage"));
const TestSelectionPage = lazy(() => import("./Pages/TestSelectionPage"));
const BusinessTestPage = lazy(() => import("./Pages/BusinessTestPage"));
const SocialConnectionsWizard = lazy(() => import("./Component/InteractiveTest/SocialConnectionsWizard"));
const TermsOfServicePage = lazy(() => import("./Pages/Legal/TermsOfServicePage"));
const PrivacyPolicyPage = lazy(() => import("./Pages/Legal/PrivacyPolicyPage"));

// Lazy loaded tool pages
const IAWebPage = lazy(() => import("./Pages/Tools/IAWebPage")); // Old chat - kept as backup
const CalendarPage = lazy(() => import("./Pages/Tools/CalendarPage"));
const ChatPage = lazy(() => import("./Pages/Tools/ChatPage")); // Main chat with multiple conversations
const BrainstormingPage = lazy(() => import("./Pages/Tools/BrainstormingPage"));
const ScriptsPage = lazy(() => import("./Pages/Tools/ScriptsPage"));
const BillingPage = lazy(() => import("./Pages/Tools/BillingPage"));
const ProfileSettingsPage = lazy(() => import("./Pages/Tools/ProfileSettingsPage"));
const HelpSupportPage = lazy(() => import("./Pages/Tools/HelpSupportPage"));
const MyDashboard = lazy(() => import("./Pages/Tools/MyDashboard"));

// Admin pages - all lazy loaded since admin is rarely accessed
const AdminLayout = lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const UserManagement = lazy(() => import("./admin/pages/UserManagement"));
const SubscriptionPlans = lazy(() => import("./admin/pages/SubscriptionPlans"));
const SeoManagement = lazy(() => import("./admin/pages/SeoManagement"));
const AnalyticsDashboard = lazy(() => import("./admin/pages/AnalyticsDashboard"));
const SecurityDashboard = lazy(() => import("./admin/pages/SecurityDashboard"));
const AuditLogsPage = lazy(() => import("./admin/pages/AuditLogsPage"));
const ActiveSessionsPage = lazy(() => import("./admin/pages/ActiveSessionsPage"));
const SecurityAlertsPage = lazy(() => import("./admin/pages/SecurityAlertsPage"));
const PromptManagement = lazy(() => import("./admin/pages/PromptManagement"));
const RAGManagement = lazy(() => import("./admin/pages/RAGManagement"));
const IntegrationsPage = lazy(() => import("./admin/pages/IntegrationsPage"));
const LegalDocumentsPage = lazy(() => import("./admin/pages/LegalDocumentsPage"));
const WaitlistManagement = lazy(() => import("./admin/pages/WaitlistManagement"));
const PasswordGeneratorPage = lazy(() => import("./admin/pages/PasswordGeneratorPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen items-center justify-center bg-[#f6f6f6]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-[#40086d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

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

// Component to handle brainstorming notifications (needs to be inside MarneeProvider)
function BrainstormingNotificationHandler() {
  const navigate = useNavigate();
  const {
    brainstormingNotification,
    hideBrainstormingNotification,
  } = useMarnee();

  const handleViewIdeas = () => {
    hideBrainstormingNotification();
    navigate('/app/brainstorming');
  };

  return (
    <BrainstormingNotification
      show={brainstormingNotification.show}
      count={brainstormingNotification.count}
      onClose={hideBrainstormingNotification}
      onViewIdeas={handleViewIdeas}
    />
  );
}

// Component to handle script saved notifications (needs to be inside MarneeProvider)
function ScriptNotificationHandler() {
  const navigate = useNavigate();
  const {
    scriptNotification,
    hideScriptNotification,
  } = useMarnee();

  const handleViewScripts = () => {
    hideScriptNotification();
    navigate('/app/scripts');
  };

  return (
    <ScriptSavedNotification
      show={scriptNotification.show}
      scriptTitle={scriptNotification.title}
      onClose={hideScriptNotification}
      onViewScripts={handleViewScripts}
    />
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
    <ChatThemeProvider>
      <AuthProvider>
        <MarneeProvider>
          <Suspense fallback={<PageLoader />}>
          <Routes>
        {/* públicas */}
        <Route path="/" element={<PresentationPage />} />
        <Route path="/creators" element={<CreatorsLandingPage />} />
        <Route path="/presentation" element={<Navigate to="/" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<OAuth2CallbackPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/test-selection" element={<TestSelectionPage />} />
        <Route path="/business-test/questions" element={<BusinessTestPage />} />
        <Route path="/brand-test/questions" element={<BrandTestPage />} />
        <Route
          path="/connect-accounts"
          element={
            <RequireAuth>
              <SocialConnectionsWizard />
            </RequireAuth>
          }
        />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />

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
          {/* /app → Main Chat with Multiple Conversations */}
          <Route index element={<ChatPage />} />
          {/* /app/calendar */}
          <Route path="calendar" element={<CalendarPage />} />
          {/* /app/brainstorming */}
          <Route path="brainstorming" element={<BrainstormingPage />} />
          {/* /app/scripts */}
          <Route path="scripts" element={<ScriptsPage />} />
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
          <Route path="waitlist" element={<WaitlistManagement />} />
          <Route path="marnee-training" element={<PromptManagement />} />
          <Route path="rag" element={<RAGManagement />} />
          <Route path="seo" element={<SeoManagement />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="legal" element={<LegalDocumentsPage />} />
          <Route path="security" element={<SecurityDashboard />} />
          <Route path="security/audit-logs" element={<AuditLogsPage />} />
          <Route path="security/sessions" element={<ActiveSessionsPage />} />
          <Route path="security/alerts" element={<SecurityAlertsPage />} />
          <Route path="security/password-generator" element={<PasswordGeneratorPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
          {/* Brainstorming notification (global) */}
          <BrainstormingNotificationHandler />
          {/* Script saved notification (global) */}
          <ScriptNotificationHandler />

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
      </AuthProvider>
    </ChatThemeProvider>
  );
}

export default App;
