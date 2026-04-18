import React, { useState, useEffect } from 'react';
import { useMarnee } from '../context/MarneeContext';

/**
 * ChatDebugger Component
 *
 * Muestra información de debugging del chat en tiempo real.
 * Solo para desarrollo - remover en producción.
 *
 * Para usar: Agregar <ChatDebugger /> en IAWebPage.jsx
 */
export default function ChatDebugger() {
  const { messages, conversationId, founderId, sessionId } = useMarnee();
  const [isOpen, setIsOpen] = useState(false);
  const [localStorageBackup, setLocalStorageBackup] = useState(null);

  useEffect(() => {
    // Actualizar backup de localStorage
    const backup = localStorage.getItem('marnee_messages_backup');
    if (backup) {
      try {
        setLocalStorageBackup(JSON.parse(backup));
      } catch (e) {
        setLocalStorageBackup(null);
      }
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 z-50 text-xs font-mono"
      >
        🐛 Debug Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-green-400 p-4 rounded-lg shadow-2xl z-50 max-w-md font-mono text-xs overflow-auto max-h-96">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold">🐛 Chat Debugger</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Context State */}
        <div>
          <div className="text-yellow-400 font-bold mb-1">📦 Context State:</div>
          <div className="pl-2 space-y-1">
            <div>messages.length: <span className="text-cyan-400">{messages.length}</span></div>
            <div>conversationId: <span className="text-cyan-400">{conversationId || 'null'}</span></div>
            <div>founderId: <span className="text-cyan-400">{founderId || 'null'}</span></div>
            <div>sessionId: <span className="text-cyan-400">{sessionId || 'null'}</span></div>
          </div>
        </div>

        {/* localStorage Backup */}
        <div>
          <div className="text-yellow-400 font-bold mb-1">💾 localStorage Backup:</div>
          <div className="pl-2">
            {localStorageBackup ? (
              <div>backup.length: <span className="text-cyan-400">{localStorageBackup.length}</span></div>
            ) : (
              <div className="text-red-400">No backup found</div>
            )}
          </div>
        </div>

        {/* Messages Preview */}
        <div>
          <div className="text-yellow-400 font-bold mb-1">💬 Messages:</div>
          <div className="pl-2 space-y-1 max-h-40 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-red-400">No messages in context</div>
            ) : (
              messages.slice(-5).map((msg, idx) => (
                <div key={msg.id} className="text-xs">
                  <span className={msg.from === 'ai' ? 'text-blue-400' : 'text-green-400'}>
                    [{msg.from}]
                  </span>{' '}
                  {msg.text.substring(0, 50)}...
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-700 pt-3 space-y-2">
          <button
            onClick={() => {
              console.group('🐛 Chat Debug Info');
              console.log('messages:', messages);
              console.log('conversationId:', conversationId);
              console.log('founderId:', founderId);
              console.log('sessionId:', sessionId);
              console.log('localStorage backup:', localStorageBackup);
              console.groupEnd();
              alert('Check console for full debug info');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
          >
            📋 Log to Console
          </button>

          <button
            onClick={() => {
              const data = {
                contextMessages: messages.length,
                localStorageBackup: localStorageBackup?.length || 0,
                conversationId,
                founderId,
                sessionId,
                timestamp: new Date().toISOString(),
              };
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              alert('Debug info copied to clipboard!');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
          >
            📋 Copy Debug Info
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure? This will clear all chat data from localStorage.')) {
                localStorage.removeItem('marnee_messages_backup');
                localStorage.removeItem('marnee_conversationId');
                window.location.reload();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
          >
            🗑️ Clear localStorage & Reload
          </button>
        </div>

        {/* Warnings */}
        {messages.length === 0 && conversationId && (
          <div className="border border-yellow-600 bg-yellow-900/30 p-2 rounded">
            <div className="text-yellow-400 font-bold">⚠️ Warning:</div>
            <div className="text-yellow-300 text-xs">
              You have a conversationId but no messages in context. Messages may have been cleared.
            </div>
          </div>
        )}

        {localStorageBackup && messages.length !== localStorageBackup.length && (
          <div className="border border-orange-600 bg-orange-900/30 p-2 rounded">
            <div className="text-orange-400 font-bold">⚠️ Mismatch:</div>
            <div className="text-orange-300 text-xs">
              Context has {messages.length} messages but localStorage has {localStorageBackup.length}. Possible sync issue.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
