// src/Layout/AppLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "../Component/Navbar";
import BusinessTestRequiredModal from "../Component/BusinessTestRequiredModal";
import { api } from "../services/api";
// import TestChatLink from "../Component/TestChatLink"; // No longer needed - TestChat is now main chat

export default function AppLayout() {
  const location = useLocation();
  const [hasBusinessTest, setHasBusinessTest] = useState(null); // null = loading, true/false = result
  const [isCheckingTest, setIsCheckingTest] = useState(true);

  // Check if user has completed business test
  useEffect(() => {
    const checkBusinessTest = async () => {
      try {
        const businessTest = await api.getBusinessTestMe();
        // If we get data, business test exists
        if (businessTest) {
          setHasBusinessTest(true);
        } else {
          setHasBusinessTest(false);
        }
      } catch (error) {
        // 404 means no business test exists
        if (error.status === 404) {
          setHasBusinessTest(false);
        } else {
          console.error('[AppLayout] Error checking business test:', error);
          // On error, assume they need to complete it
          setHasBusinessTest(false);
        }
      } finally {
        setIsCheckingTest(false);
      }
    };

    checkBusinessTest();
  }, [location.pathname]); // Re-check when route changes (e.g., after completing test)

  // detectar cuál está activa según la ruta
  let active = "ai-content";
  if (location.pathname.startsWith("/app/calendar")) active = "calendar";
  else if (location.pathname.startsWith("/app/dashboard")) active = "dashboard";
  else if (location.pathname.startsWith("/brand-test")) active = "branding-test";

  // Show loading while checking
  if (isCheckingTest) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ede0f8] border-t-[#40086d] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden relative">
      <Navbar active={active} />
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>

      {/* Business Test Required Modal - blocks app if not completed */}
      <BusinessTestRequiredModal isOpen={hasBusinessTest === false} />
    </div>
  );
}
