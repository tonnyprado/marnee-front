import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useMarnee } from "../../context/MarneeContext";
import marneeMascot from "../../assets/mascot/marnee12.png";

// Custom markdown components with Tailwind styles for AI messages
// eslint-disable-next-line jsx-a11y/heading-has-content
const aiMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-base font-semibold mb-2 mt-4 text-gray-900 tracking-tight" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-sm font-semibold mb-2 mt-3 text-gray-900 tracking-tight" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-sm font-medium mb-1 mt-3 text-gray-800" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-xs font-semibold mb-1 mt-2 text-gray-700 uppercase tracking-wide" {...props} />,
  p: ({ node, ...props }) => <p className="mb-2 text-sm leading-relaxed text-gray-700" {...props} />,
  ul: ({ node, ...props }) => <ul className="mb-2 space-y-1 ml-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-1 text-sm text-gray-700" {...props} />,
  li: ({ node, ...props }) => (
    <li className="text-sm text-gray-700 flex gap-2 leading-snug">
      <span className="text-[#40086d] mt-0.5 flex-shrink-0">—</span>
      <span {...props} />
    </li>
  ),
  strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-gray-600" {...props} />,
  a: ({ node, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className="text-[#40086d] hover:text-[#1a0530] underline font-medium text-sm" {...props} />
  ),
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-700" {...props} />
    ) : (
      <code className="block bg-gray-100 p-2.5 rounded text-xs font-mono overflow-x-auto mb-2 text-gray-700" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-[#dccaf4] pl-3 italic my-2 text-xs text-gray-500" {...props} />
  ),
  hr: ({ node, ...props }) => <hr className="my-3 border-gray-100" {...props} />,
};

