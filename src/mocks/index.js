// ============================================================
// MOCK MODE — set to false to reconnect the real backend
// ============================================================
export const MOCK_MODE = true;

// ============================================================
// MOCK SESSION — auto-seeded into localStorage on import
// ============================================================
export const MOCK_AUTH = {
  token: 'mock-token-abc123xyz',
  type: 'Bearer',
  userId: 'mock-user-001',
  email: 'diana@marnee.ai',
  name: 'Diana',
};

export const MOCK_FOUNDER_ID = 'mock-founder-001';
export const MOCK_SESSION_ID = 'mock-session-001';
export const MOCK_CALENDAR_ID = 'mock-calendar-001';
export const MOCK_CONVERSATION_ID = 'mock-conversation-001';

export function seedMockLocalStorage() {
  localStorage.setItem('marnee_auth', JSON.stringify(MOCK_AUTH));
  localStorage.setItem('marnee_founderId', MOCK_FOUNDER_ID);
  localStorage.setItem('marnee_sessionId', MOCK_SESSION_ID);
  localStorage.setItem('marnee_calendarId', MOCK_CALENDAR_ID);
  localStorage.setItem('marnee_conversationId', MOCK_CONVERSATION_ID);
}

// ============================================================
// MOCK DATA
// ============================================================

export const MOCK_FOUNDER = {
  id: MOCK_FOUNDER_ID,
  name: 'Diana',
  email: 'diana@marnee.ai',
  brand: 'Marnee AI',
  niche: 'AI-powered social media strategy for founders',
  platforms: ['Instagram', 'TikTok'],
  postingCadence: '5x per week',
  contentPillars: ['Educational', 'Authority', 'Behind the scenes', 'Viral', 'Story'],
};

export const MOCK_USER = {
  id: 'mock-user-001',
  email: 'diana@marnee.ai',
  name: 'Diana',
};

export const MOCK_SESSIONS = [
  {
    id: MOCK_SESSION_ID,
    founderId: MOCK_FOUNDER_ID,
    welcomeMessage:
      "Hey Diana! I'm Marnee, your AI social media strategist. Your content calendar is ready — want to review it together or should we brainstorm new ideas?",
    currentStep: 5,
    createdAt: '2026-04-10T09:00:00Z',
  },
];

export const MOCK_CONVERSATIONS = [
  {
    id: MOCK_CONVERSATION_ID,
    founderId: MOCK_FOUNDER_ID,
    sessionId: MOCK_SESSION_ID,
    createdAt: '2026-04-10T09:00:00Z',
  },
];

