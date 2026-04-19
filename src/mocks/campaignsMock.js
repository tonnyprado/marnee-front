/**
 * Mock data for Campaigns
 * This file contains hardcoded data for Diana to test the UI without backend
 */

export const mockCampaigns = [
  {
    id: "campaign-1",
    name: "AI Creative Workflow Series",
    calendarId: "diana-test-calendar-id",
    founderId: "diana-test-founder-id",
    platform: "Instagram",
    inspirationUrl: "https://www.instagram.com/p/example1",
    status: "in_progress",
    aiGenerated: true,
    scriptsCount: 3,
    notes: "Focus on beginner-friendly content",
    tasks: [
      {
        id: "task-1",
        title: "Script first video about AI tools introduction",
        status: "completed"
      },
      {
        id: "task-2",
        title: "Film 3 tutorial videos",
        status: "completed"
      },
      {
        id: "task-3",
        title: "Edit and add transitions",
        status: "pending"
      },
      {
        id: "task-4",
        title: "Create thumbnails and captions",
        status: "pending"
      },
      {
        id: "task-5",
        title: "Schedule posts for optimal timing",
        status: "pending"
      }
    ],
    aiSuggestions: {
      suggestedHook: "\"You won't believe how AI can 10x your creative workflow in just 5 minutes!\"",
      trendingFormat: "Quick cuts with text overlays, trending audio in background",
      optimalTiming: "Tuesday & Thursday 2-4 PM for maximum engagement",
      additionalTips: [
        "Use trending sounds from the past 7 days",
        "Add a clear CTA in the first 3 seconds",
        "Include before/after comparison",
        "End with a question to boost comments"
      ]
    }
  },
  {
    id: "campaign-2",
    name: "Community Success Stories",
    calendarId: "diana-test-calendar-id",
    founderId: "diana-test-founder-id",
    platform: "TikTok",
    inspirationUrl: null,
    status: "idea",
    aiGenerated: true,
    scriptsCount: 1,
    notes: "",
    tasks: [
      {
        id: "task-6",
        title: "Reach out to 5 community members for interviews",
        status: "pending"
      },
      {
        id: "task-7",
        title: "Prepare interview questions",
        status: "pending"
      },
      {
        id: "task-8",
        title: "Record success story testimonials",
        status: "pending"
      }
    ],
    aiSuggestions: {
      suggestedHook: "\"From struggling designer to AI-powered creative in 30 days...\"",
      trendingFormat: "Story-telling format with emotional music",
      optimalTiming: "Weekend evenings 7-9 PM",
      additionalTips: [
        "Use authentic, relatable stories",
        "Keep it under 60 seconds",
        "Include transformation metrics"
      ]
    }
  },
  {
    id: "campaign-3",
    name: "Product Launch Teaser",
    calendarId: "diana-test-calendar-id",
    founderId: "diana-test-founder-id",
    platform: "Instagram",
    inspirationUrl: "https://www.instagram.com/p/example2",
    status: "scheduled",
    aiGenerated: false,
    scriptsCount: 5,
    notes: "Scheduled for next Monday",
    tasks: [
      {
        id: "task-9",
        title: "Create teaser graphics",
        status: "completed"
      },
      {
        id: "task-10",
        title: "Write launch announcement copy",
        status: "completed"
      },
      {
        id: "task-11",
        title: "Prepare countdown stories",
        status: "completed"
      }
    ],
    aiSuggestions: {
      suggestedHook: "\"The tool every creative has been waiting for is finally here...\"",
      trendingFormat: "Mystery/reveal style with dramatic music",
      optimalTiming: "Monday 9-11 AM for maximum visibility",
      additionalTips: [
        "Build suspense with countdown",
        "Use consistent branding colors",
        "Tease benefits without revealing everything"
      ]
    }
  },
  {
    id: "campaign-4",
    name: "Monthly Tutorial Series",
    calendarId: "diana-test-calendar-id",
    founderId: "diana-test-founder-id",
    platform: "YouTube",
    inspirationUrl: null,
    status: "published",
    aiGenerated: false,
    scriptsCount: 4,
    notes: "Great engagement! Continue this series.",
    tasks: [
      {
        id: "task-12",
        title: "Research trending AI tools",
        status: "completed"
      },
      {
        id: "task-13",
        title: "Film 4 detailed tutorials",
        status: "completed"
      },
      {
        id: "task-14",
        title: "Edit with chapters and timestamps",
        status: "completed"
      },
      {
        id: "task-15",
        title: "Upload with SEO optimization",
        status: "completed"
      }
    ],
    aiSuggestions: null
  }
];

export default mockCampaigns;
