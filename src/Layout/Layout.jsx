// src/Layout/AppLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Component/Navbar";

export default function AppLayout() {
  const location = useLocation();

  // detectar cuál está activa según la ruta
  let active = "ai-content";
  if (location.pathname.startsWith("/app/calendar")) active = "calendar";
  else if (location.pathname.startsWith("/app/dashboard")) active = "dashboard";
  else if (location.pathname.startsWith("/brand-test")) active = "branding-test";

  return (
    <div className="flex min-h-screen">
      <Navbar active={active} />
      <div className="flex-1 bg-black min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
