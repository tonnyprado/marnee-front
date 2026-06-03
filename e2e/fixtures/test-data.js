/**
 * Test Data - FoodieBoost (Fake Business)
 *
 * Copy-paste ready answers for manual testing or E2E tests
 *
 * Usage:
 *   const { BUSINESS_TEST_ANSWERS } = require('./test-data');
 */

const TEST_USER = {
  email: 'test@foodieboost.com',
  password: 'TestPassword123!',
  name: 'Test User FoodieBoost'
};

const BUSINESS_TEST_ANSWERS = {
  // =====================
  // SECTION 1: Business Context
  // =====================
  businessDescription: 'We help restaurants and food businesses grow their online presence through social media marketing and local SEO',
  websiteUrl: 'https://foodieboost.com',
  businessStage: 'already_selling',

  // =====================
  // SECTION 2: Business Model
  // =====================
  businessFocus: 'b2b',
  // priorityFocus: null, // Only needed if businessFocus === 'both'
  revenueGeneration: 'Monthly retainer subscriptions starting at $500/month, plus one-time setup fees for new clients',
  servicesProductsDescription: 'Social media management packages for restaurants including content creation, posting, community management, and monthly analytics reports',

  // =====================
  // SECTION 3: Core Offer
  // =====================
  mainBenefit: 'Increase restaurant bookings by 40% through consistent social media presence without owners spending time on marketing',
  differentiator: 'We specialize exclusively in restaurants and food businesses, understanding the industry unique challenges like seasonal menus and local competition',
  promisedResult: 'Double your Instagram followers and increase table reservations by 30% within 90 days',

  // =====================
  // SECTION 4: Ideal Customer
  // =====================
  idealCustomer: 'Independent restaurant owners with 1-3 locations, annual revenue $500K-$2M, struggling to maintain consistent social media presence',
  customerLocation: 'Local restaurant associations, Instagram food hashtags, Yelp business forums, local Chamber of Commerce events',
  whyChooseYou: 'We understand the restaurant industry deeply and deliver done-for-you content that actually converts followers into diners',

  // =====================
  // SECTION 5: Positioning & Market
  // =====================
  mainCompetitors: 'Local marketing agencies, Fiverr freelancers, in-house staff doing social media part-time',
  associatedKeywords: ['Marketing', 'Social Media', 'B2B', 'Strategy', 'Content'],
  brandDiscoveryPreference: 'Google search for restaurant marketing, Instagram discovery, referrals from happy clients',
  tagline: 'Your restaurant deserves to be famous',

  // =====================
  // SECTION 6: Branding & Assets
  // =====================
  hasBrandGuidelines: 'yes',

  // =====================
  // SECTION 7: Marketing & Channels
  // =====================
  currentClientAcquisition: 'Referrals from existing clients, cold outreach via Instagram DMs to restaurant accounts, local networking events',

  // =====================
  // SECTION 8: Content & Execution
  // =====================
  contentCreationExperience: '3 years creating content for food brands, experienced with Reels, TikTok, and food photography',
  teamContentCreator: 'yes',
  interestedInPersonalBrand: 'yes',

  // =====================
  // SECTION 9: Growth & Priorities
  // =====================
  mainPriority: 'getting_clients',
  marketingBudget: '$2,000/month for ads and tools',
  upcomingEvents: 'Restaurant industry conference in September, launching new TikTok service package next month'
};

const BRAND_TEST_ANSWERS = {
  teamDescriptionWords: ['Creative', 'Strategic', 'Friendly', 'Professional', 'Passionate'],
  personalValues: ['Quality', 'Trust', 'Growth', 'Innovation'],
  publicSpeakingComfort: 7,
  // Add more brand test fields as needed
};

const CHAT_PROMPTS = {
  // Simple prompts for quick testing
  simple: 'Dame 3 ideas de contenido para Instagram',
  withContext: 'Basado en mi negocio de marketing para restaurantes, dame ideas de posts para esta semana',
  script: 'Escribe un script para un Reel sobre tips de food photography',
  strategy: 'Ayudame a crear una estrategia de contenido para el proximo mes',
  brainstorming: 'Necesito ideas creativas para promocionar un restaurante italiano',
};

// Alternative business for variety in testing
const ALTERNATIVE_BUSINESS = {
  name: 'TechFlow Solutions',
  businessDescription: 'We build custom automation tools for e-commerce businesses to streamline their operations',
  websiteUrl: 'https://techflow.io',
  businessStage: 'first_clients',
  businessFocus: 'b2b',
  revenueGeneration: 'Project-based fees ranging from $5,000-$50,000 plus monthly maintenance contracts',
  servicesProductsDescription: 'Custom Zapier-like automation workflows, inventory management integrations, and order processing systems',
  mainBenefit: 'Save 20+ hours per week on manual data entry and reduce operational errors by 90%',
  differentiator: 'We focus on mid-market e-commerce brands that are too big for off-the-shelf solutions but too small for enterprise software',
  promisedResult: 'Fully automated order-to-fulfillment pipeline within 30 days',
  idealCustomer: 'E-commerce brands doing $1M-$10M annually with 5-20 employees using Shopify or WooCommerce',
  customerLocation: 'Shopify communities, e-commerce Facebook groups, Twitter/X e-commerce influencers',
  whyChooseYou: 'We have deep expertise in Shopify ecosystem and understand the pain points of scaling operations',
  mainCompetitors: 'Zapier, Make.com, in-house developers, offshore agencies',
  associatedKeywords: ['Technology', 'Automation', 'E-commerce', 'SaaS', 'B2B'],
  tagline: 'Automate everything. Scale faster.',
  mainPriority: 'getting_clients',
  marketingBudget: '$3,000/month'
};

module.exports = {
  TEST_USER,
  BUSINESS_TEST_ANSWERS,
  BRAND_TEST_ANSWERS,
  CHAT_PROMPTS,
  ALTERNATIVE_BUSINESS
};
