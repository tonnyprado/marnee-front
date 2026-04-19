/**
 * Mock data for Brand Profile
 * This file contains hardcoded data for Diana to test the UI without backend
 */

export const mockBrandProfile = {
  founderId: "diana-test-founder-id",
  sessionId: "diana-test-session-id",
  assessment: {
    score: 87,
    message: "Your brand has strong foundations with room for strategic growth",
    metrics: {
      clarity: 92,
      consistency: 85,
      differentiation: 83,
      audience: 88
    }
  },
  purpose: {
    statement: "Empowering creative professionals to harness AI tools while maintaining their unique artistic vision and human touch",
    marketPosition: "Premium AI-enhanced creative solutions for modern designers and content creators"
  },
  voice: {
    tone: "Professional yet approachable, inspiring and empowering",
    style: "Clear, confident, and conversational with a touch of innovation",
    personality: ["Innovative", "Empathetic", "Forward-thinking", "Trustworthy"]
  },
  story: {
    origin: "Born from the belief that AI should enhance, not replace, human creativity",
    mission: "To bridge the gap between traditional creative processes and cutting-edge AI technology",
    values: ["Innovation", "Authenticity", "Empowerment", "Excellence"],
    journey: "Started as a passion project, evolved into a movement transforming how creatives work"
  },
  pillars: [
    {
      name: "AI Education",
      description: "Demystifying AI tools and showing practical applications",
      contentTypes: ["Tutorials", "Case Studies", "How-to Guides"]
    },
    {
      name: "Creative Innovation",
      description: "Showcasing the intersection of AI and human creativity",
      contentTypes: ["Inspiration", "Trends", "Innovations"]
    },
    {
      name: "Community Growth",
      description: "Building a supportive community of AI-empowered creatives",
      contentTypes: ["Success Stories", "Community Highlights", "Collaborations"]
    }
  ],
  guidelinesRecommendations: [
    "Use vibrant gradients (purple to cyan) in visual content to represent innovation",
    "Always emphasize human creativity enhanced by AI, not replaced",
    "Include real examples and case studies in educational content",
    "Maintain an inspiring yet practical tone in all communications",
    "Engage actively with community feedback and showcase user success stories"
  ],
  uploadedGuidelines: null
};

export default mockBrandProfile;
