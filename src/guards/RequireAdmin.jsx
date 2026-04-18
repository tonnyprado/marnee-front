import { Navigate } from "react-router-dom";
import { getAuthSession } from "../services/api";

export default function RequireAdmin({ children }) {
  const session = getAuthSession();

  if (!session || !session.token) {
    // No authenticated - redirect to login
    return <Navigate to="/auth" replace />;
  }

  // Parse JWT payload to check role
  try {
    const payload = JSON.parse(atob(session.token.split('.')[1]));
    const role = payload.role || '';

    // Check if user has ADMIN role
    if (role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
      // Not an admin - redirect to app
      console.warn('[RequireAdmin] Access denied. User role:', role);
      return <Navigate to="/app" replace />;
    }

    // User is admin - allow access
    return children;
  } catch (error) {
    console.error('[RequireAdmin] Error parsing JWT:', error);
    return <Navigate to="/auth" replace />;
  }
}
