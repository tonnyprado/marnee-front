import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { useMarnee } from "../../context/MarneeContext";
import StepIndicator from "../../Component/StepIndicator";
import ApprovalButtons from "../../Component/ApprovalButtons";

export default function IAWebPage() {
  const {
    founderId,
    sessionId,
    currentStep,
    messages,
    welcomeMessage,
    addMessage,
    setMessages,
    updateStep,
    getMessagesForApi,
    hasSession,
  } = useMarnee();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show welcome message on first load
  useEffect(() => {
    if (welcomeMessage && messages.length === 0) {
      addMessage({
        id: Date.now(),
        from: "ai",
        text: welcomeMessage,
        step: 1,
        needsApproval: false,
      });
    }
  }, [welcomeMessage, messages.length, addMessage]);

  // Send message to Marnee
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message immediately
    addMessage({
      id: Date.now(),
      from: "user",
      text: userMessage,
      step: currentStep,
    });

    setIsLoading(true);

    try {
      const response = await api.sendMessage({
        founderId,
        sessionId,
        message: userMessage,
        messages: getMessagesForApi(),
      });

      // Add AI response
      addMessage({
        id: Date.now() + 1,
        from: "ai",
        text: response.reply,
        step: response.currentStep,
        stepName: response.stepName,
        needsApproval: detectNeedsApproval(response.reply, response.currentStep),
      });

      // Update step if changed
      if (response.currentStep !== currentStep) {
        updateStep(response.currentStep);
      }
    } catch (err) {
      setError(err.message || "Failed to send message");
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  // Detect if message needs approval buttons
  const detectNeedsApproval = (text, step) => {
    const approvalKeywords = [
      "recommend",
      "suggest",
      "propose",
      "would you like",
      "do you approve",
      "does this work",
      "what do you think",
      "here's my recommendation",
      "i'd suggest",
    ];
    const lowerText = text.toLowerCase();
    return approvalKeywords.some((keyword) => lowerText.includes(keyword));
  };

  // Handle approval
  const handleApprove = async (decision) => {
    setIsLoading(true);
    try {
      const response = await api.approveStep({
        sessionId,
        step: currentStep,
        decision,
      });

      // Add transition message
      if (response.transitionMessage) {
        addMessage({
          id: Date.now(),
          from: "ai",
          text: response.transitionMessage,
          step: response.currentStep,
          needsApproval: false,
        });
      }

      // Update step if advanced
      if (response.advanced && response.currentStep !== currentStep) {
        updateStep(response.currentStep);
      }

      // Remove approval buttons from last AI message
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 2 ? { ...msg, needsApproval: false } : msg
        )
      );
    } catch (err) {
      setError(err.message || "Failed to approve step");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adjust - send as a regular message
  const handleAdjust = async (adjustmentText) => {
    setInput(adjustmentText);
    // Remove approval buttons from last AI message
    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === prev.length - 1 && msg.from === "ai"
          ? { ...msg, needsApproval: false }
          : msg
      )
    );
    // Trigger send
    setTimeout(() => {
      document.getElementById("send-btn")?.click();
    }, 100);
  };

  // Handle skip
  const handleSkip = async () => {
    await handleApprove({ skipped: true });
  };

  // Get decision object based on current step
  const getDecisionForStep = () => {
    switch (currentStep) {
      case 1:
        return { involvementLevel: "on_camera" };
      case 2:
        return { coreNiche: "", positioning: "" };
      case 3:
        return { postsPerWeek: 3, bestDays: [] };
      case 4:
        return { contentPillars: [], contentAngles: [] };
      case 5:
        return { calendarApproved: true };
      default:
        return {};
    }
  };

  // Show message if no session
  if (!hasSession) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Your Brand Test First
          </h2>
          <p className="text-gray-500 mb-6">
            To chat with Marnee, you need to complete the brand personality test.
          </p>
          <a
            href="/brand-test/questions"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium hover:from-purple-700 hover:to-pink-600 transition inline-block shadow-lg shadow-purple-500/25"
          >
            Start Brand Test
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col">
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} />

      {/* Chat Header */}
      <header className="h-14 border-b border-gray-100 flex items-center px-6 text-gray-900 bg-white">
        <h1 className="text-xl font-semibold">Chat with Marnee</h1>
        <span className="ml-auto text-sm text-gray-500">
          Step {currentStep} of 5
        </span>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={msg.id}>
            <div
              className={`max-w-3xl rounded-2xl px-5 py-4 ${
                msg.from === "ai"
                  ? "bg-white border border-gray-100 text-gray-800 shadow-sm"
                  : "ml-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white"
              }`}
            >
              {msg.text}
            </div>

            {/* Approval buttons for AI messages that need approval */}
            {msg.from === "ai" &&
              msg.needsApproval &&
              idx === messages.length - 1 && (
                <ApprovalButtons
                  onApprove={handleApprove}
                  onAdjust={handleAdjust}
                  onSkip={handleSkip}
                  disabled={isLoading}
                  decision={getDecisionForStep()}
                />
              )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="max-w-3xl rounded-2xl px-5 py-4 bg-white border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="max-w-3xl p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
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

      {/* Input bar */}
      <div className="h-20 border-t border-gray-100 flex items-center px-6 gap-3 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Type your message here..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          disabled={isLoading}
        />
        <button
          id="send-btn"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white hover:from-purple-700 hover:to-pink-600 transition disabled:opacity-50 shadow-lg shadow-purple-500/25"
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
    </div>
  );
}