export const MOCK_CONVERSATION_DETAIL = {
  id: MOCK_CONVERSATION_ID,
  founderId: MOCK_FOUNDER_ID,
  sessionId: MOCK_SESSION_ID,
  messages: [
    {
      id: 'msg-001',
      role: 'assistant',
      content:
        "Hey Diana! I'm Marnee, your AI content and brand strategist. I've analyzed your brand profile and I'm ready to help you build a content strategy that actually converts.\n\nYou're positioned as an authority in the AI + social media space — which is a **huge opportunity** right now. Let's make the most of it.\n\nWhat would you like to work on today?",
      step: 5,
    },
    {
      id: 'msg-002',
      role: 'user',
      content: "Let's review my content calendar for this week.",
      step: 5,
    },
    {
      id: 'msg-003',
      role: 'assistant',
      content:
        "Your 4-week content calendar is live! Here's a quick overview of this week:\n\n**Week 1 highlights:**\n- **Tue Apr 15** — \"3 Reasons Your Instagram Isn't Growing\" (Educational / Reel)\n- **Wed Apr 16** — \"Day in my life building a startup in Seoul\" (Behind the scenes / TikTok)\n- **Thu Apr 17** — \"The content strategy framework I use for my clients\" (Authority / Carousel)\n- **Fri Apr 18** — \"POV: you just discovered AI can write your content calendar\" (Viral / Reel)\n\nYou have **5 posts scheduled** this week across Instagram and TikTok. Want me to generate scripts for any of them?",
      step: 5,
    },
    {
      id: 'msg-004',
      role: 'user',
      content: "Yes! Can you write the script for the Tuesday post?",
      step: 5,
    },
    {
      id: 'msg-005',
      role: 'assistant',
      content:
        '## Script: "3 Reasons Your Instagram Isn\'t Growing"\n\n**Hook (0-3s):**\n> "Stop. If your Instagram hasn\'t grown in 3 months, it\'s one of these 3 things."\n\n**Body:**\n> **Reason #1 — You\'re posting without strategy.** You\'re creating content based on what *you* feel like posting, not what your audience actually needs. Fix this by mapping every post to a content pillar.\n\n> **Reason #2 — Your hooks are weak.** The first 3 seconds determine everything. If you\'re starting with "Hi guys, today I\'m going to..." — you\'ve already lost them.\n\n> **Reason #3 — You\'re inconsistent.** The algorithm rewards consistency. 3 posts a week every week beats 10 posts one week and silence the next.\n\n**CTA:**\n> "Save this so you don\'t forget it. And drop a 🙋 if you\'ve been guilty of at least one of these."\n\n---\n*Duration: ~45-60 seconds | Format: Talking head + text on screen*',
      step: 5,
    },
  ],
};

// ============================================================
// CALENDAR POSTS (4 weeks, Apr 15 – May 12 2026)
// ============================================================
function makePost(date, platform, contentType, pillar, title, hook, body, cta, status, effortLevel, hashtags) {
  return { date, platform, contentType, pillar, title, hook, body, cta, status, effortLevel, hashtags };
}

