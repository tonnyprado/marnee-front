import { useState, useEffect } from 'react';
import {
  Brain,
  Database,
  TrendingUp,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import * as mlSettingsApi from '../../services/mlSettingsApi';

export default function MLIntelligencePanel() {
  const [activeTab, setActiveTab] = useState('status');
  const [status, setStatus] = useState(null);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusData, settingsData, statsData] = await Promise.all([
        mlSettingsApi.getStatus(),
        mlSettingsApi.getSettings(),
        mlSettingsApi.getUsageStats(30)
      ]);

      setStatus(statusData);
      setSettings(settingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading ML data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      setSaving(true);
      await mlSettingsApi.updateSettings(newSettings);
      alert('✅ ML settings saved successfully');
      loadData();
    } catch (error) {
      alert(`❌ Error saving settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <RefreshCw className="animate-spin text-mn-purple mx-auto mb-4" size={48} />
        <p className="text-gray-600">Loading ML Intelligence...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'status', label: 'System Status', icon: Brain },
    { id: 'settings', label: 'Configuration', icon: Settings },
    { id: 'stats', label: 'Usage & Savings', icon: BarChart3 },
    { id: 'sources', label: 'Data Sources', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Brain className="text-mn-purple" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🤖 Hybrid ML Intelligence
            </h2>
            <p className="text-gray-700 mb-3">
              Reduce AI costs by 95% using Machine Learning to pre-process data before Marnee validation
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-3 py-1.5 rounded-full border border-green-200">
                <span className="text-sm font-medium text-green-700">
                  💰 95% Cost Savings
                </span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full border border-blue-200">
                <span className="text-sm font-medium text-blue-700">
                  📊 10-20x More Data
                </span>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full border border-purple-200">
                <span className="text-sm font-medium text-purple-700">
                  🔄 6+ Free Sources
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 p-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition font-medium ${
                    activeTab === tab.id
                      ? 'bg-white text-mn-purple shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'status' && (
            <SystemStatusTab status={status} onRefresh={loadData} />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              onSave={handleSaveSettings}
              saving={saving}
            />
          )}
          {activeTab === 'stats' && (
            <StatsTab stats={stats} />
          )}
          {activeTab === 'sources' && (
            <DataSourcesTab
              settings={settings}
              status={status}
              onSave={handleSaveSettings}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Status Tab
function SystemStatusTab({ status, onRefresh }) {
  if (!status) return <div>Loading...</div>;

  const mlStatus = status.status.ml_intelligence;
  const dataSourcesStatus = status.status.free_data_sources;
  const recommendations = status.recommendations || [];

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className={`rounded-lg p-4 border-2 ${
        status.status.hybrid_mode
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          {status.status.hybrid_mode ? (
            <CheckCircle className="text-green-600" size={24} />
          ) : (
            <AlertCircle className="text-yellow-600" size={24} />
          )}
          <div>
            <h3 className="font-semibold text-lg">
              {status.status.hybrid_mode ? '✅ Hybrid Mode Active' : '⚠️ Partial Mode'}
            </h3>
            <p className="text-sm text-gray-600">
              {status.status.hybrid_mode
                ? 'ML Intelligence is fully operational'
                : 'Some ML features unavailable - check recommendations below'}
            </p>
          </div>
        </div>
      </div>

      {/* ML Models Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Brain size={20} className="text-mn-purple" />
          ML Models
        </h3>
        <div className="space-y-2">
          <StatusItem
            label="BERTopic (Topic Modeling)"
            available={mlStatus.bertopic}
            description="Identifies trending topics from large text datasets"
          />
          <StatusItem
            label="KeyBERT (Keyword Extraction)"
            available={mlStatus.keybert}
            description="Extracts relevant keywords automatically"
          />
          <StatusItem
            label="Transformers (Sentiment Analysis)"
            available={mlStatus.transformers}
            description="Analyzes sentiment without using AI tokens"
          />
        </div>
      </div>

      {/* Data Sources Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Database size={20} className="text-mn-purple" />
          Free Data Sources
        </h3>
        <div className="space-y-2">
          <StatusItem
            label="Reddit API"
            available={dataSourcesStatus.reddit}
            description="Requires credentials (free)"
            highlight={!dataSourcesStatus.reddit}
          />
          <StatusItem
            label="Medium RSS"
            available={dataSourcesStatus.medium}
            description="No credentials needed ✓"
          />
          <StatusItem
            label="Hacker News API"
            available={dataSourcesStatus.hackernews}
            description="No credentials needed ✓"
          />
          <StatusItem
            label="Dev.to API"
            available={dataSourcesStatus.devto}
            description="No credentials needed ✓"
          />
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <TrendingUp size={20} />
            Recommendations to Improve
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <AlertCircle className="text-blue-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{rec.package}</p>
                    <p className="text-sm text-gray-600 mb-2">{rec.benefit}</p>
                    {rec.command && (
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 block">
                        {rec.command}
                      </code>
                    )}
                    {rec.action && (
                      <p className="text-sm text-blue-700 mt-2">📝 {rec.action}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2 text-gray-700"
      >
        <RefreshCw size={18} />
        Refresh Status
      </button>
    </div>
  );
}

function StatusItem({ label, available, description, highlight }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${
      highlight ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
    }`}>
      {available ? (
        <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
      ) : (
        <XCircle className="text-gray-400 flex-shrink-0 mt-0.5" size={20} />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Settings Tab
function SettingsTab({ settings, onSave, saving }) {
  const [formData, setFormData] = useState(settings || {});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNestedChange = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Enable/Disable */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-semibold text-gray-900">Enable ML Intelligence</p>
            <p className="text-sm text-gray-600">
              Use ML to pre-process data before sending to Marnee (95% cost savings)
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.enabled || false}
            onChange={() => handleToggle('enabled')}
            className="w-6 h-6 text-mn-purple rounded focus:ring-mn-purple"
          />
        </label>
      </div>

      {/* GPU Acceleration */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-medium text-gray-900">GPU Acceleration</p>
            <p className="text-sm text-gray-600">
              Speeds up ML processing 5-10x (requires CUDA-compatible GPU)
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.models?.use_gpu || false}
            onChange={() => handleNestedChange('models.use_gpu', !formData.models?.use_gpu)}
            className="w-5 h-5 text-mn-purple rounded focus:ring-mn-purple"
          />
        </label>
      </div>

      {/* Confidence Threshold */}
      <div>
        <label className="block mb-2">
          <span className="font-medium text-gray-900">Confidence Threshold</span>
          <span className="text-sm text-gray-600 ml-2">
            ({formData.validation?.confidence_threshold || 0.7})
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={formData.validation?.confidence_threshold || 0.7}
          onChange={(e) => handleNestedChange('validation.confidence_threshold', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-mn-purple"
        />
        <p className="text-sm text-gray-600 mt-1">
          Minimum confidence to accept ML insights (higher = stricter quality control)
        </p>
      </div>

      {/* Minimum Sample Size */}
      <div>
        <label className="block mb-2">
          <span className="font-medium text-gray-900">Minimum Sample Size</span>
        </label>
        <input
          type="number"
          min="5"
          max="100"
          step="5"
          value={formData.validation?.min_sample_size || 10}
          onChange={(e) => handleNestedChange('validation.min_sample_size', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-1">
          Minimum documents required for ML analysis
        </p>
      </div>

      {/* Validation Sources */}
      <div>
        <p className="font-medium text-gray-900 mb-3">Validation Sources</p>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.validation?.use_youtube !== false}
              onChange={() => handleNestedChange('validation.use_youtube', !formData.validation?.use_youtube)}
              className="w-4 h-4 text-mn-purple rounded focus:ring-mn-purple"
            />
            <span className="text-gray-700">Use YouTube API for validation</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.validation?.use_dataforseo || false}
              onChange={() => handleNestedChange('validation.use_dataforseo', !formData.validation?.use_dataforseo)}
              className="w-4 h-4 text-mn-purple rounded focus:ring-mn-purple"
            />
            <span className="text-gray-700">Use DataForSEO for validation</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 px-4 bg-mn-purple text-white rounded-lg hover:bg-mn-purple-dark transition font-medium disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Configuration'}
      </button>
    </form>
  );
}

// Stats Tab
function StatsTab({ stats }) {
  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-700">Total Analyses</p>
            <BarChart3 className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-purple-900">{stats.total_analyses || 0}</p>
          <p className="text-sm text-purple-600 mt-1">Last {stats.period_days} days</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700">Cost Savings</p>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-900">
            {stats.cost_savings?.total_saved || '$0.00'}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {stats.cost_savings?.savings_percentage || '0%'} savings
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Analysis Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(stats.by_type || {}).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{type.replace('_', ' ')}</span>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Tokens Saved</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.cost_savings?.total_tokens_saved?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Est. Full LLM Cost</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.cost_savings?.estimated_full_llm_cost || '$0.00'}
          </p>
        </div>
      </div>

      {/* Average per Analysis */}
      {stats.average_per_analysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3">Average per Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700">Tokens Saved</p>
              <p className="text-lg font-bold text-blue-900">
                ~{stats.average_per_analysis.tokens_saved || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Cost Saved</p>
              <p className="text-lg font-bold text-blue-900">
                {stats.average_per_analysis.cost_saved || '$0.00'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Data Sources Tab
function DataSourcesTab({ settings, status, onSave, saving }) {
  const [formData, setFormData] = useState(settings?.data_sources || {});

  useEffect(() => {
    if (settings?.data_sources) {
      setFormData(settings.data_sources);
    }
  }, [settings]);

  const handleSourceToggle = (source) => {
    setFormData(prev => ({
      ...prev,
      [source]: {
        ...prev[source],
        enabled: !prev[source]?.enabled
      }
    }));
  };

  const handleLimitChange = (source, value) => {
    setFormData(prev => ({
      ...prev,
      [source]: {
        ...prev[source],
        limit: parseInt(value)
      }
    }));
  };

  const handleSubmit = () => {
    onSave({ data_sources: formData });
  };

  const dataSourceInfo = {
    reddit: {
      name: 'Reddit',
      description: 'High-quality niche discussions',
      requiresAuth: true,
      available: status?.status.free_data_sources?.reddit
    },
    medium: {
      name: 'Medium',
      description: 'Long-form content & thought leadership',
      requiresAuth: false,
      available: true
    },
    hackernews: {
      name: 'Hacker News',
      description: 'Tech trends & startup insights',
      requiresAuth: false,
      available: true
    },
    devto: {
      name: 'Dev.to',
      description: 'Developer content & tutorials',
      requiresAuth: false,
      available: true
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> Enable multiple sources to get more diverse data.
          All sources except Reddit work without any configuration.
        </p>
      </div>

      {Object.entries(dataSourceInfo).map(([key, info]) => (
        <div
          key={key}
          className={`border-2 rounded-lg p-4 ${
            formData[key]?.enabled
              ? 'border-mn-purple bg-purple-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={formData[key]?.enabled || false}
              onChange={() => handleSourceToggle(key)}
              className="w-5 h-5 text-mn-purple rounded focus:ring-mn-purple mt-1"
            />

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{info.name}</h3>
                {info.available ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                    ✓ Available
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    ⚠ Not Configured
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3">{info.description}</p>

              {formData[key]?.enabled && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Limit
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    step="10"
                    value={formData[key]?.limit || 50}
                    onChange={(e) => handleLimitChange(key, e.target.value)}
                    className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Number of documents to fetch per analysis
                  </p>
                </div>
              )}

              {info.requiresAuth && !info.available && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>⚙️ Configuration needed:</strong> Add REDDIT_CLIENT_ID and
                    REDDIT_CLIENT_SECRET to your .env file.
                    <a
                      href="https://www.reddit.com/prefs/apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline ml-1"
                    >
                      Get credentials here →
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full py-3 px-4 bg-mn-purple text-white rounded-lg hover:bg-mn-purple-dark transition font-medium disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Data Sources'}
      </button>
    </div>
  );
}
