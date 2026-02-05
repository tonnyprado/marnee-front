// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { MarneeProvider } from "./context/MarneeContext";

import LandingPage from "./Pages/LandingPage";
import PresentationPage from "./Pages/PresentationPage";
import AuthPage from "./Pages/AuthPage";
import BrandingTestIntro from "./Pages/BrandingTestIntro";
import BrandTestPage from "./Pages/BrandTestPage";

import AppLayout from "./Layout/Layout";
import IAWebPage from "./Pages/Tools/IAWebPage";
import CalendarPage from "./Pages/Tools/CalendarPage";
import MyDashboard from "./Pages/Tools/MyDashboard";

function App() {
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
      <Route path="/app" element={<AppLayout />}>
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
    </MarneeProvider>
  );
}

export default App;