const CALENDAR_POSTS = [
  // Week 1
  makePost(
    '2026-04-15', 'Instagram', 'Educational', 'Tips',
    '3 Reasons Your Instagram Isn\'t Growing',
    'Stop. If your Instagram hasn\'t grown in 3 months, it\'s one of these 3 things.',
    'Reason 1: No strategy. Reason 2: Weak hooks. Reason 3: Inconsistency. Here\'s how to fix all three.',
    'Save this and drop a 🙋 if you\'ve been guilty of at least one!',
    'todo', 'Medium',
    ['#instagramgrowth', '#socialmediatips', '#contentcreator', '#instagramtips']
  ),
  makePost(
    '2026-04-16', 'TikTok', 'Authority', 'Behind the scenes',
    'Day in My Life Building a Startup in Seoul',
    'POV: it\'s 8am in Seoul and you\'re building an AI startup from your apartment.',
    'Follow me through a full work day — strategy calls, content creation, investor prep, and finding time to actually eat.',
    'Follow for more honest startup content from Seoul 🇰🇷',
    'todo', 'High',
    ['#startuplife', '#seoul', '#founderlife', '#womeninstech', '#aitools']
  ),
  makePost(
    '2026-04-17', 'Instagram', 'Authority', 'Authority',
    'The Content Strategy Framework I Use for My Clients',
    'This 3-pillar content framework made one of my clients go from 2k to 11k followers in 5 months.',
    'Pillar 1: Educational (40%) — teach your audience something. Pillar 2: Authority (35%) — show your expertise. Pillar 3: Engagement (25%) — invite them into a conversation.',
    'Comment "FRAMEWORK" and I\'ll send you the full breakdown.',
    'todo', 'Medium',
    ['#contentmarketing', '#instagramstrategy', '#socialmediamanager', '#contentpillars']
  ),
  makePost(
    '2026-04-18', 'TikTok', 'Viral', 'Engagement',
    'POV: You Just Discovered AI Can Write Your Content Calendar',
    'Me before Marnee AI: spending 4 hours on Sunday planning content. Me after: 10 minutes.',
    'AI tools have completely changed how I manage content strategy for my clients. Here\'s my exact workflow.',
    'Drop "AI" in the comments if you want to know more 👇',
    'scheduled', 'Low',
    ['#aitools', '#contentcreator', '#productivity', '#socialmediatips', '#contentcalendar']
  ),
  makePost(
    '2026-04-19', 'Instagram', 'Authority', 'Story',
    'Why I Left Madrid to Build a Startup in Korea',
    'Most people thought I was crazy. I had a stable job, a life in Madrid, and I gave it all up for a Working Holiday Visa in Seoul.',
    'Two years later: I\'m co-founder of an AI startup, won a competition in Korea, and I\'ve never felt more aligned with my purpose.',
    'What\'s the boldest move you\'ve made for your career? Tell me below.',
    'scheduled', 'Medium',
    ['#founderjourney', '#expatlife', '#seoul', '#womenentrepreneurs', '#startupstory']
  ),

  // Week 2
  makePost(
    '2026-04-22', 'TikTok', 'Educational', 'Tips',
    'How to Write a Hook That Stops the Scroll',
    'Your hook is the only thing standing between a scroll and a view. Here\'s how to write one that works.',
    'Formula: [Provocative statement] + [Specific promise] + [Urgency]. Example: "Stop posting on Instagram until you watch this — it\'s costing you followers every single day."',
    'Save this and try it on your next post. Tell me how it goes!',
    'todo', 'Low',
    ['#hookwriting', '#contentcreator', '#tiktokgrowth', '#contentwriting']
  ),
  makePost(
    '2026-04-23', 'Instagram', 'Authority', 'Authority',
    'I Reviewed 50 Failing Brand Accounts — Here\'s What They All Had in Common',
    'I spent a week auditing 50 brand Instagram accounts that weren\'t growing. The pattern was identical.',
    'No clear niche. No consistent visual identity. No CTA strategy. No content calendar. Sound familiar? Here\'s the fix.',
    'DM me "AUDIT" and I\'ll take a look at your profile.',
    'todo', 'High',
    ['#brandstrategy', '#instagramaudit', '#socialmedia', '#brandingexpert']
  ),
  makePost(
    '2026-04-24', 'TikTok', 'Viral', 'Engagement',
    'The Honest Reality of UGC as a Creator in South Korea',
    'The brands don\'t tell you this before you move abroad: UGC rates in Asia are a different world.',
    'Here\'s what I charge, what I\'ve learned, and what I wish someone had told me when I started.',
    'Creators in Korea — let\'s talk. What\'s your experience been?',
    'in_progress', 'Medium',
    ['#ugccreator', '#contentcreator', '#southkorea', '#ugckorea', '#creatoreconomy']
  ),
  makePost(
    '2026-04-25', 'Instagram', 'Educational', 'Tips',
    '5 Instagram Mistakes That Are Killing Your Reach in 2026',
    'The algorithm changed again — here\'s what\'s actually hurting your reach right now.',
    'Mistake 1: Ignoring Reels. Mistake 2: Posting at the wrong time. Mistake 3: No hashtag strategy. Mistake 4: Weak captions. Mistake 5: Not engaging in the first hour.',
    'Which one are you guilty of? Be honest 👇',
    'todo', 'Medium',
    ['#instagramalgorithm', '#instagramreach', '#growyourinstagram', '#socialmediatips2026']
  ),
  makePost(
    '2026-04-26', 'TikTok', 'Authority', 'Behind the scenes',
    'Behind the Scenes: Building Marnee AI as a Non-Tech Founder',
    'I\'m a biologist-turned-marketer-turned-AI startup co-founder. Here\'s what building a SaaS actually looks like without a technical background.',
    'Product decisions, team dynamics, pitching investors, winning a startup competition in Korea — the real stuff nobody shows you.',
    'Founders without a tech background — you are not alone. Drop a 👋 below.',
    'published', 'High',
    ['#nontechfounder', '#saas', '#startuplife', '#founderjourney', '#marneiai']
  ),

  // Week 3
  makePost(
    '2026-04-29', 'Instagram', 'Viral', 'Engagement',
    'What a $300/Month Social Media Client Actually Gets',
    'Let\'s be transparent. Here\'s exactly what I deliver for a $300/month retainer client.',
    '12 pieces of content per month, full caption writing, hashtag research, scheduling, monthly strategy call, and performance report. Is that fair? You tell me.',
    'Social media managers — what do you include in your packages? Drop it below.',
    'todo', 'Low',
    ['#socialmediamanager', '#freelancerlife', '#contentcreation', '#smm', '#transparentpricing']
  ),
  makePost(
    '2026-04-30', 'TikTok', 'Educational', 'Tips',
    'The Content Calendar System That Saved Me 6 Hours a Week',
    'I used to spend Sunday evenings planning the whole week\'s content. Now it takes me 20 minutes.',
    'Step 1: Define your 3-5 content pillars. Step 2: Assign pillars to days. Step 3: Batch-create your hooks in one session. Step 4: Use AI to expand. Step 5: Schedule everything.',
    'Drop "SYSTEM" in the comments and I\'ll send you my exact template.',
    'todo', 'Medium',
    ['#contentcalendar', '#contentbatch', '#productivityhacks', '#contentcreator', '#contentplanning']
  ),
  makePost(
    '2026-05-01', 'Instagram', 'Authority', 'Story',
    'I Won a Startup Competition in Korea — Here\'s What Actually Happened',
    'When I submitted our application to Oasis 3, I genuinely didn\'t think we\'d get in. We were two foreigners pitching an AI tool in Korean.',
    'We won. And it completely changed the trajectory of Marnee AI. Here\'s the story from start to finish.',
    'If you\'re building something and wondering if it\'s worth entering competitions — yes. Always yes.',
    'done', 'High',
    ['#startupcompetition', '#marneiai', '#founderlife', '#seoulstartup', '#womenintech']
  ),
  makePost(
    '2026-05-02', 'TikTok', 'Viral', 'Engagement',
    'Rating Viral Social Media Trends — What Actually Works for Brands',
    'POV: a social media strategist reacts to the biggest trends of 2026.',
    'The "day in my life" trend? 10/10 for personal brands. The "before/after" format? 9/10 if you\'re selling transformation. The "talking to camera" trend? Depends heavily on your niche.',
    'Drop your current favorite content format below — I\'ll tell you if it\'s worth using for YOUR brand.',
    'todo', 'Low',
    ['#contenttrends', '#socialmedia2026', '#tiktoktrends', '#contentcreator']
  ),
  makePost(
    '2026-05-03', 'Instagram', 'Educational', 'Tips',
    'How to Find Your Content Niche in 30 Minutes',
    'You don\'t need months of trial and error to find your niche. You need this 30-minute exercise.',
    'Step 1: List 3 topics you know deeply. Step 2: List 3 topics your audience cares about. Step 3: Find the intersection. Step 4: Validate with 5 posts. Step 5: Double down on what works.',
    'Save this and do the exercise today. Not tomorrow. Today.',
    'todo', 'Low',
    ['#contentniche', '#personalbrand', '#contentcreator', '#instagramgrowth', '#brandstrategy']
  ),

  // Week 4
  makePost(
    '2026-05-06', 'TikTok', 'Authority', 'Behind the scenes',
    'My Entire Content Workflow as a Social Media Manager + Startup Founder',
    'I manage content for multiple clients AND run my own startup. Here\'s how I structure my week so nothing falls through the cracks.',
    'Mon: Strategy. Tue: Creation. Wed: Scheduling. Thu: Client calls + feedback. Fri: Analytics + planning for next week. Sat/Sun: Marnee AI. (And yes, I do take breaks.)',
    'Entrepreneurs and creators — how do you structure your week? Show me in the comments.',
    'todo', 'Medium',
    ['#creatorworkflow', '#socialmediamanager', '#productivitytips', '#founderlife']
  ),
  makePost(
    '2026-05-07', 'Instagram', 'Viral', 'Engagement',
    'The TikTok → Instagram Cross-Post Strategy That Got Me 4k Views',
    'I posted the same video on TikTok and Instagram the same day. TikTok got 300 views. Instagram got 4,000. Here\'s why.',
    'The difference? The caption. On Instagram I wrote a longer, story-driven caption that gave context. On TikTok I posted it raw. The Instagram algorithm rewards saves — and the story caption drove saves.',
    'Are you cross-posting the same content with different captions? If not, start today.',
    'todo', 'Low',
    ['#instagramreels', '#tiktok', '#crossposting', '#contentdistribution', '#instagramalgorithm']
  ),
  makePost(
    '2026-05-08', 'TikTok', 'Educational', 'Tips',
    'The Only 3 Metrics That Actually Matter for Instagram Growth',
    'Stop obsessing over follower count. These 3 metrics will tell you if your content is actually working.',
    'Metric 1: Saves (tells you if content is valuable). Metric 2: Shares (tells you if content is relatable). Metric 3: Profile visits (tells you if content is compelling enough to drive curiosity).',
    'Check these metrics on your last 5 posts and drop the numbers below. Let\'s analyze them together.',
    'scheduled', 'Low',
    ['#instagrammetrics', '#instagramanalytics', '#contentgrowth', '#socialmediatips']
  ),
  makePost(
    '2026-05-09', 'Instagram', 'Authority', 'Story',
    'Living in Seoul for 2 Years Changed How I Think About Work',
    'I moved to Seoul with a one-way ticket and a Working Holiday Visa. I had no plan. I just knew I needed a change.',
    'Two years later: I\'ve built a startup, managed clients across 3 time zones, learned Korean survival phrases, and realized that the best career decisions are often the ones that scare you most.',
    'Where\'s the boldest place you\'ve ever worked from? Tell me below 🌏',
    'todo', 'Medium',
    ['#seoullife', '#digitalnomad', '#workfromanywhere', '#expatlife', '#founderlife']
  ),
  makePost(
    '2026-05-10', 'TikTok', 'Viral', 'Behind the scenes',
    'Behind the Pitch: What It\'s Like to Present a Startup in Korea',
    'We had 7 minutes to pitch Marnee AI to 50+ investors and judges at SIIF Seoul 2025. Here\'s what happened.',
    'The preparation took 3 weeks. The pitch took 7 minutes. The feedback session after was 45 minutes of the most intense questions I\'ve ever faced. And somehow, we survived.',
    'Founders — the pitch is never as scary as the preparation makes it feel. Trust the process.',
    'published', 'High',
    ['#startuppitch', '#investorpitch', '#seoulstartup', '#marneiai', '#founderlife']
  ),
  makePost(
    '2026-05-12', 'Instagram', 'Educational', 'Tips',
    'How to Write Captions That Actually Convert (With Examples)',
    'Your visual stops the scroll. Your caption closes the deal. Here\'s how to write captions that convert.',
    'Formula: Hook sentence (1 line) → Story or value (3-5 lines) → CTA (1 line). Keep it scannable. Use line breaks. Always end with a specific question or clear action.',
    'Save this formula and try it on your next caption. Then come back and tell me if it worked.',
    'todo', 'Medium',
    ['#instagramcaptions', '#captionwriting', '#contentcreator', '#copywriting', '#instagramgrowth']
  ),
];

