import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import {
  SCRIPT_STATUS,
  SCRIPT_STATUS_COLORS,
  SCRIPT_STATUS_BG_COLORS,
  SCRIPT_FORMATS,
  SCRIPT_CONTENT_TYPES,
} from "../../../constants/scriptConstants";
import ScriptModal from "./ScriptModal";
import { FileText, Plus, Trash2, Edit3, Link2, ExternalLink } from "lucide-react";

export default function ScriptsSection() {
  const { founderId } = useAuth();
  const [scripts, setScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScript, setEditingScript] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newlyAddedIds, setNewlyAddedIds] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const scriptsRef = useRef(scripts);
  useEffect(() => {
    scriptsRef.current = scripts;
  }, [scripts]);

  const loadScripts = useCallback(async (detectNew = false) => {
    if (!founderId) return;
    setIsLoading(true);
    try {
      const data = await api.getScripts(founderId, {});
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
          setTimeout(() => setNewlyAddedIds([]), 3000);
          setTimeout(() => setShowNotification(false), 5000);
        }
      }

      setScripts(newScripts);
    } catch (err) {
      console.error("Failed to load scripts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [founderId]);

  useEffect(() => {
    if (founderId) {
      loadScripts();
    }
  }, [founderId, loadScripts]);

  // Polling for new scripts (every 30 seconds when tab is active)
  useEffect(() => {
    if (!founderId) return;

    const pollInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadScripts(true);
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [founderId, loadScripts]);

  const handleOpenNew = () => {
    setEditingScript(null);
    setIsModalOpen(true);
  };

  const handleEdit = (script) => {
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

  const handleUpdateStatus = async (scriptId, newStatus) => {
    try {
      await api.updateScript(scriptId, { status: newStatus });
      await loadScripts();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredScripts =
    statusFilter === "all"
      ? scripts
      : scripts.filter((script) => script.status === statusFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">
                {notificationCount} new script{notificationCount > 1 ? "s" : ""} saved!
              </p>
              <p className="text-sm text-violet-200">Generated by Marnee</p>
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
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Script
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2">
        {SCRIPT_STATUS.map((status) => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status.value
                ? "bg-violet-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {status.label}
            {status.value !== "all" && (
              <span className="ml-2 text-xs opacity-70">
                ({scripts.filter((s) => s.status === status.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scripts Grid */}
      {filteredScripts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No scripts yet</h3>
          <p className="text-gray-500 mb-6">
            Ask Marnee to write a script in the chat, or create one manually.
          </p>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Script
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              isNew={newlyAddedIds.includes(script.id)}
              onEdit={() => handleEdit(script)}
              onDelete={() => handleDelete(script.id)}
              onUpdateStatus={handleUpdateStatus}
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
      />
    </div>
  );
}

function ScriptCard({ script, isNew, onEdit, onDelete, onUpdateStatus }) {
  const statusColor = SCRIPT_STATUS_COLORS[script.status] || SCRIPT_STATUS_COLORS.draft;
  const statusBg = SCRIPT_STATUS_BG_COLORS[script.status] || SCRIPT_STATUS_BG_COLORS.draft;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`relative bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
        isNew ? "border-violet-400 ring-2 ring-violet-200" : "border-gray-200"
      }`}
    >
      {/* New Script Pulse */}
      {isNew && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full animate-ping" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="px-2 py-1 rounded-md text-xs font-medium"
          style={{ backgroundColor: statusBg, color: statusColor }}
        >
          {script.status?.charAt(0).toUpperCase() + script.status?.slice(1)}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{script.title}</h3>

      {/* Hook Preview */}
      {script.hook && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{script.hook}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Linked Post Indicator */}
      {script.postId ? (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <Link2 className="w-4 h-4" />
          <span>Linked to calendar post</span>
        </div>
      ) : (
        <button
          onClick={() => {
            // TODO: Open post selector modal
            alert("Link to Calendar Post - Coming soon!");
          }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 hover:bg-violet-50 px-3 py-2 rounded-lg transition-colors w-full"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Link to Calendar Post</span>
        </button>
      )}

      {/* Source indicator */}
      {script.source === "chat" && (
        <p className="text-xs text-gray-400 mt-3">Generated by Marnee</p>
      )}
    </motion.div>
  );
}
