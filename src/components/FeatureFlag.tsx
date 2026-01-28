'use client';

import { ReactNode, useEffect, useState } from 'react';
import type { FeatureFlag, FeatureFlagConfig } from '@/src/lib/feature-flags';

interface FeatureFlagProps {
  feature: FeatureFlag;
  children: ReactNode;
  fallback?: ReactNode;
  initialFlags?: Partial<FeatureFlagConfig>;
}

interface FeatureGateProps {
  features: FeatureFlag[];
  operator?: 'AND' | 'OR';
  children: ReactNode;
  fallback?: ReactNode;
  initialFlags?: Partial<FeatureFlagConfig>;
}

// Client-side feature flag wrapper
export function FeatureFlag({
  feature,
  children,
  fallback = null,
  initialFlags,
}: FeatureFlagProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Get initial value from props or fetch from API
    if (initialFlags && feature in initialFlags) {
      setIsEnabled(initialFlags[feature] ?? true);
    } else {
      // Fetch current feature flags from API
      fetch('/api/feature-flags')
        .then(res => res.json())
        .then(flags => setIsEnabled(flags[feature] ?? true))
        .catch(() => setIsEnabled(true)); // Default to enabled on error
    }
  }, [feature, initialFlags]);

  // Show loading state while determining flag status
  if (isEnabled === null) {
    return <div className="animate-pulse bg-white/5 rounded h-4" />;
  }

  return isEnabled ? <>{children}</> : <>{fallback}</>;
}

// Multiple feature flag gate
export function FeatureGate({
  features,
  operator = 'AND',
  children,
  fallback = null,
  initialFlags,
}: FeatureGateProps) {
  const [enabledFlags, setEnabledFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use initial flags if provided
    if (initialFlags) {
      const flags: Record<string, boolean> = {};
      features.forEach(feature => {
        flags[feature] = initialFlags[feature] ?? true;
      });
      setEnabledFlags(flags);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    fetch('/api/feature-flags')
      .then(res => res.json())
      .then(flags => {
        const filteredFlags: Record<string, boolean> = {};
        features.forEach(feature => {
          filteredFlags[feature] = flags[feature] ?? true;
        });
        setEnabledFlags(filteredFlags);
        setLoading(false);
      })
      .catch(() => {
        // Default to enabled on error
        const defaultFlags: Record<string, boolean> = {};
        features.forEach(feature => {
          defaultFlags[feature] = true;
        });
        setEnabledFlags(defaultFlags);
        setLoading(false);
      });
  }, [features, initialFlags]);

  if (loading) {
    return <div className="animate-pulse bg-white/5 rounded h-4" />;
  }

  const values = Object.values(enabledFlags);
  const shouldShow = operator === 'AND' 
    ? values.every(Boolean)
    : values.some(Boolean);

  return shouldShow ? <>{children}</> : <>{fallback}</>;
}

// Server-side feature flag checker (for use in server components)
export async function ServerFeatureFlag({
  feature,
  children,
  fallback = null,
}: {
  feature: FeatureFlag;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  try {
    // This would typically be called from the server component
    // and the flag value would be passed as a prop
    return <>{children}</>;
  } catch (error) {
    console.error('Error checking feature flag:', error);
    return <>{fallback}</>;
  }
}

// Hook for accessing feature flags in client components
export function useFeatureFlags(): {
  flags: FeatureFlagConfig | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [flags, setFlags] = useState<FeatureFlagConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/feature-flags');
      if (!response.ok) throw new Error('Failed to fetch feature flags');
      
      const data = await response.json();
      setFlags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  return {
    flags,
    loading,
    error,
    refetch: fetchFlags,
  };
}

// Hook for single feature flag
export function useFeatureFlag(feature: FeatureFlag): {
  isEnabled: boolean;
  loading: boolean;
  error: string | null;
} {
  const { flags, loading, error } = useFeatureFlags();
  
  return {
    isEnabled: flags?.[feature] ?? true, // Default to enabled
    loading,
    error,
  };
}