export const MOCK_CALENDAR = {
  id: MOCK_CALENDAR_ID,
  founderId: MOCK_FOUNDER_ID,
  sessionId: MOCK_SESSION_ID,
  totalPosts: CALENDAR_POSTS.length,
  startDate: '2026-04-15',
  endDate: '2026-05-12',
  posts: CALENDAR_POSTS,
};

export const MOCK_BRAINSTORMING_IDEAS = [
  {
    id: 'idea-001',
    title: 'Week in the life of a founder in Seoul (vlog style)',
    description: 'Long-form TikTok (3-5 min) showing a realistic week — early mornings, strategy sessions at D.Camp, client calls, exploring the city.',
    platform: 'TikTok',
    tags: ['vlog', 'founder', 'seoul', 'dayinmylife'],
    notes: 'Film B-roll throughout the week. Raw, authentic energy. No scripting, just talking to camera.',
    status: 'approved',
    founderId: MOCK_FOUNDER_ID,
    calendarId: MOCK_CALENDAR_ID,
  },
  {
    id: 'idea-002',
    title: 'Debunking 5 UGC myths brands still believe in 2026',
    description: 'Educational carousel or Reel breaking down misconceptions brands have about UGC creators — pricing, exclusivity, turnaround.',
    platform: 'Instagram',
    tags: ['ugc', 'ugccreator', 'brandmyths', 'contentcreation'],
    notes: 'Good for positioning as authority in the UGC space. Could go viral with brands sharing it.',
    status: 'idea',
    founderId: MOCK_FOUNDER_ID,
    calendarId: MOCK_CALENDAR_ID,
  },
  {
    id: 'idea-003',
    title: 'AI vs Human: who writes better Instagram captions?',
    description: 'Side-by-side comparison of AI-written captions vs manually written ones. Let audience vote.',
    platform: 'TikTok',
    tags: ['aitools', 'instagramcaptions', 'chatgpt', 'contentcreator'],
    notes: 'Great engagement bait. High share potential. Could tie directly into Marnee AI promotion.',
    status: 'approved',
    founderId: MOCK_FOUNDER_ID,
    calendarId: MOCK_CALENDAR_ID,
  },
  {
    id: 'idea-004',
    title: 'The social media tools I actually pay for (and why)',
    description: 'Transparent breakdown of the tools in my stack — what each costs and whether it\'s worth it.',
    platform: 'Instagram',
    tags: ['socialmediatools', '#productivity', 'toolstack', 'smm'],
    notes: 'Potential for affiliate partnerships. Very practical content that drives saves.',
    status: 'idea',
    founderId: MOCK_FOUNDER_ID,
    calendarId: MOCK_CALENDAR_ID,
  },
  {
    id: 'idea-005',
    title: 'Pitch deck breakdown — what I learned from investor feedback',
    description: 'Walk through the original Marnee AI pitch deck and share the specific feedback we got from investors at SIIF Seoul.',
    platform: 'LinkedIn',
    tags: ['pitchdeck', 'startup', 'investorfeedback', 'marneiai'],
    notes: 'High authority content for LinkedIn. Can repurpose as a TikTok too.',
    status: 'rejected',
    founderId: MOCK_FOUNDER_ID,
    calendarId: MOCK_CALENDAR_ID,
  },
  {
    id: 'idea-006',
    title: '"Send this to your client who still posts without a strategy"',
    description: 'Shareable, slightly humorous content aimed at social media managers to share with difficult clients.',
    platform: 'TikTok',
    tags: ['socialmediastrategy', 'smmlife', 'clientwork', 'contentcreator'],
    notes: 'High share potential from other social media managers. Could get picked up by the SMM community.',
    status: 'idea',
    founderId: MOCK_FOUNDER_ID,
    calendarId: MOCK_CALENDAR_ID,
  },
];

