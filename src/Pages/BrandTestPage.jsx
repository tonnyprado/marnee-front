import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useMarnee } from "../context/MarneeContext";

// Question types: radio, multiSelect, textarea, slider
const STEPS = [
  // =====================
  // SECTION 1: Identity & Leadership (6 questions)
  // =====================
  {
    id: 1,
    section: "Identity & Leadership",
    field: "teamDescriptionWords",
    title: "Getting to know yourself as a leader",
    question: "If your team had to describe you in three words, which ones would they choose?",
    subtitle: "Select up to 3 words that best describe you.",
    type: "multiSelect",
    maxSelect: 3,
    options: [
      "Creative", "Driven", "Empathetic", "Confident", "Approachable",
      "Decisive", "Inspirational", "Strategic", "Visionary", "Honest",
      "Motivating", "Analytical", "Calm", "Energetic", "Authentic"
    ],
  },
  {
    id: 2,
    section: "Identity & Leadership",
    field: "personalValues",
    title: "Your core values",
    question: "What are your top personal values that guide your business?",
    subtitle: "Select up to 5 values.",
    type: "multiSelect",
    maxSelect: 5,
    options: [
      "Authenticity", "Growth", "Family", "Freedom", "Creativity",
      "Impact", "Integrity", "Innovation", "Excellence", "Community",
      "Balance", "Adventure", "Service", "Courage", "Wisdom"
    ],
  },
  {
    id: 3,
    section: "Identity & Leadership",
    field: "decisionStyle",
    title: "Decision making style",
    question: "When facing an important business decision, what's your natural approach?",
    subtitle: "",
    type: "radio",
    options: [
      { value: "act_quickly", label: "I tend to act quickly and trust my gut" },
      { value: "explore_first", label: "I prefer to explore all options first" },
    ],
  },
  {
    id: 4,
    section: "Identity & Leadership",
    field: "focusType",
    title: "Your focus style",
    question: "In your work, do you naturally focus more on the big picture or practical details?",
    subtitle: "",
    type: "radio",
    options: [
      { value: "big_picture", label: "Big picture - I think about vision and strategy" },
      { value: "practical_details", label: "Practical details - I focus on execution" },
    ],
  },
  {
    id: 5,
    section: "Identity & Leadership",
    field: "leadershipStyle",
    title: "Leadership style",
    question: "How would you describe your relationship with your team or clients?",
    subtitle: "",
    type: "radio",
    options: [
      { value: "closeness", label: "I build close, personal relationships" },
      { value: "professional_distance", label: "I maintain a professional distance" },
    ],
  },
  {
    id: 6,
    section: "Identity & Leadership",
    field: "toughDecisionApproach",
    title: "Tough decisions",
    question: "When you face a tough decision, how do you typically handle it?",
    subtitle: "Describe your process in a few sentences.",
    type: "textarea",
    placeholder: "e.g., I consult my team, sleep on it, and trust my intuition...",
  },

  // =====================
  // SECTION 2: Social & Exposure (4 questions)
  // =====================
  {
    id: 7,
    section: "Social & Exposure",
    field: "socialMediaComfort",
    title: "Social media presence",
    question: "How do you feel about showing up on social media as the face of your brand?",
    subtitle: "Be honest about your comfort level.",
    type: "textarea",
    placeholder: "e.g., I feel nervous but know it's necessary, or I love it and do it naturally...",
  },
  {
    id: 8,
    section: "Social & Exposure",
    field: "publicSpeakingComfort",
    title: "Public speaking comfort",
    question: "On a scale of 1-10, how comfortable are you with public speaking or being on camera?",
    subtitle: "1 = Very uncomfortable, 10 = Completely natural",
    type: "slider",
    min: 1,
    max: 10,
  },
  {
    id: 9,
    section: "Social & Exposure",
    field: "fearOfJudgment",
    title: "Fear of judgment",
    question: "Do you ever worry about being judged when putting yourself out there?",
    subtitle: "Share your honest thoughts.",
    type: "textarea",
    placeholder: "e.g., Yes, I worry about looking unprofessional, or No, I've learned to embrace it...",
  },
  {
    id: 10,
    section: "Social & Exposure",
    field: "firstImpression",
    title: "First impressions",
    question: "What do people usually say about their first impression of you?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., People say I'm warm and approachable, or They find me intense but inspiring...",
  },

  // =====================
  // SECTION 3: Business Story (5 questions)
  // =====================
  {
    id: 11,
    section: "Business Story",
    field: "whyFoundedBusiness",
    title: "Your origin story",
    question: "Why did you start your business?",
    subtitle: "Share the story behind your entrepreneurial journey.",
    type: "textarea",
    placeholder: "e.g., I saw a gap in the market for..., or After years of frustration with...",
  },
  {
    id: 12,
    section: "Business Story",
    field: "personalStoryInfluence",
    title: "Personal influences",
    question: "How has your personal story shaped your business or brand?",
    subtitle: "Think about experiences, family, challenges that influenced you.",
    type: "textarea",
    placeholder: "e.g., Growing up, my parents taught me..., or After going through...",
  },
  {
    id: 13,
    section: "Business Story",
    field: "businessStoryAndDifferentiator",
    title: "Your differentiator",
    question: "What makes your business unique? What's your key differentiator?",
    subtitle: "What sets you apart from competitors?",
    type: "textarea",
    placeholder: "e.g., We're the only ones who..., or Unlike others, we focus on...",
  },
  {
    id: 14,
    section: "Business Story",
    field: "futurePerception",
    title: "Future vision",
    question: "How do you want people to perceive your brand in the future?",
    subtitle: "Think 3-5 years from now.",
    type: "textarea",
    placeholder: "e.g., The go-to brand for..., or The most trusted name in...",
  },
  {
    id: 15,
    section: "Business Story",
    field: "desiredLegacy",
    title: "Your legacy",
    question: "What legacy do you want to leave with your business?",
    subtitle: "What do you want to be remembered for?",
    type: "textarea",
    placeholder: "e.g., I want to be remembered for helping people..., or For pioneering...",
  },

  // =====================
  // SECTION 4: Expertise (4 questions)
  // =====================
  {
    id: 16,
    section: "Expertise",
    field: "topicsConfidentTeaching",
    title: "Your expertise",
    question: "What topics do you feel most confident teaching or talking about?",
    subtitle: "Select all that apply.",
    type: "multiSelect",
    maxSelect: 5,
    options: [
      "Branding", "Leadership", "Design", "Marketing", "Sales",
      "Productivity", "Mindset", "Finance", "Technology", "Strategy",
      "Creativity", "Communication", "Health & Wellness", "Relationships", "Personal Growth"
    ],
  },
  {
    id: 17,
    section: "Expertise",
    field: "topicsPeopleAskAbout",
    title: "What people ask you",
    question: "What do people often ask you for advice about?",
    subtitle: "Select topics people frequently consult you on.",
    type: "multiSelect",
    maxSelect: 5,
    options: [
      "How to start a business", "Marketing tips", "Career advice", "Leadership",
      "Work-life balance", "Creative projects", "Personal branding", "Technology",
      "Investments", "Relationships", "Health habits", "Productivity hacks"
    ],
  },
  {
    id: 18,
    section: "Expertise",
    field: "contentExperience",
    title: "Content experience",
    question: "What's your current experience with creating content?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., Some videos and photos for Instagram, or I've been blogging for 3 years...",
  },
  {
    id: 19,
    section: "Expertise",
    field: "mainSocialPlatforms",
    title: "Your platforms",
    question: "Which social media platforms do you mainly use for your brand?",
    subtitle: "Select all platforms you actively use.",
    type: "multiSelect",
    maxSelect: 5,
    options: [
      "Instagram", "TikTok", "LinkedIn", "YouTube", "Twitter/X",
      "Facebook", "Pinterest", "Threads", "Substack", "Newsletter"
    ],
  },

  // =====================
  // SECTION 5: Style (2 questions)
  // =====================
  {
    id: 20,
    section: "Style",
    field: "signatureStyle",
    title: "Your signature",
    question: "Is there something that makes you visually recognizable? A signature style?",
    subtitle: "Think about accessories, colors, or habits people associate with you.",
    type: "textarea",
    placeholder: "e.g., Always wear my blue glasses, or I'm known for my colorful outfits...",
  },
  {
    id: 21,
    section: "Style",
    field: "otherPassions",
    title: "Beyond business",
    question: "What other passions or interests do you have outside of work?",
    subtitle: "Select all that resonate with you.",
    type: "multiSelect",
    maxSelect: 5,
    options: [
      "Photography", "Travel", "Coffee/Food", "Fitness", "Reading",
      "Art", "Music", "Nature", "Technology", "Gaming",
      "Fashion", "Spirituality", "Sports", "Cooking", "Writing"
    ],
  },
];

