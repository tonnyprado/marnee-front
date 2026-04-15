import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

// Question types: radio, textarea, url, multiSelect (tags), select
const STEPS = [
  // =====================
  // SECTION 1: Business Context (3 questions)
  // =====================
  {
    id: 1,
    section: "Business Context",
    field: "businessDescription",
    title: "Describe your business",
    question: "In one sentence, how would you describe your business?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., We help SaaS companies scale their content marketing...",
    required: true,
  },
  {
    id: 2,
    section: "Business Context",
    field: "websiteUrl",
    title: "Website",
    question: "Do you have a website?",
    subtitle: "If yes, please share the URL",
    type: "url",
    placeholder: "https://example.com",
    required: false,
  },
  {
    id: 3,
    section: "Business Context",
    field: "businessStage",
    title: "Business stage",
    question: "What stage are you currently at?",
    subtitle: "",
    type: "radio",
    required: true,
    options: [
      { value: "idea", label: "Idea" },
      { value: "validation", label: "Validation" },
      { value: "first_clients", label: "First Clients" },
      { value: "already_selling", label: "Already Selling" },
    ],
  },

  // =====================
  // SECTION 2: Business Model (4 questions) - KEY SECTION
  // =====================
  {
    id: 4,
    section: "Business Model",
    field: "businessFocus",
    title: "Business focus",
    question: "Is your main focus B2B, B2C, or both?",
    subtitle: "This is critical for determining your marketing strategy",
    type: "radio",
    required: true,
    options: [
      { value: "b2b", label: "B2B" },
      { value: "b2c", label: "B2C" },
      { value: "both", label: "Both" },
    ],
  },
  {
    id: 5,
    section: "Business Model",
    field: "priorityFocus",
    title: "Priority focus",
    question: "Which one do you want to prioritise right now?",
    subtitle: "Since you selected 'Both', tell us where to focus first",
    type: "radio",
    required: false,
    showIf: { field: "businessFocus", value: "both" },
    options: [
      { value: "b2b", label: "B2B" },
      { value: "b2c", label: "B2C" },
    ],
  },
  {
    id: 6,
    section: "Business Model",
    field: "revenueGeneration",
    title: "Revenue generation",
    question: "How do you generate revenue exactly?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., Monthly subscriptions, one-time purchases, consulting fees...",
    required: true,
  },
  {
    id: 7,
    section: "Business Model",
    field: "servicesProductsDescription",
    title: "Services/Products",
    question: "What type of services/products do you want to market?",
    subtitle: "Describe what you're selling",
    type: "textarea",
    placeholder: "Describe your main offering...",
    required: true,
  },

  // =====================
  // SECTION 3: Core Offer (3 questions)
  // =====================
  {
    id: 8,
    section: "Core Offer",
    field: "mainBenefit",
    title: "Main benefit",
    question: "What is the main benefit your customer gets from your main product/service?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., Save 10 hours per week, increase revenue by 30%...",
    required: true,
  },
  {
    id: 9,
    section: "Core Offer",
    field: "differentiator",
    title: "Your differentiator",
    question: "What makes your offer different from competitors?",
    subtitle: "What's your unique selling proposition?",
    type: "textarea",
    placeholder: "e.g., We're the only ones who..., Unlike others, we focus on...",
    required: true,
  },
  {
    id: 10,
    section: "Core Offer",
    field: "promisedResult",
    title: "Promised result",
    question: "What result are you promising your client?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., Double your traffic in 6 months...",
    required: true,
  },

  // =====================
  // SECTION 4: Ideal Customer (3 questions)
  // =====================
  {
    id: 11,
    section: "Ideal Customer",
    field: "idealCustomer",
    title: "Ideal customer profile",
    question: "Who is your ideal customer right now?",
    subtitle: "Be specific: demographics, company size, role, pain points...",
    type: "textarea",
    placeholder: "e.g., B2B SaaS companies with $1M-$10M ARR...",
    required: true,
  },
  {
    id: 12,
    section: "Ideal Customer",
    field: "customerLocation",
    title: "Where to find them",
    question: "Where can we find these people?",
    subtitle: "Events, platforms, communities...",
    type: "textarea",
    placeholder: "e.g., LinkedIn, Instagram, specific events, communities...",
    required: true,
  },
  {
    id: 13,
    section: "Ideal Customer",
    field: "whyChooseYou",
    title: "Why you?",
    question: "Why do you think they would choose you?",
    subtitle: "",
    type: "textarea",
    placeholder: "What makes you the best choice for them?",
    required: true,
  },

  // =====================
  // SECTION 5: Positioning & Market (4 questions)
  // =====================
  {
    id: 14,
    section: "Positioning & Market",
    field: "mainCompetitors",
    title: "Competitors",
    question: "Who are your main competitors?",
    subtitle: "List your top 3-5 competitors",
    type: "textarea",
    placeholder: "e.g., Company A, Company B, in-house teams...",
    required: false,
  },
  {
    id: 15,
    section: "Positioning & Market",
    field: "associatedKeywords",
    title: "Keywords",
    question: "What keywords do you associate with your business?",
    subtitle: "Add keywords that describe your business (select up to 10)",
    type: "multiSelect",
    maxSelect: 10,
    options: [
      "Marketing", "Content", "SaaS", "B2B", "B2C", "E-commerce",
      "Technology", "AI", "Automation", "Analytics", "Design",
      "Branding", "Strategy", "Social Media", "SEO", "Consulting",
      "Education", "Health", "Finance", "Real Estate", "Other"
    ],
    required: false,
  },
  {
    id: 16,
    section: "Positioning & Market",
    field: "brandDiscoveryPreference",
    title: "Brand discovery",
    question: "How would you like people to find your brand?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., Through Google search, social media, referrals...",
    required: false,
  },
  {
    id: 17,
    section: "Positioning & Market",
    field: "tagline",
    title: "Tagline",
    question: "Do you already have a tagline or key message?",
    subtitle: "",
    type: "textarea",
    placeholder: "Your brand's tagline or main message...",
    required: false,
  },

  // =====================
  // SECTION 6: Branding & Assets (2 questions)
  // =====================
  {
    id: 18,
    section: "Branding & Assets",
    field: "website",
    title: "Website",
    question: "Do you have a website?",
    subtitle: "If yes, please share the URL",
    type: "url",
    placeholder: "https://example.com",
    required: false,
  },
  {
    id: 19,
    section: "Branding & Assets",
    field: "hasBrandGuidelines",
    title: "Brand guidelines",
    question: "Do you have brand guidelines?",
    subtitle: "",
    type: "radio",
    required: false,
    options: [
      { value: "yes", label: "Yes, I have brand guidelines" },
      { value: "no", label: "No, I don't have brand guidelines" },
    ],
  },

  // =====================
  // SECTION 7: Marketing & Channels (1 question)
  // =====================
  {
    id: 20,
    section: "Marketing & Channels",
    field: "currentClientAcquisition",
    title: "Client acquisition",
    question: "How are you currently getting clients?",
    subtitle: "If applicable",
    type: "textarea",
    placeholder: "e.g., Referrals, paid ads, cold outreach, content marketing...",
    required: false,
  },

  // =====================
  // SECTION 8: Content & Execution (3 questions)
  // =====================
  {
    id: 21,
    section: "Content & Execution",
    field: "contentCreationExperience",
    title: "Content experience",
    question: "Do you have experience creating content?",
    subtitle: "",
    type: "textarea",
    placeholder: "Describe your experience with video, photos, podcasts, writing...",
    required: false,
  },
  {
    id: 22,
    section: "Content & Execution",
    field: "teamContentCreator",
    title: "Team content creators",
    question: "Is there anyone in your team creating content?",
    subtitle: "",
    type: "radio",
    required: false,
    options: [
      { value: "yes", label: "Yes, we have content creators on the team" },
      { value: "no", label: "No, we don't have content creators yet" },
    ],
  },
  {
    id: 23,
    section: "Content & Execution",
    field: "interestedInPersonalBrand",
    title: "Personal brand",
    question: "Are you interested in building a personal brand as well?",
    subtitle: "",
    type: "radio",
    required: false,
    options: [
      { value: "yes", label: "Yes, I want to build my personal brand" },
      { value: "no", label: "No, just focus on the business brand" },
    ],
  },

  // =====================
  // SECTION 9: Growth & Priorities (3 questions)
  // =====================
  {
    id: 24,
    section: "Growth & Priorities",
    field: "mainPriority",
    title: "Main priority",
    question: "What is your main priority right now?",
    subtitle: "",
    type: "radio",
    required: true,
    options: [
      { value: "getting_clients", label: "Getting clients" },
      { value: "building_awareness", label: "Building brand awareness" },
      { value: "validating_idea", label: "Validating the idea" },
    ],
  },
  {
    id: 25,
    section: "Growth & Priorities",
    field: "marketingBudget",
    title: "Marketing budget",
    question: "What is your budget for doing marketing?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., $5,000/month, $50K/year, bootstrapped...",
    required: false,
  },
  {
    id: 26,
    section: "Growth & Priorities",
    field: "upcomingEvents",
    title: "Upcoming events",
    question: "Are there any upcoming launches, events, or important dates?",
    subtitle: "",
    type: "textarea",
    placeholder: "e.g., Product launch in Q2, conference in May...",
    required: false,
  },
];

