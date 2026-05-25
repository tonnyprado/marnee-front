/**
 * ScriptSection Component
 * Allows linking scripts to calendar posts and creating new scripts
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Link2, Unlink, Search, Loader2, Plus, Sparkles, PenLine, ChevronDown } from 'lucide-react';
import ScriptModal from '../../Pages/Tools/Scripts/ScriptModal';

export default function ScriptSection({ form, onChange, postId }) {
  const { founderId } = useAuth();
  const [scripts, setScripts] = useState([]);
  const [linkedScript, setLinkedScript] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [showScriptSelector, setShowScriptSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New script creation states
  const [showCreateOptions, setShowCreateOptions] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const loadData = async () => {
    if (!founderId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Load all scripts for this founder (single API call)
      const response = await api.getScripts(founderId);
      const allScripts = response.scripts || [];

      // Filter to get unlinked scripts (available for linking)
      const unlinked = allScripts.filter(s => !s.postId || s.postId === postId);
      setScripts(unlinked);

      // Find if there's already a linked script
      if (postId) {
        const linked = allScripts.find(s => s.postId === postId);
        if (linked) {
          setLinkedScript(linked);
          onChange('scriptId', linked.id);
        }
      }
    } catch (error) {
      console.error('[ScriptSection] Error loading scripts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load scripts on mount or when founderId/postId changes
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [founderId, postId]);

  const handleLinkScript = async (scriptId) => {
    if (!postId) {
      // Post not saved yet, just store the scriptId in form
      const script = scripts.find(s => s.id === scriptId);
      setLinkedScript(script);
      onChange('scriptId', scriptId);
      setShowScriptSelector(false);
      return;
    }

    try {
      setIsLinking(true);
      await api.linkScriptToPost(scriptId, postId);

      const script = scripts.find(s => s.id === scriptId);
      setLinkedScript(script);
      onChange('scriptId', scriptId);
      setShowScriptSelector(false);

      // Remove from available scripts
      setScripts(prev => prev.filter(s => s.id !== scriptId));
    } catch (error) {
      console.error('[ScriptSection] Error linking script:', error);
      alert('Failed to link script. Please try again.');
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkScript = async () => {
    if (!linkedScript) return;

    if (!postId) {
      // Post not saved yet, just clear from form
      setScripts(prev => [...prev, linkedScript]);
      setLinkedScript(null);
      onChange('scriptId', null);
      return;
    }

    try {
      setIsLinking(true);
      await api.unlinkScriptFromPost(linkedScript.id);

      // Add back to available scripts
      setScripts(prev => [...prev, linkedScript]);
      setLinkedScript(null);
      onChange('scriptId', null);
    } catch (error) {
      console.error('[ScriptSection] Error unlinking script:', error);
      alert('Failed to unlink script. Please try again.');
    } finally {
      setIsLinking(false);
    }
  };

  // Filter scripts by search term
  const filteredScripts = scripts.filter(script =>
    script.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    script.hook?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle creating script manually
  const handleCreateManually = () => {
    setShowCreateOptions(false);
    setShowScriptModal(true);
  };

  // Handle generating script with Marnee
  const handleGenerateWithMarnee = async () => {
    if (!postId || !founderId) {
      alert('Please save the post first before generating a script.');
      return;
    }

    setShowCreateOptions(false);
    setIsGeneratingScript(true);

    try {
      const response = await api.generateScriptFromPost(postId, founderId);

      if (response.script) {
        // Script was generated and saved
        const newScript = response.script;
        setLinkedScript(newScript);
        onChange('scriptId', newScript.id);

        // Refresh scripts list
        await loadData();
      }
    } catch (error) {
      console.error('[ScriptSection] Error generating script:', error);
      alert('Failed to generate script. Please try again.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Handle saving script from modal
  const handleSaveScript = async (scriptData) => {
    try {
      // Add founderId to script data
      const dataWithFounder = {
        ...scriptData,
        founderId,
        postId: postId || undefined, // Link to post if exists
      };

      let savedScript;
      if (postId) {
        // Create and link in one go
        const response = await api.createScript(dataWithFounder);
        savedScript = response.script || response;

        // Link to post
        if (savedScript.id) {
          await api.linkScriptToPost(savedScript.id, postId);
        }
      } else {
        // Just create the script
        const response = await api.createScript(dataWithFounder);
        savedScript = response.script || response;
      }

      // Update UI
      setLinkedScript(savedScript);
      onChange('scriptId', savedScript.id);
      setShowScriptModal(false);

      // Refresh scripts list
      await loadData();
    } catch (error) {
      console.error('[ScriptSection] Error saving script:', error);
      alert('Failed to save script. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#40086d] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Linked Script Display */}
      {linkedScript ? (
        <div className="bg-gradient-to-r from-[#f8f4fc] to-[#f3e8ff] rounded-xl p-5 border border-[#c9b8e0]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ede0f8] rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#40086d]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{linkedScript.title}</h4>
                <p className="text-sm text-gray-500">
                  {linkedScript.platform || 'No platform'} - {linkedScript.status || 'draft'}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleUnlinkScript}
              disabled={isLinking}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Unlink script"
            >
              <Unlink className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Script Content Preview */}
          {linkedScript.hook && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-[#40086d] mb-1">Hook</label>
              <p className="text-sm text-gray-700 bg-white/60 rounded-lg p-3">
                {linkedScript.hook}
              </p>
            </div>
          )}

          {linkedScript.body && (
            <div className="mb-3">
              <label className="block text-xs font-medium text-[#40086d] mb-1">Body</label>
              <p className="text-sm text-gray-700 bg-white/60 rounded-lg p-3 max-h-32 overflow-y-auto">
                {linkedScript.body}
              </p>
            </div>
          )}

          {linkedScript.cta && (
            <div>
              <label className="block text-xs font-medium text-[#40086d] mb-1">CTA</label>
              <p className="text-sm text-gray-700 bg-white/60 rounded-lg p-3">
                {linkedScript.cta}
              </p>
            </div>
          )}

          {linkedScript.visualGuidance && (
            <div className="mt-3 pt-3 border-t border-[#c9b8e0]/50">
              <label className="block text-xs font-medium text-[#40086d] mb-1">Visual Guidance</label>
              <p className="text-sm text-gray-600 italic">
                {linkedScript.visualGuidance}
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* No Script Linked - Show Options */}
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            {isGeneratingScript ? (
              // Generating script loading state
              <div className="py-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#40086d] to-[#7c3aed] rounded-2xl flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-white animate-spin" />
                </div>
                <h4 className="font-medium text-gray-700 mb-1">Marnee is creating your script...</h4>
                <p className="text-sm text-gray-400">
                  This may take a few seconds
                </p>
              </div>
            ) : (
              <>
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h4 className="font-medium text-gray-600 mb-1">No Script Linked</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Link an existing script or create a new one
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {/* Link Existing Script */}
                  <motion.button
                    onClick={() => setShowScriptSelector(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#40086d] text-white rounded-xl font-medium text-sm hover:bg-[#350758] transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    Link Existing Script
                  </motion.button>

                  {/* Create Script Dropdown */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setShowCreateOptions(!showCreateOptions)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#40086d] text-[#40086d] rounded-xl font-medium text-sm hover:bg-[#ede0f8] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Create Script
                      <ChevronDown className={`w-4 h-4 transition-transform ${showCreateOptions ? 'rotate-180' : ''}`} />
                    </motion.button>

                    {/* Dropdown Options */}
                    <AnimatePresence>
                      {showCreateOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden z-10"
                        >
                          {/* Create Manually */}
                          <motion.button
                            onClick={handleCreateManually}
                            whileHover={{ backgroundColor: 'rgba(237, 224, 248, 0.5)' }}
                            className="w-full px-4 py-3 text-left flex items-center gap-3 border-b border-gray-100"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <PenLine className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">Create Manually</p>
                              <p className="text-xs text-gray-500">Write your own script</p>
                            </div>
                          </motion.button>

                          {/* Generate with Marnee */}
                          <motion.button
                            onClick={handleGenerateWithMarnee}
                            whileHover={{ backgroundColor: 'rgba(237, 224, 248, 0.5)' }}
                            className="w-full px-4 py-3 text-left flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-[#40086d] to-[#7c3aed] rounded-lg flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">Generate with Marnee</p>
                              <p className="text-xs text-gray-500">AI-powered script creation</p>
                            </div>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Script Selector Dropdown */}
          <AnimatePresence>
            {showScriptSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden"
              >
                {/* Search */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search scripts..."
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#40086d]/20 focus:border-[#40086d]"
                    />
                  </div>
                </div>

                {/* Scripts List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredScripts.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <p className="text-sm">No scripts available</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Create scripts from the chat or Scripts page
                      </p>
                    </div>
                  ) : (
                    filteredScripts.map((script) => (
                      <motion.button
                        key={script.id}
                        onClick={() => handleLinkScript(script.id)}
                        disabled={isLinking}
                        whileHover={{ backgroundColor: 'rgba(64, 8, 109, 0.05)' }}
                        className="w-full p-4 text-left border-b border-gray-50 last:border-b-0 hover:bg-[#ede0f8]/50 transition-colors disabled:opacity-50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#ede0f8] rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-[#40086d]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-gray-900 truncate">
                              {script.title || 'Untitled Script'}
                            </h5>
                            {script.hook && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {script.hook}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              {script.platform && (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                  {script.platform}
                                </span>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                script.status === 'ready'
                                  ? 'bg-green-100 text-green-700'
                                  : script.status === 'used'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {script.status || 'draft'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>

                {/* Close button */}
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={() => setShowScriptSelector(false)}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Tip */}
      <div className="p-4 bg-[#ede0f8]/50 rounded-xl border border-[#c9b8e0]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#ede0f8] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#40086d] text-lg">i</span>
          </div>
          <div>
            <h4 className="font-medium text-[#40086d] text-sm">Pro Tip</h4>
            <p className="text-xs text-[#5a0f99] mt-1">
              Use "Generate with Marnee" to create a script based on this post's content,
              or create one manually with your own ideas.
            </p>
          </div>
        </div>
      </div>

      {/* Script Modal for Manual Creation */}
      <ScriptModal
        isOpen={showScriptModal}
        script={null}
        onClose={() => setShowScriptModal(false)}
        onSave={handleSaveScript}
      />
    </div>
  );
}
