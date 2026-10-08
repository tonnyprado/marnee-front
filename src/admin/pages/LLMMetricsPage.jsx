import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Zap,
  Clock,
  AlertCircle,
  Database,
  Activity,
} from 'lucide-react';
import { API_BASE_URL } from '../../config';
import './LLMMetricsPage.css';

const LLMMetricsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30'); // days
  const [groupBy, setGroupBy] = useState('day');
  const [costSummary, setCostSummary] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchMetrics();
    fetchCostSummary();
    fetchErrors();
  }, [dateRange, groupBy]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/llm-metrics?` +
          `start_date=${startDate.toISOString()}&` +
          `group_by=${groupBy}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch metrics');

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCostSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/llm-metrics/cost-summary?` +
          `start_date=${startDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCostSummary(data);
      }
    } catch (err) {
      console.error('Failed to fetch cost summary:', err);
    }
  };

  const fetchErrors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/api/v1/admin/llm-metrics/errors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setErrors(data);
      }
    } catch (err) {
      console.error('Failed to fetch errors:', err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (loading && !metrics) {
    return (
      <div className="llm-metrics-page">
        <div className="loading">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="llm-metrics-page">
        <div className="error">
          <AlertCircle size={48} />
          <p>Error: {error}</p>
          <button onClick={fetchMetrics}>Retry</button>
        </div>
      </div>
    );
  }

  const calculateRAGSavingsPercentage = () => {
    if (!metrics || !metrics.summary || metrics.summary.length === 0) return 0;

    const totalTokens = metrics.summary.reduce(
      (sum, s) => sum + s.total_tokens,
      0
    );
    const totalSaved = metrics.summary.reduce(
      (sum, s) => sum + s.total_rag_tokens_saved,
      0
    );

    if (totalTokens === 0) return 0;
    return ((totalSaved / (totalTokens + totalSaved)) * 100).toFixed(1);
  };

  return (
    <div className="llm-metrics-page">
      <div className="page-header">
        <h1>
          <Activity size={32} />
          LLM Metrics Dashboard
        </h1>
        <p>Real-time monitoring of OpenAI API usage, costs, and performance</p>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <label>Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        <div className="control-group">
          <label>Group By</label>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="day">Day</option>
            <option value="feature">Feature</option>
            <option value="model">Model</option>
          </select>
        </div>

        <button className="refresh-btn" onClick={fetchMetrics}>
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon cost">
            <DollarSign size={24} />
          </div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(metrics?.total_cost_usd || 0)}</div>
            <div className="card-label">Total Cost</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon calls">
            <BarChart3 size={24} />
          </div>
          <div className="card-content">
            <div className="card-value">
              {formatNumber(
                metrics?.summary.reduce((sum, s) => sum + s.total_calls, 0) || 0
              )}
            </div>
            <div className="card-label">Total Calls</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon tokens">
            <Zap size={24} />
          </div>
          <div className="card-content">
            <div className="card-value">
              {formatNumber(
                metrics?.summary.reduce((sum, s) => sum + s.total_tokens, 0) || 0
              )}
            </div>
            <div className="card-label">Total Tokens</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon users">
            <Activity size={24} />
          </div>
          <div className="card-content">
            <div className="card-value">{metrics?.active_users_count || 0}</div>
            <div className="card-label">Active Users</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon per-user">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <div className="card-value">
              {formatCurrency(metrics?.cost_per_active_user || 0)}
            </div>
            <div className="card-label">Cost per User</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon rag">
            <Database size={24} />
          </div>
          <div className="card-content">
            <div className="card-value">{calculateRAGSavingsPercentage()}%</div>
            <div className="card-label">RAG Savings</div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      {costSummary && (
        <div className="metrics-section">
          <h2>Cost Breakdown</h2>
          <div className="breakdown-grid">
            <div className="breakdown-card">
              <h3>By Model</h3>
              <table>
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Calls</th>
                    <th>Cost</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {costSummary.by_model.map((m) => (
                    <tr key={m.model}>
                      <td>
                        <code>{m.model}</code>
                      </td>
                      <td>{formatNumber(m.calls)}</td>
                      <td>{formatCurrency(m.cost_usd)}</td>
                      <td>{m.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="breakdown-card">
              <h3>By Feature</h3>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Calls</th>
                    <th>Cost</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {costSummary.by_feature.map((f) => (
                    <tr key={f.feature}>
                      <td>
                        <code>{f.feature}</code>
                      </td>
                      <td>{formatNumber(f.calls)}</td>
                      <td>{formatCurrency(f.cost_usd)}</td>
                      <td>{f.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Metrics Table */}
      <div className="metrics-section">
        <h2>Detailed Metrics</h2>
        <div className="metrics-table-container">
          <table className="metrics-table">
            <thead>
              <tr>
                <th>{groupBy === 'day' ? 'Date' : groupBy === 'feature' ? 'Feature' : 'Model'}</th>
                <th>Calls</th>
                <th>Tokens</th>
                <th>Cost</th>
                <th>
                  <Clock size={14} /> p50
                </th>
                <th>
                  <Clock size={14} /> p95
                </th>
                <th>RAG Chunks</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.summary.map((row) => (
                <tr key={row.group_key}>
                  <td>
                    <strong>{row.group_key}</strong>
                  </td>
                  <td>{formatNumber(row.total_calls)}</td>
                  <td>{formatNumber(row.total_tokens)}</td>
                  <td>{formatCurrency(row.total_cost_usd)}</td>
                  <td>{row.latency_p50_ms}ms</td>
                  <td>{row.latency_p95_ms}ms</td>
                  <td>
                    {row.rag_enabled_calls > 0
                      ? `${row.avg_rag_chunks.toFixed(1)} avg`
                      : 'N/A'}
                  </td>
                  <td className={row.error_count > 0 ? 'error-cell' : ''}>
                    {row.error_count} ({row.error_rate.toFixed(1)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Errors */}
      {errors && errors.total_errors > 0 && (
        <div className="metrics-section error-section">
          <h2>
            <AlertCircle size={20} />
            Errors ({errors.total_errors})
          </h2>
          <table className="errors-table">
            <thead>
              <tr>
                <th>Error Type</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {errors.by_type.map((e) => (
                <tr key={e.error_type}>
                  <td>
                    <code>{e.error_type}</code>
                  </td>
                  <td>{e.count}</td>
                  <td>{e.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LLMMetricsPage;
