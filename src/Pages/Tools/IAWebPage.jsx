import React, { useState } from "react";

export default function IAWebPage() {
  const [activePage] = useState("ai-content");

  // mensajes hardcodeados
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "ai",
      text: "Hello! I’m your AI Brand Assistant. I’m here to help you develop your brand strategy, create compelling content, and optimize your brand presence. What would you like to work on today?",
    },
    {
      id: 2,
      from: "ai",
      text: "Great news! We received your branding test answers and we are matching them with the current trends in your field. Based on your responses and our analysis of the AI productivity market, I can see some exciting opportunities for your brand positioning.",
    },
    {
      id: 3,
      from: "user",
      text: "That sounds perfect! What did you find from my branding test results?",
    },
    {
      id: 4,
      from: "ai",
      text: "Your test results show a strong alignment with innovation and user empowerment. I'd recommend focusing on three key pillars: Intelligent, Empowering, and Human-centered. We can turn this into a content roadmap if you want.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      from: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    // simulamos respuesta de la IA
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "ai",
          text:
            "Love that. I can draft 3 content angles for you based on your brand personality: 1) Thought-leadership, 2) Educational carousel, 3) Story-based post.",
        },
      ]);
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-black">

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* Top bar / title */}
        <header className="h-14 border-b border-white/5 flex items-center px-6 text-white bg-black">
          <h1 className="text-xl font-semibold">
            {activePage === "ai-content"
              ? "AI Content & Brand Strategist"
              : activePage === "branding-test"
              ? "Branding Test"
              : activePage === "calendar"
              ? "Content Calendar"
              : "My Dashboard"}
          </h1>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-3xl rounded-3xl px-5 py-4 border ${
                msg.from === "ai"
                  ? "bg-transparent border-blue-500/60 text-white"
                  : "ml-auto bg-gradient-to-r from-purple-400 to-blue-400 text-black border-transparent"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="h-16 border-t border-white/5 flex items-center px-6 gap-3 bg-black">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black border border-white/10 rounded-full px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
            placeholder="Type your message here..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center text-2xl text-white hover:opacity-90 transition"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
