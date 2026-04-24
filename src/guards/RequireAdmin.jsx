/**
 * RequireAdmin Guard - Refactored
 *
 * BEFORE: Unsafe JWT parsing with atob
 * AFTER: Uses secure auth utilities from core
 */

import { Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../core/utils/auth";

export default function RequireAdmin({ children }) {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has admin role
  if (!hasRole('ADMIN')) {
    console.warn('[RequireAdmin] Access denied. User is not an admin');
    return <Navigate to="/app" replace />;
  }

  // User is admin - allow access
  return children;
}
