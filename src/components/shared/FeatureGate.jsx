/**
 * Feature Gate Component
 * Conditionally renders content based on role capabilities
 */
import React from 'react';
import { useUserRole } from '../../hooks/useUserRole';

export default function FeatureGate({ feature, children, fallback = null }) {
  const { hasFeature, isLoading } = useUserRole();

  if (isLoading) {
    return fallback;
  }

  if (!hasFeature(feature)) {
    return fallback;
  }

  return <>{children}</>;
}
