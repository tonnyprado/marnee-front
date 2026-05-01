import { useEffect, useState } from 'react';
import { RefreshCw, Database, Activity, AlertCircle, Zap } from 'lucide-react';
import { getDataForSEOUsage } from '../../services/promptsApi';

export default function DataForSEOCreditsCard() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsage = async () => {
    try {
      setRefreshing(true);
      const response = await getDataForSEOUsage();
      setUsage(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">DataForSEO Balance</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertCircle size={20} />
          <h3 className="text-lg font-semibold">DataForSEO Balance</h3>
        </div>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchUsage}
          className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const balance = usage?.balance || 0;
  const costPerRequest = usage?.pricing_per_request || 0.05;
  const requestsRemaining = Math.floor(balance / costPerRequest);
  const enabled = usage?.enabled !== false;

  // Warning thresholds
  const isWarning = balance < 10 && balance >= 5;
  const isDanger = balance < 5;

  const getBalanceColor = () => {
    if (isDanger) return 'text-red-600';
    if (isWarning) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">DataForSEO Balance</h3>
        </div>
        <button
          onClick={fetchUsage}
          disabled={refreshing}
          className={`p-2 rounded-lg hover:bg-gray-100 transition ${
            refreshing ? 'animate-spin' : ''
          }`}
          title="Refresh"
        >
          <RefreshCw size={18} className="text-gray-600" />
        </button>
      </div>

      {!enabled && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          ℹ️ DataForSEO is not enabled. Configure credentials to activate.
        </div>
      )}

      {/* Balance Display */}
      <div className="mb-4">
        <div className="text-center mb-3">
          <p className="text-sm text-gray-600 mb-1">Current Balance</p>
          <p className={`text-4xl font-bold ${getBalanceColor()}`}>
            {formatCurrency(balance)}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Zap size={14} />
              <span>Requests Left</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              ~{requestsRemaining.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Activity size={14} />
              <span>Cost/Request</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(costPerRequest)}
            </p>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      {usage?.limits && (usage.limits.per_minute || usage.limits.per_day) && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Rate Limits</p>
          <div className="space-y-1 text-xs text-blue-700">
            {usage.limits.per_minute > 0 && (
              <div className="flex justify-between">
                <span>Per minute:</span>
                <span className="font-medium">{usage.limits.per_minute}</span>
              </div>
            )}
            {usage.limits.per_day > 0 && (
              <div className="flex justify-between">
                <span>Per day:</span>
                <span className="font-medium">{usage.limits.per_day}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Usage This Month */}
      {usage?.usage_this_month > 0 && (
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Usage this month:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(usage.usage_this_month)}
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {formatDate(usage?.last_updated)}</span>
          {usage?.is_cached && (
            <span className="text-gray-400">(cached)</span>
          )}
        </div>
        {usage?.note && (
          <div className="mt-2 text-xs text-gray-600 flex items-start gap-1">
            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
            <span>{usage.note}</span>
          </div>
        )}
      </div>

      {/* Warning messages */}
      {isDanger && enabled && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ⚠️ Balance is below $5. Add credits to avoid service interruption.
        </div>
      )}
      {isWarning && !isDanger && enabled && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          Balance is below $10. Consider adding more credits soon.
        </div>
      )}
    </div>
  );
}
