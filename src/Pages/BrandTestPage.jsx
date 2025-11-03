import React, { useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Getting to know yourself as a leader",
    question:
      "If your team had to describe you in three words, which ones do you think they would choose?",
    subtitle: "(If you are a solopreneur, just pick the one that best matches you.)",
    options: [
      "Confident, approachable, decisive",
      "Inspirational, strategic, empathetic",
      "Visionary, honest, motivating",
      "OTHER",
    ],
  },
  {
    id: 2,
    title: "Your connection with others",
    question:
      "How do you usually communicate your ideas to clients or your audience?",
    subtitle: "Choose the style that feels more like you.",
    options: [
      "Direct and concise",
      "Storytelling / emotional",
      "Educational / step-by-step",
      "OTHER",
    ],
  },
  {
    id: 3,
    title: "Identifying strengths and areas for improvement",
    question: "Which area do you feel is your strongest brand asset right now?",
    subtitle: "",
    options: [
      "My personal story / origin",
      "My expertise / credibility",
      "My visual style",
      "My community / people",
    ],
  },
  {
    id: 4,
    title: "Trust & Feedback",
    question:
      "What do people thank you for the most when working with you or buying from you?",
    subtitle: "",
    options: [
      "Clarity and guidance",
      "Motivation and confidence",
      "Creativity and originality",
      "Speed and efficiency",
    ],
  },
  {
    id: 5,
    title: "Your business and its connection with you",
    question:
      "How aligned do you feel your current business/content is with who you really are?",
    subtitle: "",
    options: [
      "Fully aligned — it’s ME",
      "Mostly aligned, needs refinement",
      "Somewhat aligned, I need a reset",
      "Not aligned, I want a rebrand",
    ],
  },
  {
    id: 6,
    title: "Growth mindset & resilience",
    question: "When you face a challenge in your brand, what’s your first move?",
    subtitle: "",
    options: [
      "Analyze data and make a plan",
      "Ask my audience / community",
      "Test new creative ideas fast",
      "Pause, journal, and realign",
    ],
  },
  {
    id: 7,
    title: "Public presence",
    question:
      "How comfortable do you feel being the face of your brand (on video, social, events)?",
    subtitle: "",
    options: [
      "Very comfortable — I love it",
      "Comfortable, but I need structure",
      "I can do it, but I hesitate",
      "I prefer not to show up",
    ],
  },
  {
    id: 8,
    title: "Problem-solving",
    question:
      "What’s the biggest branding problem you want our AI to help you with?",
    subtitle: "",
    options: [
      "Define my brand voice & tone",
      "Create consistent content ideas",
      "Clarify my positioning",
      "Design a launch / campaign",
    ],
  },
  {
    id: 9,
    title: "Tell us about yourself & lifestyle",
    question:
      "Which vibe do you want your brand to project more often?",
    subtitle: "",
    options: [
      "Premium / sophisticated",
      "Friendly / approachable",
      "Bold / disruptive",
      "Spiritual / conscious",
    ],
  },
];

export default function BrandTestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  // guardamos las respuestas por índice de step
  const [answers, setAnswers] = useState({});
  const [otherText, setOtherText] = useState("");

  const step = STEPS[currentStep];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const handleOptionSelect = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentStep]: option,
    }));
    // limpiar other si elige otra opción
    if (option !== "OTHER") setOtherText("");
  };

  const handleNext = () => {
    // si estamos en el último → redirigimos
    if (currentStep === STEPS.length - 1) {
      window.location.href = "/app"; // cambia esta ruta por tu página principal
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 backdrop-blur-sm border-r border-white/5 p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-1">Personal Brand Test</h2>
        <p className="text-xs text-gray-400 mb-6">
          ⏱ This test may take between 20 and 30 minutes to complete.
        </p>

        <p className="text-xs text-gray-400 mb-3 tracking-wide">PROGRESS</p>
        <div className="space-y-3 overflow-y-auto">
          {STEPS.map((s, idx) => {
            const isActive = idx === currentStep;
            return (
            <div
              key={s.id}
              className={`flex gap-3 items-start rounded-lg cursor-pointer transition ${
                isActive ? "bg-white/10" : "hover:bg-white/5"
              } p-2`}
              onClick={() => setCurrentStep(idx)}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-gray-200"
                }`}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm leading-tight">{s.title}</p>
              </div>
            </div>
            );
          })}
        </div>

        {/* bottom progress text */}
        <div className="mt-auto pt-6">
          <div className="text-xs text-gray-400 mb-1">
            Step {currentStep + 1} of {STEPS.length}
          </div>
          <div className="w-full h-1 bg-white/5 rounded">
            <div
              className="h-1 bg-blue-400 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">
            {progress}%
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full pt-12 pb-32 px-6">
          {/* Step header */}
          <p className="text-xs tracking-widest text-purple-300 mb-3 uppercase">
            Step {currentStep + 1} • {step.title}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {step.question}
          </h1>
          {step.subtitle && (
            <p className="text-gray-400 mb-8">{step.subtitle}</p>
          )}

          {/* Options */}
          <div className="space-y-4">
            {step.options.map((option) => {
              const selected = answers[currentStep] === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left border rounded-xl px-5 py-4 flex items-center gap-3 transition ${
                    selected
                      ? "border-blue-400 bg-blue-400/5"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      selected
                        ? "border-blue-400 bg-blue-400"
                        : "border-gray-500"
                    }`}
                  >
                    {selected && (
                      <span className="w-2 h-2 bg-black rounded-full" />
                    )}
                  </span>
                  <span className="text-sm">{option}</span>
                </button>
              );
            })}

            {/* OTHER input */}
            {answers[currentStep] === "OTHER" && (
              <input
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Please specify your words..."
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div className="fixed bottom-0 left-72 right-0 bg-black/60 border-t border-white/5 backdrop-blur-sm px-8 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-5 py-2 rounded-lg border text-sm ${
              currentStep === 0
                ? "border-white/10 text-gray-500 cursor-not-allowed"
                : "border-white/10 text-white hover:bg-white/5"
            }`}
          >
            ← Back
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-400 text-black font-semibold text-sm hover:opacity-90 transition"
          >
            {currentStep === STEPS.length - 1 ? "Finish" : "Next →"}
          </button>
        </div>
      </main>
    </div>
  );
}