// Group steps by section for sidebar
const SECTIONS = [...new Set(STEPS.map(s => s.section))];

export default function BusinessTestPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [founderId, setFounderId] = useState(null);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Get founder ID
      const founder = await api.getMeFounder();
      setFounderId(founder.id);

      // Try to load existing business test
      try {
        const existingTest = await api.getBusinessTestMe();
        if (existingTest) {
          // Pre-fill answers with existing data
          const prefilledAnswers = {};
          STEPS.forEach((step) => {
            const value = existingTest[step.field];
            if (value !== undefined && value !== null && value !== '') {
              // Convert boolean values back to "yes"/"no" for radio buttons
              if (step.type === 'radio' && step.field === 'hasBrandGuidelines') {
                prefilledAnswers[step.field] = value ? 'yes' : 'no';
              } else if (step.type === 'radio' && step.field === 'teamContentCreator') {
                prefilledAnswers[step.field] = value ? 'yes' : 'no';
              } else if (step.type === 'radio' && step.field === 'interestedInPersonalBrand') {
                prefilledAnswers[step.field] = value ? 'yes' : 'no';
              } else {
                prefilledAnswers[step.field] = value;
              }
            }
          });
          setAnswers(prefilledAnswers);
        }
      } catch (error) {
        if (error.status === 404) {
          // First-time users won't have a business test yet.
          console.log("No existing business test found, starting fresh");
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load existing data");
    } finally {
      setLoading(false);
    }
  };

  const step = STEPS[currentStep];
  const progress = Math.round(((currentStep + 1) / STEPS.length) * 100);

  // Check if step should be shown based on showIf condition
  const shouldShowStep = (step) => {
    if (!step.showIf) return true;
    return answers[step.showIf.field] === step.showIf.value;
  };

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

  // Handle textarea/url change
  const handleTextChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [step.field]: value,
    }));
  };

  // Build payload for API
  const buildPayload = () => {
    const payload = { founderId };

    STEPS.forEach((s) => {
      const value = answers[s.field];
      if (value !== undefined && value !== null && value !== '') {
        // Convert "yes"/"no" back to boolean for specific fields
        if (s.field === 'hasBrandGuidelines' && s.type === 'radio') {
          payload[s.field] = value === 'yes';
        } else if (s.field === 'teamContentCreator' && s.type === 'radio') {
          payload[s.field] = value === 'yes';
        } else if (s.field === 'interestedInPersonalBrand' && s.type === 'radio') {
          payload[s.field] = value === 'yes';
        } else {
          payload[s.field] = value;
        }
      }
    });

    return payload;
  };

  // Save progress (can be called after each section or at the end)
  const saveProgress = async () => {
    try {
      const payload = buildPayload();
      await api.submitBusinessTest(payload);
    } catch (error) {
      console.error("Error saving progress:", error);
      throw error;
    }
  };

  // Submit questionnaire
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await saveProgress();

      // Check if we should initialize a session or just navigate
      // For now, let's just navigate to the app
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Failed to submit business test');
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
      return;
    }

    // Move to next step (skip hidden steps)
    let nextStep = currentStep + 1;
    while (nextStep < STEPS.length && !shouldShowStep(STEPS[nextStep])) {
      nextStep++;
    }

    if (nextStep < STEPS.length) {
      setCurrentStep(nextStep);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/test-selection');
      return;
    }

    // Move to previous step (skip hidden steps)
    let prevStep = currentStep - 1;
    while (prevStep >= 0 && !shouldShowStep(STEPS[prevStep])) {
      prevStep--;
    }

    if (prevStep >= 0) {
      setCurrentStep(prevStep);
    }
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
                  className={`w-full text-left border rounded px-5 py-4 flex items-center gap-3 transition ${
                    selected
                      ? "border-[#dccaf4] bg-[#ede0f8]"
                      : "border-[rgba(30,30,30,0.1)] hover:border-[#dccaf4] hover:bg-[#ede0f8]/40"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selected ? "border-[#40086d] bg-[#40086d]" : "border-gray-300"
                    }`}
                  >
                    {selected && <span className="w-2 h-2 bg-white rounded-full" />}
                  </span>
                  <span className="text-sm text-gray-700">{option.label}</span>
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
                    className={`px-4 py-2 rounded border text-sm transition ${
                      isSelected
                        ? "border-[#40086d] bg-[#ede0f8] text-[#40086d]"
                        : "border-[rgba(30,30,30,0.1)] hover:border-[#dccaf4] text-gray-600 hover:bg-[#ede0f8]"
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
      case 'url':
        return (
          <textarea
            value={answers[step.field] || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={step.placeholder}
            rows={step.type === 'url' ? 1 : 4}
            className="w-full bg-[#f6f6f6] border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 text-sm text-[#1e1e1e] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#40086d] focus:border-transparent resize-none transition"
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#dccaf4] border-t-[#40086d] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your business test...</p>
        </div>
      </div>
    );
  }

  // Skip step if showIf condition is not met
  if (!shouldShowStep(step)) {
    // This shouldn't happen due to handleNext/handleBack logic, but as a safeguard
    setTimeout(() => handleNext(), 0);
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#f6f6f6] border-r border-[rgba(30,30,30,0.1)] p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-1 text-gray-900">Business Test</h2>
        <p className="text-xs text-gray-500 mb-6">
          Complete all sections to unlock your personalized marketing campaign.
        </p>

        <p className="text-xs text-gray-400 mb-3 tracking-wide uppercase">Sections</p>
        <div className="space-y-2 overflow-y-auto flex-1">
          {SECTIONS.map((section) => {
            const sectionSteps = STEPS.filter((s) => s.section === section);
            const sectionStart = STEPS.findIndex((s) => s.section === section);
            const isActive = step.section === section;
            const completedInSection = sectionSteps.filter(
              (s) => answers[s.field] !== undefined && answers[s.field] !== '' && answers[s.field] !== null
            ).length;

            return (
              <div
                key={section}
                className={`rounded p-3 cursor-pointer transition ${
                  isActive ? "bg-[#ede0f8] border border-[#dccaf4]" : "hover:bg-white"
                }`}
                onClick={() => setCurrentStep(sectionStart)}
              >
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${isActive ? 'text-[#40086d] font-medium' : 'text-gray-600'}`}>
                    {section}
                  </p>
                  <span className={`text-xs ${isActive ? 'text-[#40086d]' : 'text-gray-400'}`}>
                    {completedInSection}/{sectionSteps.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress */}
        <div className="pt-6 border-t border-[rgba(30,30,30,0.1)] mt-4">
          <div className="text-xs text-gray-500 mb-2">
            Question {currentStep + 1} of {STEPS.length}
          </div>
          <div className="w-full h-2 bg-[rgba(30,30,30,0.08)] rounded-full">
            <div
              className="h-2 bg-[#40086d] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{progress}%</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full pt-12 pb-32 px-6">
          {/* Section tag */}
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-[#ede0f8] text-[#40086d] px-3 py-1 rounded text-xs font-medium">
              {step.section} · Question {currentStep + 1}
            </span>
            {step.required && (
              <span className="text-xs text-red-500 font-medium">* Required</span>
            )}
          </div>

          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">{step.question}</h1>
          {step.subtitle && <p className="text-gray-500 mb-8">{step.subtitle}</p>}

          {/* Input */}
          <div className="mt-6">{renderInput()}</div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="fixed bottom-0 left-72 right-0 bg-white border-t border-[rgba(30,30,30,0.1)] px-8 py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-5 py-2.5 rounded border border-[rgba(30,30,30,0.1)] text-gray-700 hover:bg-[#f6f6f6] text-sm font-medium"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={isSubmitting || (step.required && !answers[step.field])}
            className={`px-6 py-2.5 rounded bg-[#1e1e1e] text-white font-medium text-sm hover:bg-[#dccaf4] hover:text-[#1a0530] transition ${
              (isSubmitting || (step.required && !answers[step.field])) ? 'opacity-50 cursor-not-allowed' : ''
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
