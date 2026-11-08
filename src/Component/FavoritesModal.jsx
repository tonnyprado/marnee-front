import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Trash2, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

/**
 * FavoritesModal - Modal to view and manage favorite messages
 */
export default function FavoritesModal({ isOpen, onClose }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  const loadFavorites = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getFavoriteMessages();
      setFavorites(response.favorites || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setError('Failed to load favorite messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (messageId) => {
    try {
      // Toggle favorite (will unfavorite since it's already a favorite)
      await api.toggleMessageFavorite(messageId);
      // Remove from local state
      setFavorites((prev) => prev.filter((fav) => fav.id !== messageId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  const handleCopyMessage = (messageId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Favorite Messages
              </h2>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                  {favorites.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Loading favorites...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={loadFavorites}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Star className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-xl font-medium text-gray-900 mb-2">
                  No Favorites Yet
                </p>
                <p className="text-gray-600 text-center max-w-md">
                  Click the star icon on any message in your chat to add it to your favorites.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((favorite) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    {/* Role Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            favorite.role === 'user'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {favorite.role === 'user' ? '👤 You' : '🤖 Marnee'}
                        </span>
                        {favorite.createdAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(favorite.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyMessage(favorite.id, favorite.content)}
                          className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          title="Copy message"
                        >
                          {copiedId === favorite.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="text-gray-800 whitespace-pre-wrap break-words">
                      {favorite.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && !isLoading && !error && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
