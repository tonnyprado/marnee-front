import { useState, useEffect } from 'react';
import { Save, X, Eye, EyeOff } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'inactive', label: 'Inactive', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-700' },
];

export default function PromptEditor({ prompt, onSave, onCancel, saving = false }) {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    description: '',
    status: 'draft',
    change_summary: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (prompt) {
      setFormData({
        name: prompt.name || '',
        content: prompt.content || '',
        description: prompt.description || '',
        status: prompt.status || 'draft',
        change_summary: '',
      });
    }
  }, [prompt]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const currentStatus = STATUS_OPTIONS.find(s => s.value === formData.status);
  const charCount = formData.content.length;
  const wordCount = formData.content.trim().split(/\s+/).filter(w => w).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Prompt name"
                className="text-lg font-semibold border-none focus:ring-0 p-0 w-full"
                required
              />
              {prompt && (
                <p className="text-xs text-gray-500 mt-1">
                  Key: {prompt.key} | Version: {prompt.current_version}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium border-none ${currentStatus?.color}`}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title={showPreview ? 'Hide preview' : 'Show preview'}
              >
                {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of this prompt..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          />
        </div>

        {/* Content Editor */}
        <div className="p-4">
          {!showPreview ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="text-xs text-gray-500">
                  {wordCount} words · {charCount} characters
                </div>
              </div>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter prompt content..."
                rows={20}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-mn-purple focus:border-transparent resize-y"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                  {formData.content}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Change Summary (only for updates) */}
        {prompt && (
          <div className="px-4 pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Summary <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.change_summary}
              onChange={(e) => handleChange('change_summary', e.target.value)}
              placeholder="Describe what changed in this version..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps track changes in the version history
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-night transition disabled:opacity-50 flex items-center gap-2"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