// Custom markdown components for user messages (white text on gradient background)
// eslint-disable-next-line jsx-a11y/heading-has-content
const userMarkdownComponents = {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h1: ({ node, ...props }) => <h1 className="text-sm font-semibold mb-1 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h2: ({ node, ...props }) => <h2 className="text-sm font-semibold mb-1 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h3: ({ node, ...props }) => <h3 className="text-xs font-medium mb-1 text-white" {...props} />,
  // eslint-disable-next-line jsx-a11y/heading-has-content
  h4: ({ node, ...props }) => <h4 className="text-xs font-medium mb-1 text-white" {...props} />,
  p: ({ node, ...props }) => <p className="text-sm leading-relaxed text-white" {...props} />,
  ul: ({ node, ...props }) => <ul className="space-y-0.5 text-white" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-0.5 text-sm text-white" {...props} />,
  li: ({ node, ...props }) => <li className="text-sm text-white leading-snug" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-white/90" {...props} />,
  a: ({ node, ...props }) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className="text-white underline hover:text-white/80 text-sm" {...props} />
  ),
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-white/20 px-1 py-0.5 rounded text-xs font-mono text-white" {...props} />
    ) : (
      <code className="block bg-white/20 p-2 rounded text-xs font-mono overflow-x-auto text-white" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-2 border-white/40 pl-2 italic text-sm text-white/80" {...props} />
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
        const founder = await api.getMeFounder();

        if (founder && founder.id) {
          const sessions = await api.getMeSessions();
          let latestSession = null;

          if (sessions && sessions.length > 0) {
            latestSession = sessions[0];

            initSession({
              founderId: founder.id,
              sessionId: latestSession.id,
              welcomeMessage: latestSession.welcomeMessage || "Welcome back! How can I help you today?",
            });
          } else {
            initSession({
              founderId: founder.id,
              sessionId: null,
              welcomeMessage:
                "Hi, I'm Marnee. Ask me anything about your brand, content ideas, positioning, or messaging and we'll work through it together.",
            });
          }

          // Always try to load the latest conversation
          try {
            const conversations = await api.getConversations();
            if (conversations && conversations.length > 0) {
              const latestConversation = conversations[0];
              const conversationData = await api.getConversation(latestConversation.id);
              await loadConversation(conversationData);
            } else if (!latestSession) {
              setConversationId(null);
            }
          } catch (convError) {
            console.log("No existing conversations found:", convError.message);
            // Don't show error to user - this is normal for new users
          }
        }
      } catch (error) {
        console.log("No existing founder or session found in DB:", error.message);
        // Don't show error to user - this is normal for new users
      } finally {
        setIsLoadingSession(false);
      }
    };

    loadSessionFromDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const loadExistingConversation = async () => {
      if (conversationId && messages.length === 0 && !isLoadingSession) {
        try {
          const conversation = await api.getConversation(conversationId);
          await loadConversation(conversation);
        } catch (error) {
          console.error("Failed to load conversation:", error);
          if (welcomeMessage) {
            addMessage({
              id: generateUniqueId(),
              from: "ai",
              text: welcomeMessage,
              step: 1,
              needsApproval: false,
            });
          }
        }
      }
    };
    loadExistingConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, isLoadingSession]);

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

      addMessage({
        id: generateUniqueId(),
        from: "ai",
        text: response.reply,
        step: response.currentStep,
        stepName: response.stepName,
        primaryAction: response.primaryAction || null,
        uiActions: response.uiActions || [],
        needsApproval: false,
      });

      if (shouldOpenCalendar) {
        navigate("/app/calendar");
      }
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
          <div className="w-16 h-16 border-4 border-[#dccaf4] border-t-[#40086d] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f6f6] flex-col relative overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <header className="border-b border-[rgba(30,30,30,0.1)] px-6 py-5 text-[#1e1e1e] bg-white flex-shrink-0 relative">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded bg-[#ede0f8]">
            <img
              src={marneeMascot}
              alt="Marnee mascot"
              className={`${mascotClassName} h-11 w-11 object-contain`}
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Marnee Chat</h1>
            <p className="text-xs text-gray-400">
              Your AI content and brand strategist, now in chat-only mode.
            </p>
          </div>
        </div>

        <div className="mt-4 relative">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.08)] rounded pl-10 pr-4 py-2 text-xs text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#40086d] focus:border-transparent"
            placeholder="Search a word in your conversation history..."
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
        </div>

        {normalizedSearchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            {matchesCount > 0
              ? `${matchesCount} message${matchesCount === 1 ? "" : "s"} found`
              : "No messages match that search yet."}
          </p>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex-shrink-1 relative">
        {visibleMessages.map((msg) => (
          <div key={msg.id}>
            <div
              className={`rounded-2xl transition ${
                msg.from === "ai"
                  ? "max-w-2xl bg-white border border-[rgba(30,30,30,0.08)] text-[#1e1e1e] shadow-sm px-4 py-3"
                  : "ml-auto max-w-sm bg-[#40086d] text-white px-4 py-2"
              } ${
                normalizedSearchTerm && msg.text.toLowerCase().includes(normalizedSearchTerm)
                  ? "ring-2 ring-[#dccaf4] ring-offset-2 ring-offset-transparent"
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
                  <button
                    type="button"
                    onClick={() => navigate("/app/calendar")}
                    className="mt-4 inline-flex items-center rounded bg-[#1e1e1e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#dccaf4] hover:text-[#1a0530]"
                  >
                    Open Calendar
                  </button>
                )}
            </div>
          </div>
        ))}

        {normalizedSearchTerm && visibleMessages.length === 0 && (
          <div className="max-w-2xl rounded border border-dashed border-[rgba(30,30,30,0.1)] bg-white px-5 py-6 text-sm text-gray-500">
            Try another word or clear the search to see the full conversation again.
          </div>
        )}

        {isLoading && (
          <div className="max-w-2xl rounded-2xl px-4 py-3 bg-white border border-[rgba(30,30,30,0.08)] shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#40086d] rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-[#40086d] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-[#40086d] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs">
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
        <div className="px-6 py-4 bg-[#ede0f8] border-t border-[#dccaf4] flex-shrink-0 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Ready to create your content calendar?
              </p>
              <p className="text-xs text-gray-600">
                Marnee will generate a personalized calendar with all the ideas we discussed.
              </p>
            </div>
            <button
              onClick={() => navigate("/app/calendar")}
              className="px-6 py-3 rounded bg-[#1e1e1e] text-white font-medium text-sm hover:bg-[#dccaf4] hover:text-[#1a0530] transition flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Go to Calendar
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-[rgba(30,30,30,0.1)] flex items-center px-6 py-4 gap-3 bg-white flex-shrink-0 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#f6f6f6] border border-[rgba(30,30,30,0.08)] rounded px-4 py-2.5 text-sm text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#40086d] focus:border-transparent"
          placeholder="Type your message here..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <button
          id="send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 rounded bg-[#1e1e1e] flex items-center justify-center text-white hover:bg-[#dccaf4] hover:text-[#1a0530] transition disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-24 right-6 hidden md:block">
        <div className="relative rounded bg-white border border-[rgba(30,30,30,0.1)] shadow px-4 py-3">
          <p className="text-xs text-gray-500 mb-2">
            {isLoading ? "Marnee is thinking..." : "Marnee is here"}
          </p>
          <img
            src={marneeMascot}
            alt="Animated Marnee assistant"
            className={`${mascotClassName} h-20 w-20 object-contain`}
          />
        </div>
      </div>
    </div>
  );
}
