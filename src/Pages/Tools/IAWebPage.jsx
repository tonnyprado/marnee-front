import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useMarnee } from "../../context/MarneeContext";
import marneeMascot from "../../assets/mascot/marnee12.png";
import ChatDebugger from "../../Component/ChatDebugger";
import { Search, Send, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom markdown components with Tailwind styles for AI messages
// eslint-disable-next-line jsx-a11y/heading-has-content
const aiMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4 text-gray-900" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mb-2 mt-3 text-gray-800" {...props} />,
  p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  a: ({ node, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className="text-[#40086d] hover:text-[#40086d] underline font-medium" {...props} />
  ),
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
    ) : (
      <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 text-gray-800" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-violet-300 pl-4 italic my-3 text-gray-700" {...props} />
  ),
};

// Custom markdown components for user messages (white text on gradient background)
// eslint-disable-next-line jsx-a11y/heading-has-content
const userMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4 mt-6 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3 mt-5 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2 mt-4 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mb-2 mt-3 text-white" {...props} />,
  p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-white" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-2 text-white" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-2 text-white" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-white" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
  a: ({ node, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className="text-white underline hover:text-gray-100 font-medium" {...props} />
  ),
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-white/20 px-1.5 py-0.5 rounded text-sm font-mono text-white" {...props} />
    ) : (
      <code className="block bg-white/20 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 text-white" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-white/50 pl-4 italic my-3 text-white" {...props} />
  ),
};

