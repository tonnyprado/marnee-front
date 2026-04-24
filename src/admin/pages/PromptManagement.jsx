import { useState, useEffect } from 'react';
import { Download, Brain, MessageSquare } from 'lucide-react';
import PromptCategoryTree from '../components/PromptCategoryTree';
import PromptEditor from '../components/PromptEditor';
import PromptVersionHistory from '../components/PromptVersionHistory';
import TestChatPanel from '../components/TestChatPanel';
import OpenAICreditsCard from '../components/OpenAICreditsCard';
import { updatePrompt, getPrompts, importPromptsFromCode } from '../../services/promptsApi';
import AdminTransition from '../components/AdminTransition';

export default function PromptManagement() {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTestChat, setShowTestChat] = useState(false);
  const [allPrompts, setAllPrompts] = useState([]);

  useEffect(() => {
    fetchAllPrompts();
  }, [refreshKey]);

  const fetchAllPrompts = async () => {
    try {
      const response = await getPrompts();
      setAllPrompts(response.data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setShowTestChat(false);
  };

  const handleSavePrompt = async (formData) => {
    if (!selectedPrompt) return;

    try {
      setSaving(true);
      await updatePrompt(selectedPrompt.id, formData);
      alert('Prompt updated successfully!');

      // Refresh data
      setRefreshKey(prev => prev + 1);

      // Reload selected prompt
      const response = await getPrompts();
      const updated = response.data.find(p => p.id === selectedPrompt.id);
      if (updated) {
        setSelectedPrompt(updated);
      }
    } catch (error) {
      alert(`Error saving prompt: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async () => {
    if (!window.confirm('Import all hardcoded prompts from code? This will create default entries in the database.')) {
      return;
    }

    try {
      setImporting(true);
      const response = await importPromptsFromCode();
      alert(`Import completed!\n\nPrompts created: ${response.imported.prompts_created}\nScripts created: ${response.imported.scripts_created}`);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleRollback = () => {
    // Refresh after rollback
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AdminTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
              <Brain className="text-mn-purple" size={32} />
              Marnee Training
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Marnee's prompts, test responses, and monitor API usage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTestChat(!showTestChat)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                showTestChat
                  ? 'bg-mn-purple text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare size={18} />
              Test Chat
            </button>

            <button
              onClick={handleImport}
              disabled={importing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Download size={18} />
              {importing ? 'Importing...' : 'Import from Code'}
            </button>
          </div>
        </div>

        {/* OpenAI Credits Card */}
        <OpenAICreditsCard />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Category Tree */}
          <div className="lg:col-span-3">
            <PromptCategoryTree
              onSelectPrompt={handleSelectPrompt}
              selectedPromptId={selectedPrompt?.id}
              key={refreshKey}
            />
          </div>

          {/* Main Area */}
          <div className="lg:col-span-9">
            {!showTestChat ? (
              <>
                {selectedPrompt ? (
                  <div className="space-y-6">
                    {/* Prompt Editor */}
                    <PromptEditor
                      prompt={selectedPrompt}
                      onSave={handleSavePrompt}
                      onCancel={() => setSelectedPrompt(null)}
                      saving={saving}
                    />

                    {/* Version History */}
                    <PromptVersionHistory
                      promptId={selectedPrompt.id}
                      onRollback={handleRollback}
                      key={`${selectedPrompt.id}-${refreshKey}`}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Brain size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a prompt to edit
                    </h3>
                    <p className="text-gray-600">
                      Choose a prompt from the category tree to view and edit its content
                    </p>
                  </div>
                )}
              </>
            ) : (
              <TestChatPanel prompts={allPrompts} />
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 How to use this page</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Edit prompts:</strong> Select a prompt from the tree, make changes, and save</li>
            <li>• <strong>Version control:</strong> All changes are versioned - you can rollback anytime</li>
            <li>• <strong>Test changes:</strong> Use the Test Chat to see how Marnee responds with current prompts</li>
            <li>• <strong>Import:</strong> Run import once to migrate hardcoded prompts to the database</li>
            <li>• <strong>Status:</strong> Set prompts to "active" for Marnee to use them, or keep as "draft" to test</li>
          </ul>
        </div>
      </div>
    </AdminTransition>
  );
}