// ============================================================
// MOCK API HANDLERS
// ============================================================

// Simulate realistic async delay
const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// In-memory store for mock writes (brainstorming, posts)
let _brainstormingIdeas = [...MOCK_BRAINSTORMING_IDEAS];
let _calendarPosts = [...CALENDAR_POSTS];
let _nextIdeaIndex = MOCK_BRAINSTORMING_IDEAS.length + 1;

// AI reply rotation for sendMessage
const AI_REPLIES = [
  "Great question! Based on your brand positioning as an AI-powered social media tool for founders, I'd focus on **authority content** this week — showcase your expertise and the results you've driven. What specific platform do you want to target?",
  "I love that direction! For Instagram Reels, the current sweet spot is **45-60 seconds** with strong hooks in the first 3 seconds. Your audience of founders responds really well to transparent, behind-the-scenes content. Want me to draft a script?",
  "Your content pillars are well-balanced. One suggestion: **increase your 'Story' pillar content** by 10% — founder journey stories are performing exceptionally well on TikTok right now. Your Seoul narrative is a huge differentiator.",
  "Based on your posting cadence of 5x/week, here's what I'd batch on Monday: **3 TikTok hooks**, **2 Instagram carousel drafts**, and **1 Reel script**. Want me to generate those?",
  "That's a great idea for a post! Here's a hook you could use:\n\n> *\"I spent 2 years building a startup in Seoul with no tech background. Here's the one thing nobody warned me about.\"*\n\nShall I write the full script?",
];
let _aiReplyIndex = 0;

