/**
 * DataGuard Component
 * Wrapper que detecta si hay datos disponibles y muestra el estado apropiado:
 * - Loading: Skeleton/spinner
 * - No data: ConnectState
 * - Has data: Renderiza children
 */
import { ConnectState } from './';

export default function DataGuard({
  isLoading,
  hasData,
  error,
  connectState,
  loadingComponent,
  children
}) {
  // 1. Loading state
  if (isLoading) {
    if (loadingComponent) {
      return loadingComponent;
    }

    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="
            w-12 h-12 border-4 border-[#ede0f8]
            border-t-[#40086d] rounded-full animate-spin
          " />
          <p className="text-[13px] text-[rgba(30,30,30,0.55)]">
            Loading data...
          </p>
        </div>
      </div>
    );
  }

  // 2. Error state (optional)
  if (error) {
    return (
      <div className="
        bg-[#fff5f5] border border-[#feb2b2]
        rounded-[10px] p-6 text-center
      ">
        <p className="text-[13px] text-[#c53030]">
          {error.message || 'Failed to load data'}
        </p>
      </div>
    );
  }

  // 3. No data - show connect state
  if (!hasData) {
    if (connectState) {
      return <ConnectState {...connectState} />;
    }

    return (
      <ConnectState
        title="No data available"
        description="Connect your account to see data here"
        buttonText="Connect Account"
      />
    );
  }

  // 4. Has data - render children
  return <>{children}</>;
}
