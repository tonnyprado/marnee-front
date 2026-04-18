// src/Layout/AppLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../Component/Navbar";
// import TestChatLink from "../Component/TestChatLink"; // No longer needed - TestChat is now main chat

export default function AppLayout() {
  const location = useLocation();

  // detectar cuál está activa según la ruta
  let active = "ai-content";
  if (location.pathname.startsWith("/app/calendar")) active = "calendar";
  else if (location.pathname.startsWith("/app/dashboard")) active = "dashboard";
  else if (location.pathname.startsWith("/brand-test")) active = "branding-test";

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar active={active} />
      <div className="flex-1 bg-gray-50 overflow-y-auto max-lg:pt-16">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>
    </div>
  );
}