export const mockApi = {
  // AUTH
  login: async () => {
    await delay(600);
    seedMockLocalStorage();
    return {
      token: MOCK_AUTH.token,
      type: MOCK_AUTH.type,
      userId: MOCK_AUTH.userId,
      email: MOCK_AUTH.email,
      name: MOCK_AUTH.name,
    };
  },

  register: async () => {
    await delay(800);
    seedMockLocalStorage();
    return {
      token: MOCK_AUTH.token,
      type: MOCK_AUTH.type,
      userId: MOCK_AUTH.userId,
      email: MOCK_AUTH.email,
      name: MOCK_AUTH.name,
    };
  },

  // USER / ME
  getMeUser: async () => {
    await delay(300);
    return MOCK_USER;
  },

  getMeFounder: async () => {
    await delay(300);
    return MOCK_FOUNDER;
  },

  getMeSessions: async () => {
    await delay(300);
    return MOCK_SESSIONS;
  },

  getMeCalendars: async () => {
    await delay(300);
    return [MOCK_CALENDAR];
  },

  // CONVERSATIONS
  getConversations: async () => {
    await delay(300);
    return MOCK_CONVERSATIONS;
  },

  getConversation: async () => {
    await delay(400);
    return MOCK_CONVERSATION_DETAIL;
  },

  // CHAT
  sendMessage: async ({ message }) => {
    await delay(1200);
    const reply = AI_REPLIES[_aiReplyIndex % AI_REPLIES.length];
    _aiReplyIndex += 1;
    return {
      reply,
      conversationId: MOCK_CONVERSATION_ID,
      currentStep: 5,
      stepName: 'calendar',
      primaryAction: null,
      uiActions: [],
      calendarId: null,
    };
  },

  approveStep: async () => {
    await delay(400);
    return { success: true };
  },

  // CALENDAR
  generateCalendar: async () => {
    await delay(1500);
    return {
      calendarId: MOCK_CALENDAR_ID,
      calendar: MOCK_CALENDAR,
    };
  },

  getCalendar: async () => {
    await delay(400);
    return { calendar: { ...MOCK_CALENDAR, posts: _calendarPosts } };
  },

  getMyLatestCalendar: async () => {
    await delay(400);
    return {
      calendarId: MOCK_CALENDAR_ID,
      calendar: { ...MOCK_CALENDAR, posts: _calendarPosts },
    };
  },

  getLatestCalendarByFounder: async () => {
    await delay(400);
    return {
      calendarId: MOCK_CALENDAR_ID,
      calendar: { ...MOCK_CALENDAR, posts: _calendarPosts },
    };
  },

  updatePost: async (calendarId, postIndex, data) => {
    await delay(400);
    _calendarPosts = _calendarPosts.map((p, idx) =>
      idx === postIndex ? { ...p, ...data } : p
    );
    return { success: true };
  },

  // BRAINSTORMING
  getBrainstormingIdeas: async () => {
    await delay(500);
    return { ideas: [..._brainstormingIdeas] };
  },

  getBrainstormingIdea: async (ideaId) => {
    await delay(300);
    return _brainstormingIdeas.find((i) => i.id === ideaId) || null;
  },

  createBrainstormingIdea: async (data) => {
    await delay(500);
    const newIdea = {
      ...data,
      id: `idea-${String(_nextIdeaIndex).padStart(3, '0')}`,
      status: data.status || 'idea',
    };
    _nextIdeaIndex += 1;
    _brainstormingIdeas = [newIdea, ..._brainstormingIdeas];
    return newIdea;
  },

  updateBrainstormingIdea: async (ideaId, data) => {
    await delay(400);
    _brainstormingIdeas = _brainstormingIdeas.map((i) =>
      i.id === ideaId ? { ...i, ...data } : i
    );
    return { success: true };
  },

  deleteBrainstormingIdea: async (ideaId) => {
    await delay(400);
    _brainstormingIdeas = _brainstormingIdeas.filter((i) => i.id !== ideaId);
    return { success: true };
  },

  convertIdeaToTask: async () => {
    await delay(500);
    return { success: true };
  },

  // CONTENT IDEAS / SCRIPTS
  generateIdeas: async () => {
    await delay(1000);
    return {
      ideas: [
        { id: 'gen-1', title: 'AI tools every content creator needs in 2026', pillar: 'Educational' },
        { id: 'gen-2', title: 'Why I stopped posting every day (and grew faster)', pillar: 'Authority' },
        { id: 'gen-3', title: 'Seoul street food + startup life: a day in my world', pillar: 'Behind the scenes' },
      ],
    };
  },

  generateScript: async ({ contentIdea }) => {
    await delay(1200);
    return {
      hook: `Stop scrolling — this is exactly what your audience needs to hear about ${contentIdea || 'this topic'}.`,
      body: 'Here\'s the breakdown:\n\n**Point 1:** Start with the problem your audience recognizes.\n\n**Point 2:** Introduce your unique angle or solution.\n\n**Point 3:** Back it up with a specific example or result.',
      cta: 'Save this for your next content session and tag a creator who needs to hear it.',
    };
  },

  // TESTS
  submitQuestionnaire: async () => {
    await delay(800);
    seedMockLocalStorage();
    return {
      founderId: MOCK_FOUNDER_ID,
      sessionId: MOCK_SESSION_ID,
      welcomeMessage: MOCK_SESSIONS[0].welcomeMessage,
      conversationId: MOCK_CONVERSATION_ID,
    };
  },

  submitBusinessTest: async () => {
    await delay(800);
    return { success: true };
  },

  getBusinessTestMe: async () => {
    await delay(300);
    return {
      id: 'biz-test-001',
      founderId: MOCK_FOUNDER_ID,
      completed: true,
    };
  },

  getBusinessTestByFounder: async () => {
    await delay(300);
    return { id: 'biz-test-001', founderId: MOCK_FOUNDER_ID, completed: true };
  },

  getTestTypes: async () => {
    await delay(300);
    return [
      { id: 'brand', name: 'Brand Test', description: 'Discover your brand personality' },
      { id: 'business', name: 'Business Test', description: 'Map your business positioning' },
    ];
  },

  // COMMENTS
  createComment: async (postId, data) => {
    await delay(400);
    return { id: `comment-${Date.now()}`, postId, ...data, createdAt: new Date().toISOString() };
  },

  getPostComments: async () => {
    await delay(300);
    return [];
  },

  updateComment: async (commentId, data) => {
    await delay(300);
    return { id: commentId, ...data };
  },

  deleteComment: async () => {
    await delay(300);
    return { success: true };
  },

  // WAITLIST
  subscribeWaitlist: async () => {
    await delay(500);
    return { success: true };
  },
};
