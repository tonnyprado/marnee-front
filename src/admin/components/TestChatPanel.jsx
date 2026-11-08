import { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Clock, Hash } from 'lucide-react';
import { testChat } from '../../services/promptsApi';

export default function TestChatPanel({ prompts = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useDraft, setUseDraft] = useState(false);
  const [overridePromptId, setOverridePromptId] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    }]);

    setLoading(true);

    try {
      const response = await testChat(userMessage, {
        useDraft,
        overridePromptId: overridePromptId || null,
      });

      // Add assistant message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.message,
        metadata: response.metadata,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-mn-night to-mn-purple p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Test Chat</h3>
          <button
            onClick={handleClear}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={useDraft}
            onChange={(e) => setUseDraft(e.target.checked)}
            className="rounded border-gray-300 text-mn-purple focus:ring-mn-purple"
          />
          <span className="text-gray-700">Use draft prompts (not published)</span>
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Override with prompt:</label>
          <select
            value={overridePromptId}
            onChange={(e) => setOverridePromptId(e.target.value)}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          >
            <option value="">None (use active prompts)</option>
            {prompts.map(prompt => (
              <option key={prompt.id} value={prompt.id}>
                {prompt.name} ({prompt.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-sm">Start a conversation to test Marnee's responses</p>
            <p className="text-xs mt-1">Changes to prompts will be reflected immediately</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-mn-purple text-white'
                  : msg.role === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>

              {msg.metadata && (
                <div className="mt-2 pt-2 border-t border-gray-300 flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{msg.metadata.response_time_ms}ms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Hash size={12} />
                    <span>{msg.metadata.prompt_source}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message to test..."
            rows={2}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mn-purple focus:border-transparent resize-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-night transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