// Group steps by section for sidebar
const SECTIONS = [...new Set(STEPS.map(s => s.section))];

export default function BrandTestPage() {
  const navigate = useNavigate();
  const { initSession } = useMarnee();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const step = STEPS[currentStep];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  // Handle radio selection
  const handleRadioSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [step.field]: value,
    }));
  };

  // Handle multi-select toggle
  const handleMultiSelect = (option) => {
    const current = answers[step.field] || [];
    const isSelected = current.includes(option);

    if (isSelected) {
      setAnswers((prev) => ({
        ...prev,
        [step.field]: current.filter((o) => o !== option),
      }));
    } else if (current.length < (step.maxSelect || 99)) {
      setAnswers((prev) => ({
        ...prev,
        [step.field]: [...current, option],
      }));
    }
  };

  // Handle textarea change
  const handleTextChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [step.field]: value,
    }));
  };

  // Handle slider change
  const handleSliderChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [step.field]: parseInt(value, 10),
    }));
  };

  // Build payload for API
  const buildPayload = () => {
    // Convert multiSelect arrays to lowercase for backend
    const payload = {};

    STEPS.forEach((s) => {
      const value = answers[s.field];
      if (value !== undefined && value !== null && value !== '') {
        if (s.type === 'multiSelect' && Array.isArray(value)) {
          payload[s.field] = value.map((v) => v.toLowerCase().replace(/\s+/g, '_'));
        } else if (s.type === 'radio' && typeof value === 'string') {
          payload[s.field] = value;
        } else {
          payload[s.field] = value;
        }
      }
    });

    return payload;
  };

  // Submit questionnaire
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = buildPayload();
      const response = await api.submitQuestionnaire(payload);

      // Initialize session with response
      initSession({
        founderId: response.founderId,
        sessionId: response.sessionId,
        welcomeMessage: response.welcomeMessage,
      });

      // Navigate to chat
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Failed to submit questionnaire');
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  // Render input based on type
  const renderInput = () => {
    switch (step.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {step.options.map((option) => {
              const selected = answers[step.field] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRadioSelect(option.value)}
                  className={`w-full text-left border rounded-xl px-5 py-4 flex items-center gap-3 transition ${
                    selected
                      ? "border-blue-400 bg-blue-400/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                      selected ? "border-blue-400 bg-blue-400" : "border-gray-500"
                    }`}
                  >
                    {selected && <span className="w-2 h-2 bg-black rounded-full" />}
                  </span>
                  <span className="text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>
        );

      case 'multiSelect':
        const selectedItems = answers[step.field] || [];
        return (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {step.options.map((option) => {
                const isSelected = selectedItems.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleMultiSelect(option)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      isSelected
                        ? "border-blue-400 bg-blue-400/20 text-blue-300"
                        : "border-white/20 hover:border-white/40 text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {step.maxSelect && (
              <p className="text-xs text-gray-500">
                Selected: {selectedItems.length}/{step.maxSelect}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={answers[step.field] || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={step.placeholder}
            rows={4}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        );

      case 'slider':
        const sliderValue = answers[step.field] || step.min;
        return (
          <div className="space-y-4">
            <input
              type="range"
              min={step.min}
              max={step.max}
              value={sliderValue}
              onChange={(e) => handleSliderChange(e.target.value)}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{step.min}</span>
              <span className="text-2xl text-blue-400 font-bold">{sliderValue}</span>
              <span>{step.max}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 backdrop-blur-sm border-r border-white/5 p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-1">Personal Brand Test</h2>
        <p className="text-xs text-gray-400 mb-6">
          Complete all sections to unlock your AI brand strategist.
        </p>

        <p className="text-xs text-gray-400 mb-3 tracking-wide">SECTIONS</p>
        <div className="space-y-2 overflow-y-auto flex-1">
          {SECTIONS.map((section) => {
            const sectionSteps = STEPS.filter((s) => s.section === section);
            const sectionStart = STEPS.findIndex((s) => s.section === section);
            const isActive = step.section === section;
            const completedInSection = sectionSteps.filter(
              (s) => answers[s.field] !== undefined && answers[s.field] !== ''
            ).length;

            return (
              <div
                key={section}
                className={`rounded-lg p-3 cursor-pointer transition ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
                onClick={() => setCurrentStep(sectionStart)}
              >
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {section}
                  </p>
                  <span className="text-xs text-gray-500">
                    {completedInSection}/{sectionSteps.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="pt-6 border-t border-white/10 mt-4">
          <div className="text-xs text-gray-400 mb-1">
            Question {currentStep + 1} of {STEPS.length}
          </div>
          <div className="w-full h-1 bg-white/5 rounded">
            <div
              className="h-1 bg-blue-400 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-400 mt-1">{progress}%</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full pt-12 pb-32 px-6">
          {/* Section tag */}
          <p className="text-xs tracking-widest text-purple-300 mb-3 uppercase">
            {step.section} • Question {currentStep + 1}
          </p>

          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{step.question}</h1>
          {step.subtitle && <p className="text-gray-400 mb-8">{step.subtitle}</p>}

          {/* Input */}
          <div className="mt-6">{renderInput()}</div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="fixed bottom-0 left-72 right-0 bg-black/80 border-t border-white/5 backdrop-blur-sm px-8 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-5 py-2 rounded-lg border text-sm ${
              currentStep === 0
                ? "border-white/10 text-gray-500 cursor-not-allowed"
                : "border-white/10 text-white hover:bg-white/5"
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-400 text-black font-semibold text-sm hover:opacity-90 transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? 'Submitting...'
              : currentStep === STEPS.length - 1
              ? 'Finish'
              : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
}
