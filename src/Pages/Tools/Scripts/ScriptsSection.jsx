import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
  SCRIPT_FORMATS,
  SCRIPT_CONTENT_TYPES,
} from "../../../constants/scriptConstants";
import { CONTENT_TYPE_COLORS } from "../../../constants/calendarViewConstants";
import ScriptModal from "./ScriptModal";
import { FileText, Plus, Trash2, Link2, ExternalLink, Calendar } from "lucide-react";

export default function ScriptsSection() {
  const { founderId } = useAuth();
  const [scripts, setScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState(null);
  const [newlyAddedIds, setNewlyAddedIds] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const scriptsRef = useRef(scripts);
  const newlyAddedTimeoutRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  useEffect(() => {
    scriptsRef.current = scripts;
  }, [scripts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (newlyAddedTimeoutRef.current) clearTimeout(newlyAddedTimeoutRef.current);
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    };
  }, []);

  const loadScripts = useCallback(async (detectNew = false, silent = false) => {
    console.log('[ScriptsSection] loadScripts called, founderId:', founderId);
    if (!founderId) {
      console.log('[ScriptsSection] No founderId, setting loading to false');
      setIsLoading(false);
      return;
    }
    // Only show loading spinner on initial load, not on background refresh
    if (!silent) {
      setIsLoading(true);
    }
    try {
      console.log('[ScriptsSection] Fetching scripts...');
      const data = await api.getScripts(founderId, {});
      console.log('[ScriptsSection] API response:', data);
      const newScripts = data.scripts || [];

      if (detectNew && scriptsRef.current.length > 0) {
        const previousIds = new Set(scriptsRef.current.map(s => s.id));
        const freshIds = newScripts
          .filter(script => !previousIds.has(script.id))
          .map(script => script.id);

        if (freshIds.length > 0) {
          setNewlyAddedIds(freshIds);
          setNotificationCount(freshIds.length);
          setShowNotification(true);
          // Clear previous timeouts before setting new ones
          if (newlyAddedTimeoutRef.current) clearTimeout(newlyAddedTimeoutRef.current);
          if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
          newlyAddedTimeoutRef.current = setTimeout(() => setNewlyAddedIds([]), 3000);
          notificationTimeoutRef.current = setTimeout(() => setShowNotification(false), 5000);
        }
      }

      setScripts(newScripts);
    } catch (err) {
      console.error("[ScriptsSection] Failed to load scripts:", err);
      console.error("[ScriptsSection] Error details:", err.message, err.stack);
    } finally {
      if (!silent) {
        console.log('[ScriptsSection] Setting loading to false');
        setIsLoading(false);
      }
    }
  }, [founderId]);

  useEffect(() => {
    console.log('[ScriptsSection] useEffect triggered, founderId:', founderId);
    if (founderId) {
      loadScripts();
    } else {
      console.log('[ScriptsSection] No founderId in useEffect, skipping load');
      setIsLoading(false);
    }
  }, [founderId, loadScripts]);

  // Polling for new scripts (every 2 minutes when tab is active) - silent refresh
  useEffect(() => {
    if (!founderId) return;

    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadScripts(true, true); // detectNew=true, silent=true
      }
    }, 120000); // 2 minutes

    return () => clearInterval(pollInterval);
  }, [founderId, loadScripts]);

  const handleOpenNew = () => {
    setEditingScript(null);
    setIsModalOpen(true);
  };

  const handleViewScript = (script) => {
    setEditingScript(script);
    setIsModalOpen(true);
  };

  const handleSave = async (scriptData) => {
    try {
      if (editingScript) {
        await api.updateScript(editingScript.id, scriptData);
      } else {
        await api.createScript({ ...scriptData, founderId });
      }
      await loadScripts(true);
      setIsModalOpen(false);
      setEditingScript(null);
    } catch (err) {
      console.error("Failed to save script:", err);
      alert("Failed to save script. Please try again.");
    }
  };

  const handleDelete = async (scriptId) => {
    if (!window.confirm("Are you sure you want to delete this script?")) return;

    try {
      await api.deleteScript(scriptId);
      await loadScripts();
    } catch (err) {
      console.error("Failed to delete script:", err);
      alert("Failed to delete script. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#40086d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading scripts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#40086d] to-[#5a0f99] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">
                {notificationCount} new script{notificationCount > 1 ? "s" : ""} saved!
              </p>
              <p className="text-sm text-purple-200">Generated by Marnee</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video & Post Scripts</h2>
          <p className="text-sm text-gray-500 mt-1">
            Scripts generated by Marnee, ready to produce
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#350758] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Script
        </button>
      </div>

      {/* Scripts Grid */}
      {scripts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No scripts yet</h3>
          <p className="text-gray-500 mb-6">
            Ask Marnee to write a script in the chat, or create one manually.
          </p>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#40086d] text-white rounded-lg hover:bg-[#350758] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Script
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              isNew={newlyAddedIds.includes(script.id)}
              onClick={() => handleViewScript(script)}
              onDelete={() => handleDelete(script.id)}
            />
          ))}
        </div>
      )}

      {/* Script Modal */}
      <ScriptModal
        isOpen={isModalOpen}
        script={editingScript}
        onClose={() => {
          setIsModalOpen(false);
          setEditingScript(null);
        }}
        onSave={handleSave}
        onLinkChange={() => loadScripts(false, true)}
      />
    </div>
  );
}

function ScriptCard({ script, isNew, onClick, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`relative bg-white border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isNew ? "border-[#40086d] ring-2 ring-[#ede0f8]" : "border-gray-200"
      }`}
    >
      {/* New Script Pulse */}
      {isNew && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#40086d] rounded-full animate-ping" />
      )}

      {/* Clickable Content Area */}
      <div onClick={onClick} className="p-5 pb-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="ml-auto p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{script.title}</h3>

        {/* Hook Preview */}
        {script.hook && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">"{script.hook}"</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {script.platform && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {script.platform}
            </span>
          )}
          {script.format && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              {SCRIPT_FORMATS.find((f) => f.value === script.format)?.label || script.format}
            </span>
          )}
          {script.contentType && (
            <span
              className="px-2 py-1 text-xs rounded-md"
              style={{
                backgroundColor: `${SCRIPT_CONTENT_TYPES.find((t) => t.value === script.contentType)?.color}20`,
                color: SCRIPT_CONTENT_TYPES.find((t) => t.value === script.contentType)?.color,
              }}
            >
              {script.contentType}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-2 border-t border-gray-100" onClick={onClick}>
        {/* Linked Post Card */}
        {script.postId && script.linkedPost ? (
          <div
            className="rounded-lg p-2.5 transition-all hover:shadow-sm"
            style={{
              backgroundColor: CONTENT_TYPE_COLORS[script.linkedPost.contentType] || CONTENT_TYPE_COLORS.default,
            }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
              <p className="text-xs font-medium text-gray-800 line-clamp-1">
                {script.linkedPost.title || script.linkedPost.hook || "Calendar Post"}
              </p>
            </div>
            {script.linkedPost.scheduledDate && (
              <p className="text-[10px] text-gray-500 mt-1 ml-5">
                {new Date(script.linkedPost.scheduledDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        ) : script.postId ? (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <Link2 className="w-4 h-4" />
            <span>Linked to calendar</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 px-3 py-2">
            <ExternalLink className="w-4 h-4" />
            <span>Not linked</span>
          </div>
        )}

        {/* Source indicator */}
        {script.source === "chat" && (
          <p className="text-xs text-gray-400 mt-2">Generated by Marnee</p>
        )}
      </div>
    </motion.div>
  );
}
