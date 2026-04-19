/**
 * Mock data for Trends
 * This file contains hardcoded data for Diana to test the UI without backend
 */

export const mockTrends = {
  founderId: "diana-test-founder-id",
  brandNiche: {
    name: "AI-Powered Creative Tools",
    targetAudience: "Creative professionals, designers, and content creators aged 25-40"
  },
  seoKeywords: [
    {
      rank: 1,
      title: "AI design tools 2024",
      searches: "45K",
      competition: "Low",
      growth: "+234%"
    },
    {
      rank: 2,
      title: "automated creative workflow",
      searches: "32K",
      competition: "Medium",
      growth: "+189%"
    },
    {
      rank: 3,
      title: "no-code design platform",
      searches: "28K",
      competition: "Low",
      growth: "+156%"
    },
    {
      rank: 4,
      title: "creative automation software",
      searches: "21K",
      competition: "High",
      growth: "+98%"
    }
  ],
  viralTopics: [
    {
      title: "AI replacing designers debate",
      mentions: "1.2M",
      engagement: "89%",
      relevance: "95%",
      score: "98",
      sources: ["Twitter", "LinkedIn", "Reddit"]
    },
    {
      title: "Midjourney vs human creativity",
      mentions: "890K",
      engagement: "76%",
      relevance: "92%",
      score: "94",
      sources: ["Instagram", "TikTok", "YouTube"]
    },
    {
      title: "No-code revolution impact",
      mentions: "654K",
      engagement: "82%",
      relevance: "88%",
      score: "91",
      sources: ["LinkedIn", "Medium", "Hacker News"]
    }
  ],
  stats: {
    trendingTopics: "126",
    aiRelevanceScore: "88%",
    opportunities: "34",
    totalMentions: "2.7M"
  },
  categories: ["All Trends", "AI & Technology", "Marketing", "Creative Tools", "Industry Insights"],
  mainTrends: [
    {
      title: "Leverage AI Automation Trend",
      category: "CONTENT STRATEGY",
      score: "94",
      description: "Based on your brand's innovative positioning, create content showcasing how AI automation enhances creativity rather than replacing it.",
      stats: [
        { label: "Match Score", value: "85%" },
        { label: "Potential Reach", value: "2.3M" },
        { label: "Priority", value: "High" },
        { label: "Days Active", value: "23" }
      ],
      tags: ["AI Automation", "Creative Tools", "Workflow", "Productivity"],
      actions: ["Create Campaign", "Learn More"]
    },
    {
      title: "Community-Driven Brand Building",
      category: "MARKETING",
      score: "91",
      description: "Brands are shifting towards community-first approaches, with 78% higher engagement rates.",
      stats: [
        { label: "Higher Engagement", value: "78%" },
        { label: "Discussions", value: "890K" },
        { label: "Brand Trust", value: "92%" },
        { label: "Days Trending", value: "15" }
      ],
      tags: ["Community Building", "Brand Loyalty", "UGC", "Authenticity"],
      actions: ["Explore Strategy", "Track Trend"]
    },
    {
      title: "No-Code Creative Platforms",
      category: "CREATIVE TOOLS",
      score: "88",
      description: "No-code solutions are democratizing creative work, with 250% growth in adoption.",
      stats: [
        { label: "Adoption Growth", value: "250%" },
        { label: "New Users", value: "654K" },
        { label: "Satisfaction", value: "85%" },
        { label: "Days Active", value: "19" }
      ],
      tags: ["No-Code", "Accessibility", "Democratization", "Ease of Use"],
      actions: ["Analyze Impact", "Monitor"]
    }
  ],
  trendingKeywords: [
    "#AICreativity",
    "#NoCodeDesign",
    "#CommunityFirst",
    "#CreativeAutomation",
    "#DigitalTransformation",
    "#UserExperience",
    "#BrandAuthenticity",
    "#CreativeTools",
    "#Innovation",
    "#DesignThinking"
  ],
  marketInsights: [
    {
      title: "Creative Software Market",
      stat: "$8.2B projected growth"
    },
    {
      title: "AI Tools Adoption",
      stat: "73% of creatives using AI"
    },
    {
      title: "Remote Creative Work",
      stat: "+45% permanent shift"
    }
  ],
  quickTrends: [
    { name: "AI Content Generation", growth: "+120%" },
    { name: "Mobile-First Design", growth: "+95%" },
    { name: "Interactive Storytelling", growth: "+87%" },
    { name: "Cross-Platform Integration", growth: "+76%" }
  ]
};

export default mockTrends;
