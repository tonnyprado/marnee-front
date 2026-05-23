import React, { useCallback } from "react";
import { api } from "../services/api";
import { useMarnee } from "../context/MarneeContext";
import InteractiveTest from "../Component/InteractiveTest/InteractiveTest";

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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
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

export default function BusinessTestPage() {
  const { founderId: contextFounderId, setFounderId: setContextFounderId } = useMarnee();

  // Load existing data
  const handleLoadData = useCallback(async () => {
    try {
      // Try to get founder ID first
      let founder = null;
      try {
        founder = await api.getMeFounder();
      } catch (error) {
        if (error.status === 404) {
          // No founder profile exists yet - this is OK!
          // Return empty answers, no error
          console.log("No founder profile found - will create one during business test submission");
          return {};
        }
        throw error;
      }

      if (founder?.id) {
        setContextFounderId(founder.id);
      }

      // Try to load existing business test
      try {
        const existingTest = await api.getBusinessTestMe();
        if (existingTest) {
          const prefilledAnswers = {};
          STEPS.forEach((step) => {
            const value = existingTest[step.field];
            if (value !== undefined && value !== null && value !== '') {
              // Convert boolean values back to "yes"/"no" for radio buttons
              if (step.type === 'radio' && ['hasBrandGuidelines', 'teamContentCreator', 'interestedInPersonalBrand'].includes(step.field)) {
                prefilledAnswers[step.field] = value ? 'yes' : 'no';
              } else {
                prefilledAnswers[step.field] = value;
              }
            }
          });
          return prefilledAnswers;
        }
      } catch (error) {
        if (error.status === 404) {
          // No existing business test - this is OK, return empty answers
          console.log("No existing business test found, starting fresh");
          return {};
        }
        throw error;
      }

      return {};
    } catch (error) {
      console.error("Error loading data:", error);
      // Only throw for real errors, not for missing data
      if (error.status && error.status >= 500) {
        throw error;
      }
      return {};
    }
  }, [setContextFounderId]);

  // Submit the test
  const handleSubmit = useCallback(async (answers) => {
    // Ensure founder profile exists
    let currentFounderId = contextFounderId;

    if (!currentFounderId) {
      console.log("Creating empty founder profile for business test...");
      try {
        const response = await api.submitQuestionnaire({
          teamDescriptionWords: [],
          personalValues: [],
          publicSpeakingComfort: 5,
        });
        if (response?.founderId) {
          currentFounderId = response.founderId;
          setContextFounderId(currentFounderId);
        }
      } catch (error) {
        console.error("Error creating founder profile:", error);
        throw new Error("Failed to create founder profile. Please try again.");
      }
    }

    // Build payload
    const payload = { founderId: currentFounderId };
    STEPS.forEach((step) => {
      const value = answers[step.field];
      if (value !== undefined && value !== null && value !== '') {
        // Convert "yes"/"no" back to boolean for specific fields
        if (['hasBrandGuidelines', 'teamContentCreator', 'interestedInPersonalBrand'].includes(step.field) && step.type === 'radio') {
          payload[step.field] = value === 'yes';
        } else {
          payload[step.field] = value;
        }
      }
    });

    // Submit
    await api.submitBusinessTest(payload);

    // Update localStorage
    localStorage.setItem('hasBusinessTest', 'true');

    // Navigation will be handled by CompletionScreen
  }, [contextFounderId, setContextFounderId]);

  return (
    <InteractiveTest
      steps={STEPS}
      title="Business Test"
      onSubmit={handleSubmit}
      onLoadData={handleLoadData}
      loadingMessage="Saving your business profile..."
      backPath="/test-selection"
    />
  );
}
