/**
 * Mock data for Strategy
 * This file contains hardcoded data for Diana to test the UI without backend
 */

export const mockStrategy = {
  founderId: "diana-test-founder-id",
  overview: {
    mission: "Empower creative professionals to seamlessly integrate AI into their workflow",
    targetAudience: "Creative professionals, designers, and content creators seeking innovative solutions",
    mainGoal: "Build a thriving community and establish thought leadership in AI-creative space"
  },
  smartGoals: [
    {
      icon: "🤝",
      title: "Community Building",
      subtitle: "2,000 followers by Q2 2025",
      value: "55%"
    },
    {
      icon: "💬",
      title: "Direct Engagement",
      subtitle: "20+ meaningful DMs per month",
      value: "60%"
    },
    {
      icon: "📊",
      title: "Content Performance",
      subtitle: "Maintain 5% average engagement rate",
      value: "70%"
    },
    {
      icon: "🎯",
      title: "Lead Generation",
      subtitle: "15 qualified leads monthly",
      value: "50%"
    },
    {
      icon: "📈",
      title: "Reach Growth",
      subtitle: "Increase monthly reach by 25%",
      value: "62%"
    },
    {
      icon: "💡",
      title: "Brand Awareness",
      subtitle: "50+ brand mentions monthly",
      value: "45%"
    }
  ],
  contentPillars: [
    {
      title: "Wellness Education",
      purpose: "Educate audience on holistic health practices",
      items: ["How-to tutorials", "Myth-busting posts", "Scientific explanations", "Expert interviews"],
      benefit: "Brand Benefit: Establishes authority and trust"
    },
    {
      title: "Lifestyle Inspiration",
      purpose: "Inspire sustainable wellness lifestyle choices",
      items: ["Morning routines", "Transformation stories", "Seasonal wellness tips", "Mindfulness practices"],
      benefit: "Brand Benefit: Builds emotional connection and aspiration"
    },
    {
      title: "Community Connection",
      purpose: "Foster authentic community engagement",
      items: ["User-generated content", "Q&A sessions", "Behind-the-scenes", "Community challenges"],
      benefit: "Brand Benefit: Builds loyalty and advocacy"
    }
  ],
  videoIdeas: [
    {
      number: 1,
      type: "Reel",
      title: "5-Minute Morning Wellness Ritual",
      objective: "Showcase simple daily practices",
      description: "Quick-cut montage of morning routine including meditation, stretching, and herbal tea preparation.",
      tag: "Wellness Education"
    },
    {
      number: 2,
      type: "Tutorial",
      title: "DIY Stress-Relief Aromatherapy Blend",
      objective: "Educate on natural stress management",
      description: "Step-by-step guide to creating custom essential oil blends for different stress levels.",
      tag: "Wellness Education"
    },
    {
      number: 3,
      type: "Story Series",
      title: "Seasonal Wellness Transitions",
      objective: "Inspire seasonal lifestyle adaptation",
      description: "Multi-part series showing how to adjust wellness routines for each season.",
      tag: "Lifestyle Inspiration"
    },
    {
      number: 4,
      type: "Live Q&A",
      title: "Wellness Wednesday: Your Questions Answered",
      objective: "Build community engagement",
      description: "Weekly live session addressing community wellness questions and concerns.",
      tag: "Community Connection"
    },
    {
      number: 5,
      type: "Carousel",
      title: "Myth vs. Reality: Wellness Edition",
      objective: "Educate and debunk misconceptions",
      description: "Visual breakdown of common wellness myths with scientific explanations.",
      tag: "Wellness Education"
    },
    {
      number: 6,
      type: "Behind-the-Scenes",
      title: "A Day in My Wellness Journey",
      objective: "Build authentic connection",
      description: "Raw, unfiltered look at daily wellness practices and challenges.",
      tag: "Community Connection"
    },
    {
      number: 7,
      type: "Tutorial",
      title: "3-Ingredient Energy Balls Recipe",
      objective: "Provide practical value",
      description: "Simple, healthy snack recipe with ingredient benefits explanation.",
      tag: "Lifestyle Inspiration"
    },
    {
      number: 8,
      type: "Reel",
      title: "Before & After: Mindful Moments",
      objective: "Show transformation power",
      description: "Split-screen showing stressed vs. calm states with quick mindfulness tips.",
      tag: "Wellness Education"
    },
    {
      number: 9,
      type: "User Spotlight",
      title: "Community Transformation Stories",
      objective: "Showcase community success",
      description: "Feature follower's wellness journey with their permission and story.",
      tag: "Community Connection"
    },
    {
      number: 10,
      type: "Educational Series",
      title: "Wellness on a Budget: Week 1",
      objective: "Make wellness accessible",
      description: "Multi-part series showing affordable wellness practices and products.",
      tag: "Lifestyle Inspiration"
    }
  ],
  platformStrategies: [
    {
      platform: "Instagram",
      goal: "Build visual brand identity and community engagement",
      items: [
        "Aesthetic wellness flat lays",
        "Behind-the-scenes stories",
        "User-generated content reposts",
        "Quick tutorial reels",
        "Inspirational quote graphics"
      ],
      tone: "Visual, inspirational, community-focused"
    },
    {
      platform: "LinkedIn",
      goal: "Establish thought leadership and B2B partnerships",
      items: [
        "Industry insights and trends",
        "Professional wellness tips",
        "Business case studies",
        "Expert opinion pieces",
        "Workplace wellness content"
      ],
      tone: "Professional, authoritative, educational"
    }
  ],
  workflow: [
    {
      step: "01",
      title: "Pre-Production Planning",
      time: "Mondays | 2-3 hours",
      leftTitle: "Content Strategy",
      leftItems: ["Weekly content brainstorming", "Trend research & analysis", "Content pillar alignment"],
      rightTitle: "Production Prep",
      rightItems: ["Script writing & storyboards", "Props & location setup", "Batch filming schedule"]
    },
    {
      step: "02",
      title: "Content Production",
      time: "Tue & Thu | 3-4 hours each",
      leftTitle: "Filming Sessions",
      leftItems: ["Batch filming (10am-2pm optimal)", "Multiple angles & variations", "B-roll footage collection"],
      rightTitle: "Quality Control",
      rightItems: ["Audio quality checks", "Lighting consistency", "Raw footage organization"]
    },
    {
      step: "03",
      title: "Post-Production & Design",
      time: "Wednesdays | 4-5 hours",
      leftTitle: "Video Editing",
      leftItems: ["Cut & sequence footage", "Add transitions & effects", "Color correction & audio"],
      rightTitle: "Content Finalization",
      rightItems: ["Graphic design for carousels", "Caption writing & hashtags", "Final quality review"]
    },
    {
      step: "04",
      title: "Publishing & Community Management",
      time: "Daily | 30 min morning & evening",
      leftTitle: "Content Distribution",
      leftItems: ["Scheduled posting automation", "Cross-platform optimization", "Story highlights curation"],
      rightTitle: "Engagement & Analytics",
      rightItems: ["Real-time community management", "DM responses & interactions", "Performance tracking & insights"]
    }
  ],
  repurposingStrategies: [
    {
      base: "1 Long-form Video",
      description: "Tutorial or educational content",
      outputs: ["3 Short Reels", "1 Carousel Post", "5 Story Highlights", "1 LinkedIn Article", "Email Newsletter"]
    },
    {
      base: "1 Tutorial Session",
      description: "Step-by-step guide",
      outputs: ["Step Carousel", "Quick Tips Reel", "FAQ Stories", "Blog Post"]
    },
    {
      base: "1 Live Q&A Session",
      description: "Community interaction",
      outputs: ["Highlight Clips", "Q&A Carousel", "Quote Graphics", "Podcast Episode"]
    }
  ],
  publishingCalendar: {
    postsPerWeek: 7,
    reelsPerWeek: 3,
    storiesDaily: 5,
    linkedinPosts: 3,
    weekSchedule: [
      {
        day: "Monday",
        items: [
          { title: "Educational Carousel", time: "9:00 AM", tag: "Wellness Education" },
          { title: "Industry Insights", time: "11:00 AM", tag: "Wellness Education" }
        ]
      },
      {
        day: "Tuesday",
        items: [{ title: "How-to Reel", time: "2:00 PM", tag: "Lifestyle Inspiration" }]
      },
      {
        day: "Wednesday",
        items: [
          { title: "Live Q&A Session", time: "7:00 PM", tag: "Community Connection" },
          { title: "Workplace Wellness", time: "10:00 AM", tag: "Wellness Education" }
        ]
      },
      {
        day: "Thursday",
        items: [{ title: "Before/After Reel", time: "1:00 PM", tag: "Lifestyle Inspiration" }]
      },
      {
        day: "Friday",
        items: [
          { title: "Community Spotlight", time: "4:00 PM", tag: "Community Connection" },
          { title: "Weekly Reflection", time: "3:00 PM", tag: "Lifestyle Inspiration" }
        ]
      },
      {
        day: "Weekend",
        items: [{ title: "Stories & BTS", time: "Flexible timing", tag: "Community Connection" }]
      }
    ],
    optimalTiming: {
      instagramFeed: "9-11 AM, 1-3 PM, 7-9 PM",
      instagramReels: "12-3 PM, 7-9 PM",
      linkedin: "8-10 AM, 12-2 PM, 5-6 PM",
      stories: "Throughout the day (8 AM - 10 PM)"
    }
  },
  monthlyStats: {
    growth: "+24%",
    engagement: "6.8%",
    reach: "12.5K",
    leads: "18"
  },
  kpiTracking: [
    {
      title: "Instagram Performance",
      metrics: [
        { label: "Follower Growth", value: "70%", note: "+12%" },
        { label: "Engagement Rate", value: "68%", note: "+0.8%" },
        { label: "Story Completion", value: "72%", note: "+5%" },
        { label: "DM Response Rate", value: "94%", note: "+2%" }
      ]
    },
    {
      title: "LinkedIn Performance",
      metrics: [
        { label: "Connection Growth", value: "65%", note: "+15%" },
        { label: "Post Engagement", value: "42%", note: "+0.5%" },
        { label: "Profile Views", value: "55%", note: "+22%" },
        { label: "Lead Generation", value: "48%", note: "+3" }
      ]
    },
    {
      title: "Business Impact",
      metrics: [
        { label: "Website Traffic", value: "62%", note: "+28%" },
        { label: "Email Sign-ups", value: "67%", note: "+19" },
        { label: "Consultation Bookings", value: "40%", note: "+3" },
        { label: "Brand Mentions", value: "52%", note: "+12" }
      ]
    },
    {
      title: "Monthly Goals Progress",
      metrics: [
        { label: "Community Growth", value: "78%", note: "156/200 new followers this month" },
        { label: "Engagement Target", value: "100%", note: "6.8% achieved (5% target)" },
        { label: "Lead Generation", value: "100%", note: "18/15 qualified leads" },
        { label: "Content Consistency", value: "95%", note: "29/30 planned posts published" }
      ]
    }
  ]
};

export default mockStrategy;
