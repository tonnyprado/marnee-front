import { useEffect, useState } from 'react';
import { RefreshCw, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { getOpenAIUsage } from '../../services/promptsApi';

export default function OpenAICreditsCard() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsage = async () => {
    try {
      setRefreshing(true);
      const response = await getOpenAIUsage();
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
          <h3 className="text-lg font-semibold text-gray-900">OpenAI Credits</h3>
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
          <h3 className="text-lg font-semibold">OpenAI Credits</h3>
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

  const percentUsed = usage?.percent_used || 0;
  const isWarning = percentUsed > 70;
  const isDanger = percentUsed > 90;

  const getBarColor = () => {
    if (isDanger) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-green-500';
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
          <DollarSign className="text-mn-purple" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">OpenAI Credits</h3>
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

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{percentUsed.toFixed(1)}% used</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(usage?.used_this_month)} / {formatCurrency(usage?.monthly_limit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(usage?.remaining)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Projected usage:</span>
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-gray-500" />
            <span className="font-medium text-gray-900">
              {formatCurrency(usage?.projected_usage)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {formatDate(usage?.last_updated)}</span>
          {usage?.is_cached && (
            <span className="text-gray-400">(cached)</span>
          )}
        </div>
        {usage?.estimated && (
          <div className="mt-2 text-xs text-yellow-600 flex items-start gap-1">
            <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
            <span>{usage?.note || 'Estimated data'}</span>
          </div>
        )}
      </div>

      {/* Warning messages */}
      {isDanger && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ⚠️ Usage is above 90%. Consider increasing your limit or optimizing usage.
        </div>
      )}
      {isWarning && !isDanger && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
          Usage is above 70%. Monitor carefully to avoid hitting the limit.
        </div>
      )}
    </div>
  );
}