export default function IAWebPage() {
  const {
    founderId,
    sessionId,
    conversationId,
    currentStep,
    messages,
    welcomeMessage,
    initSession,
    addMessage,
    setMessages,
    setConversationId,
    setCalendarId,
    updateStep,
    loadConversation,
    getMessagesForApi,
  } = useMarnee();

  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendarButton, setShowCalendarButton] = useState(false);
  const messagesEndRef = useRef(null);
  const hasLoadedConversationRef = useRef(false);
  const navigate = useNavigate();

  // Generate unique ID for messages
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  };

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if we should show the calendar button
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.from === 'ai') {
      const hasCalendarAction =
        lastMessage.primaryAction?.type === 'navigate' &&
        lastMessage.primaryAction?.target === 'calendar';
      setShowCalendarButton(hasCalendarAction);
    }
  }, [messages]);

  const ensureFounderLoaded = async () => {
    if (founderId) return founderId;

    try {
      const founder = await api.getMeFounder();
      return founder?.id || null;
    } catch (loadError) {
      return null;
    }
  };

  // Load session from DB if not in localStorage (after login)
  useEffect(() => {
    const loadSessionFromDB = async () => {
      try {
        console.log("[IAWebPage] Loading session from DB...");
        const founder = await api.getMeFounder();

        if (founder && founder.id) {
          console.log("[IAWebPage] Founder found:", founder.id);
          const sessions = await api.getMeSessions();
          let latestSession = null;
          let hasConversation = false;

          // First, check if there's a conversation to load
          try {
            const conversations = await api.getConversations();
            console.log("[IAWebPage] Found", conversations?.length || 0, "conversations");

            if (conversations && conversations.length > 0) {
              const latestConversation = conversations[0];
              console.log("[IAWebPage] Loading latest conversation:", latestConversation.id);

              const conversationData = await api.getConversation(latestConversation.id);

              // CRITICAL: Verify conversation has messages before marking as loaded
              if (conversationData && conversationData.messages && conversationData.messages.length > 0) {
                hasConversation = true;
                console.log("[IAWebPage] Conversation has", conversationData.messages.length, "messages");

                // Initialize session WITHOUT clearing messages since we're loading a conversation
                if (sessions && sessions.length > 0) {
                  latestSession = sessions[0];
                  initSession({
                    founderId: founder.id,
                    sessionId: latestSession.id,
                    welcomeMessage: latestSession.welcomeMessage || "Welcome back! How can I help you today?",
                    clearMessages: false, // DON'T clear messages
                  });
                }

                // Load the conversation AFTER initializing session
                await loadConversation(conversationData);
                hasLoadedConversationRef.current = true;
                console.log("[IAWebPage] Conversation loaded successfully");
              } else {
                console.warn("[IAWebPage] WARNING: Conversation exists but has no messages");
              }
            }
          } catch (convError) {
            console.log("[IAWebPage] No existing conversations found:", convError.message);
          }

          // If no conversation was found, initialize session normally (clear messages)
          if (!hasConversation) {
            console.log("[IAWebPage] No conversation loaded, initializing fresh session");

            if (sessions && sessions.length > 0) {
              latestSession = sessions[0];
              initSession({
                founderId: founder.id,
                sessionId: latestSession.id,
                welcomeMessage: latestSession.welcomeMessage || "Welcome back! How can I help you today?",
                clearMessages: true,
              });
            } else {
              initSession({
                founderId: founder.id,
                sessionId: null,
                welcomeMessage:
                  "Hi, I'm Marnee. Ask me anything about your brand, content ideas, positioning, or messaging and we'll work through it together.",
                clearMessages: true,
              });
            }
            setConversationId(null);
          }
        }
      } catch (error) {
        console.log("[IAWebPage] No existing founder or session found in DB:", error.message);
        // Don't show error to user - this is normal for new users
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadSessionFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset flag when component mounts or unmounts
  useEffect(() => {
    // Reset on mount
    hasLoadedConversationRef.current = false;

    // Cleanup: reset on unmount so it loads fresh next time
    return () => {
      hasLoadedConversationRef.current = false;
    };
  }, []);

  // Load conversation when navigating back to chat (if not already loaded)
  // This handles the case when user goes: Chat -> Calendar -> Chat
  useEffect(() => {
    const loadExistingConversation = async () => {
      // CRITICAL: Only load if messages are truly empty AND we haven't loaded yet
      // Do NOT load if we're just remounting with existing messages in context
      if (conversationId && messages.length === 0 && !isLoadingSession && !hasLoadedConversationRef.current) {
        try {
          console.log("[IAWebPage] Attempting to load conversation on remount:", conversationId);
          const conversation = await api.getConversation(conversationId);

          // CRITICAL: Verify the conversation has messages before loading
          if (conversation && conversation.messages && conversation.messages.length > 0) {
            console.log("[IAWebPage] Loading conversation with", conversation.messages.length, "messages");
            await loadConversation(conversation);
            hasLoadedConversationRef.current = true;
          } else {
            console.warn("[IAWebPage] WARNING: Conversation exists but has no messages");
            hasLoadedConversationRef.current = true;
            // Add welcome message as fallback
            if (welcomeMessage && messages.length === 0) {
              addMessage({
                id: generateUniqueId(),
                from: "ai",
                text: welcomeMessage,
                step: 1,
                needsApproval: false,
              });
            }
          }
        } catch (error) {
          console.error("[IAWebPage] Failed to load conversation:", error);
          hasLoadedConversationRef.current = true; // Mark as attempted to prevent retry loop

          // Only add welcome message if we truly have no messages
          if (welcomeMessage && messages.length === 0) {
            addMessage({
              id: generateUniqueId(),
              from: "ai",
              text: welcomeMessage,
              step: 1,
              needsApproval: false,
            });
          }
        }
      } else if (messages.length > 0) {
        // We already have messages in context, don't reload
        console.log("[IAWebPage] Messages already exist in context, skipping conversation load");
        hasLoadedConversationRef.current = true;
      }
    };

    // Only run this effect after initial session load is complete
    if (!isLoadingSession) {
      loadExistingConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, isLoadingSession, messages.length]);

  // Show welcome message on first load (only if no conversation loaded)
  useEffect(() => {
    if (welcomeMessage && messages.length === 0 && !conversationId && !isLoadingSession) {
      addMessage({
        id: generateUniqueId(),
        from: "ai",
        text: welcomeMessage,
        step: 1,
        needsApproval: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welcomeMessage, messages.length, conversationId, isLoadingSession]);

  // Send message to Marnee
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    try {
      const userMessage = input.trim();
      setInput("");
      setError(null);
      const ensuredFounderId = await ensureFounderLoaded();

      // Add user message immediately
      addMessage({
        id: generateUniqueId(),
        from: "user",
        text: userMessage,
        step: currentStep,
      });

      setIsLoading(true);

      const response = await api.sendMessage({
        founderId: ensuredFounderId || founderId || null,
        sessionId: sessionId || null,
        conversationId,
        message: userMessage,
        messages: getMessagesForApi(),
      });
      const shouldOpenCalendar =
        response.calendarId ||
        (response.primaryAction?.type === "navigate" &&
          response.primaryAction?.target === "calendar");

      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      if (response.calendarId) {
        setCalendarId(response.calendarId);
      }

      if (response.currentStep) {
        updateStep(response.currentStep);
      }

      // If the response is about calendar generation, show a brief message instead of the full calendar text
      const messageText = shouldOpenCalendar
        ? "¡Perfecto! Tu calendario de contenido está listo. Haz clic en el botón de abajo para verlo y empezar a planificar tus posts."
        : response.reply;

      addMessage({
        id: generateUniqueId(),
        from: "ai",
        text: messageText,
        step: response.currentStep,
        stepName: response.stepName,
        primaryAction: response.primaryAction || null,
        uiActions: response.uiActions || [],
        needsApproval: false,
      });

      // Don't auto-navigate to calendar, let user click the button instead
      // The button will show automatically via the primaryAction in the message
    } catch (err) {
      let errorMessage = "I couldn't send that message right now. Please try again in a moment.";

      if (err.status === 503) {
        errorMessage = "Marnee service is temporarily unavailable. Please try again in a few minutes.";
      } else if (err.status === 404) {
        errorMessage = "Service endpoint not found. Please contact support.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleMessages = normalizedSearchTerm
    ? messages.filter((msg) => msg.text.toLowerCase().includes(normalizedSearchTerm))
    : messages;
  const matchesCount = normalizedSearchTerm ? visibleMessages.length : 0;
  const mascotClassName = isLoading
    ? "marnee-mascot marnee-mascot--thinking"
    : "marnee-mascot";

  if (isLoadingSession) {
    return (
      <div className="flex h-screen bg-[#f6f6f6] items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f6f6] flex-col relative overflow-hidden">

      <header className="border-b border-[rgba(30,30,30,0.1)] px-4 py-3 text-gray-900 bg-white flex-shrink-0 relative">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#40086d]"
          >
            <img
              src={marneeMascot}
              alt="Marnee mascot"
              className={`${mascotClassName} h-7 w-7 object-contain`}
            />
          </motion.div>
          <div>
            <h1 className="text-lg font-semibold text-[#1e1e1e]">Marnee Chat</h1>
            <p className="text-xs text-gray-500">
              Your AI content strategist
            </p>
          </div>
        </div>

        <div className="mt-3 relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
            placeholder="Search conversation..."
          />
          <Search className="w-4 h-4 text-[#40086d] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {normalizedSearchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            {matchesCount > 0
              ? `${matchesCount} message${matchesCount === 1 ? "" : "s"} found`
              : "No messages match that search yet."}
          </p>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex-shrink-1 relative">
        <AnimatePresence>
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-2xl rounded-3xl px-4 py-3 transition ${
                  msg.from === "ai"
                    ? "bg-white border border-[rgba(30,30,30,0.1)] text-gray-800"
                    : "ml-auto bg-[#40086d] text-white"
                } ${
                  normalizedSearchTerm && msg.text.toLowerCase().includes(normalizedSearchTerm)
                    ? "ring-2 ring-[#40086d] ring-offset-2 ring-offset-transparent"
                    : ""
                }`}
              >
                <ReactMarkdown
                  components={msg.from === "ai" ? aiMarkdownComponents : userMarkdownComponents}
                >
                  {msg.text}
                </ReactMarkdown>

                {msg.from === "ai" &&
                  msg.primaryAction?.type === "navigate" &&
                  msg.primaryAction?.target === "calendar" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => navigate("/app/calendar")}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1e1e1e] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#dccaf4] hover:text-[#1a0530]"
                    >
                      <Calendar className="w-3 h-3" />
                      Open Calendar
                    </motion.button>
                  )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {normalizedSearchTerm && visibleMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl rounded-2xl border border-dashed border-[rgba(30,30,30,0.1)] bg-white px-4 py-4 text-xs text-gray-500"
          >
            Try another word or clear the search to see the full conversation again.
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl rounded-3xl px-4 py-3 bg-white border border-[rgba(30,30,30,0.1)]"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 bg-[#40086d] rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-2 h-2 bg-[#40086d] rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />
              <motion.div
                className="w-2 h-2 bg-[#40086d] rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              />
            </div>
          </motion.div>
        )}

        {error && (
          <div className="max-w-3xl p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prominent Calendar Button */}
      {showCalendarButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-[#ede0f8] border-t border-[rgba(64,8,109,0.15)] flex-shrink-0 relative"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#1e1e1e] mb-0.5">
                Ready to create your content calendar?
              </p>
              <p className="text-[10px] text-gray-600">
                Generate your personalized calendar
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/app/calendar")}
              className="px-4 py-2 rounded-full bg-[#40086d] text-white font-semibold text-xs hover:bg-[#1a0530] transition flex items-center gap-2 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              Go to Calendar
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="border-t border-[rgba(30,30,30,0.1)] flex items-center px-4 py-3 gap-2 bg-white flex-shrink-0 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded-full px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-full bg-[#40086d] flex items-center justify-center text-white hover:bg-[#1a0530] transition disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="pointer-events-none absolute bottom-20 right-4 hidden md:block"
      >
        <div className="relative rounded-2xl bg-white border border-[rgba(30,30,30,0.1)] px-3 py-2">
          <p className="text-[10px] text-gray-500 mb-1">
            {isLoading ? "Thinking..." : "Marnee"}
          </p>
          <img
            src={marneeMascot}
            alt="Animated Marnee assistant"
            className={`${mascotClassName} h-14 w-14 object-contain`}
          />
        </div>
      </motion.div>

      {/* Debug Component - Remove in production */}
      {process.env.NODE_ENV === 'development' && <ChatDebugger />}
    </div>
  );
}
