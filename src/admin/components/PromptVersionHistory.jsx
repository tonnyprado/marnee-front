import { useState, useEffect } from 'react';
import { Clock, User, RotateCcw, Eye, GitBranch } from 'lucide-react';
import { getPromptVersions, rollbackToVersion, getVersionContent } from '../../services/promptsApi';

const CHANGE_TYPE_ICONS = {
  create: '✨',
  edit: '✏️',
  rollback: '↩️',
  import: '📥',
};

export default function PromptVersionHistory({ promptId, onRollback }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingVersion, setViewingVersion] = useState(null);
  const [versionContent, setVersionContent] = useState(null);
  const [rollingBack, setRollingBack] = useState(false);

  useEffect(() => {
    if (promptId) {
      fetchVersions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await getPromptVersions(promptId);
      setVersions(response.data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVersion = async (version) => {
    try {
      const response = await getVersionContent(promptId, version.version_number);
      setVersionContent(response.content);
      setViewingVersion(version);
    } catch (error) {
      console.error('Error fetching version content:', error);
      alert('Failed to load version content');
    }
  };

  const handleRollback = async (versionNumber) => {
    if (!window.confirm(`Rollback to version ${versionNumber}? This will create a new version with the content from v${versionNumber}.`)) {
      return;
    }

    try {
      setRollingBack(true);
      await rollbackToVersion(promptId, versionNumber);
      await fetchVersions();
      onRollback?.();
      alert(`Successfully rolled back to version ${versionNumber}`);
    } catch (error) {
      console.error('Error rolling back:', error);
      alert(`Failed to rollback: ${error.message}`);
    } finally {
      setRollingBack(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Version History</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <GitBranch className="text-mn-purple" size={20} />
          <h3 className="text-lg font-semibold">Version History</h3>
          <span className="text-sm text-gray-500">({versions.length} versions)</span>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto">
        {versions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No version history available</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {versions.map((version) => (
              <div
                key={version.id}
                className="p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {CHANGE_TYPE_ICONS[version.change_type] || '📝'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        Version {version.version_number}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        version.status === 'active' ? 'bg-green-100 text-green-700' :
                        version.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {version.status}
                      </span>
                    </div>

                    {version.change_summary && (
                      <p className="text-sm text-gray-700 mb-2">
                        {version.change_summary}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{version.created_by_name || version.created_by_email || 'System'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{formatDate(version.created_at)}</span>
                      </div>
                      <span className="text-gray-400">{version.change_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewVersion(version)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                      title="View content"
                    >
                      <Eye size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleRollback(version.version_number)}
                      disabled={rollingBack || version.version_number === versions[0]?.version_number}
                      className="p-2 hover:bg-blue-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Rollback to this version"
                    >
                      <RotateCcw size={16} className="text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Version Content Modal */}
      {viewingVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Version {viewingVersion.version_number} Content
              </h3>
              <button
                onClick={() => {
                  setViewingVersion(null);
                  setVersionContent(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {versionContent}
                </pre>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">{viewingVersion.change_summary || 'No description'}</p>
                <p className="text-xs mt-1">
                  {viewingVersion.created_by_name || 'System'} · {formatDate(viewingVersion.created_at)}
                </p>
              </div>
              <button
                onClick={() => handleRollback(viewingVersion.version_number)}
                disabled={rollingBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                <RotateCcw size={16} />
                {rollingBack ? 'Rolling back...' : 'Rollback to this version'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
