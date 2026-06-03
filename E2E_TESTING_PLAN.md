# Plan de Testing E2E con Playwright - Marnee

## Estado Actual

Ya tienes Playwright configurado:
- **Config:** `playwright.config.js`
- **Tests existentes:** `e2e/` (landing, auth, creators-landing, navigation)
- **Scripts:** `npm run test:e2e`, `npm run test:e2e:ui`, `npm run test:e2e:headed`

---

## Arquitectura de Tests Propuesta

```
e2e/
├── fixtures/
│   ├── test-data.js          # Datos de prueba (FoodieBoost)
│   └── auth.setup.js         # Setup de autenticación
├── pages/                     # Page Object Model
│   ├── AuthPage.js
│   ├── BusinessTestPage.js
│   ├── BrandTestPage.js
│   ├── ChatPage.js
│   ├── CalendarPage.js
│   └── DashboardPage.js
├── flows/                     # Tests de flujos completos
│   ├── onboarding.spec.js    # Registro → Tests → Chat
│   ├── business-test.spec.js
│   ├── brand-test.spec.js
│   ├── chat.spec.js
│   └── calendar.spec.js
├── landing.spec.js           # (existente)
├── creators-landing.spec.js  # (existente)
├── auth.spec.js              # (existente)
└── navigation.spec.js        # (existente)
```

---

## Datos de Prueba - FoodieBoost

### Archivo: `e2e/fixtures/test-data.js`

```javascript
/**
 * Test Data - FoodieBoost (Fake Business)
 * Copy-paste ready answers for manual testing or E2E tests
 */

export const TEST_USER = {
  email: 'test@foodieboost.com',
  password: 'TestPassword123!',
  name: 'Test User'
};

export const BUSINESS_TEST_ANSWERS = {
  // Section 1: Business Context
  businessDescription: 'We help restaurants and food businesses grow their online presence through social media marketing and local SEO',
  websiteUrl: 'https://foodieboost.com',
  businessStage: 'already_selling',

  // Section 2: Business Model
  businessFocus: 'b2b',
  // priorityFocus: skip (only if businessFocus === 'both')
  revenueGeneration: 'Monthly retainer subscriptions starting at $500/month, plus one-time setup fees for new clients',
  servicesProductsDescription: 'Social media management packages for restaurants including content creation, posting, community management, and monthly analytics reports',

  // Section 3: Core Offer
  mainBenefit: 'Increase restaurant bookings by 40% through consistent social media presence without owners spending time on marketing',
  differentiator: 'We specialize exclusively in restaurants and food businesses, understanding the industry unique challenges like seasonal menus and local competition',
  promisedResult: 'Double your Instagram followers and increase table reservations by 30% within 90 days',

  // Section 4: Ideal Customer
  idealCustomer: 'Independent restaurant owners with 1-3 locations, annual revenue $500K-$2M, struggling to maintain consistent social media presence',
  customerLocation: 'Local restaurant associations, Instagram food hashtags, Yelp business forums, local Chamber of Commerce events',
  whyChooseYou: 'We understand the restaurant industry deeply and deliver done-for-you content that actually converts followers into diners',

  // Section 5: Positioning & Market
  mainCompetitors: 'Local marketing agencies, Fiverr freelancers, in-house staff doing social media part-time',
  associatedKeywords: ['Marketing', 'Social Media', 'B2B', 'Strategy', 'Content'],
  brandDiscoveryPreference: 'Google search for restaurant marketing, Instagram discovery, referrals from happy clients',
  tagline: 'Your restaurant deserves to be famous',

  // Section 6: Branding & Assets
  hasBrandGuidelines: 'yes',

  // Section 7: Marketing & Channels
  currentClientAcquisition: 'Referrals from existing clients, cold outreach via Instagram DMs to restaurant accounts, local networking events',

  // Section 8: Content & Execution
  contentCreationExperience: '3 years creating content for food brands, experienced with Reels, TikTok, and food photography',
  teamContentCreator: 'yes',
  interestedInPersonalBrand: 'yes',

  // Section 9: Growth & Priorities
  mainPriority: 'getting_clients',
  marketingBudget: '$2,000/month for ads and tools',
  upcomingEvents: 'Restaurant industry conference in September, launching new TikTok service package next month'
};

export const BRAND_TEST_ANSWERS = {
  // Add brand test answers here when needed
  teamDescriptionWords: ['Creative', 'Strategic', 'Friendly'],
  personalValues: ['Quality', 'Trust', 'Growth'],
  publicSpeakingComfort: 7
};

export const CHAT_PROMPTS = {
  simple: 'Dame 3 ideas de contenido para Instagram',
  withContext: 'Basado en mi negocio de marketing para restaurantes, dame ideas de posts para esta semana',
  script: 'Escribe un script para un Reel sobre tips de food photography'
};
```

---

## Page Objects

### Archivo: `e2e/pages/BusinessTestPage.js`

```javascript
/**
 * Page Object - Business Test
 */
export class BusinessTestPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/business-test/questions');
  }

  async fillTextarea(placeholder, value) {
    await this.page.locator(`textarea[placeholder*="${placeholder}" i]`).fill(value);
  }

  async fillInput(placeholder, value) {
    await this.page.locator(`input[placeholder*="${placeholder}" i]`).fill(value);
  }

  async selectRadio(value) {
    await this.page.locator(`[data-value="${value}"], input[value="${value}"]`).click();
  }

  async clickRadioByLabel(label) {
    await this.page.locator(`label:has-text("${label}")`).click();
  }

  async selectMultipleOptions(options) {
    for (const option of options) {
      await this.page.locator(`button:has-text("${option}"), [data-tag="${option}"]`).click();
    }
  }

  async clickNext() {
    await this.page.locator('button:has-text("Next"), button:has-text("Continue")').click();
  }

  async clickSubmit() {
    await this.page.locator('button:has-text("Submit"), button:has-text("Finish")').click();
  }

  async waitForCompletion() {
    await this.page.waitForURL(/.*connect-accounts|.*app/);
  }
}
```

### Archivo: `e2e/pages/ChatPage.js`

```javascript
/**
 * Page Object - Chat (Main App)
 */
export class ChatPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/app');
  }

  async sendMessage(message) {
    const input = this.page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i]');
    await input.fill(message);
    await this.page.locator('button[type="submit"], button:has(svg)').last().click();
  }

  async waitForResponse() {
    // Wait for AI response to appear
    await this.page.waitForSelector('[data-role="assistant"], .ai-message, .assistant-message', {
      timeout: 30000
    });
  }

  async getLastResponse() {
    const messages = await this.page.locator('[data-role="assistant"], .ai-message').all();
    return messages[messages.length - 1]?.textContent();
  }

  async startNewConversation() {
    await this.page.locator('button:has-text("New"), button[aria-label*="new"]').click();
  }
}
```

---

## Tests de Flujos Principales

### Archivo: `e2e/flows/business-test.spec.js`

```javascript
/**
 * E2E Test - Business Test Flow
 */
const { test, expect } = require('@playwright/test');
const { BUSINESS_TEST_ANSWERS, TEST_USER } = require('../fixtures/test-data');

test.describe('Business Test Flow', () => {

  test.beforeEach(async ({ page }) => {
    // TODO: Add authentication if needed
    await page.goto('/business-test/questions');
  });

  test('should complete full business test with FoodieBoost data', async ({ page }) => {
    const answers = BUSINESS_TEST_ANSWERS;

    // Step 1: Business Description
    await page.locator('textarea').fill(answers.businessDescription);
    await page.locator('button:has-text("Next")').click();

    // Step 2: Website URL
    await page.locator('input[type="url"], input[placeholder*="http"]').fill(answers.websiteUrl);
    await page.locator('button:has-text("Next")').click();

    // Step 3: Business Stage
    await page.locator(`label:has-text("Already Selling")`).click();
    await page.locator('button:has-text("Next")').click();

    // Step 4: Business Focus
    await page.locator(`label:has-text("B2B")`).click();
    await page.locator('button:has-text("Next")').click();

    // Step 5: Revenue Generation
    await page.locator('textarea').fill(answers.revenueGeneration);
    await page.locator('button:has-text("Next")').click();

    // Step 6: Services/Products
    await page.locator('textarea').fill(answers.servicesProductsDescription);
    await page.locator('button:has-text("Next")').click();

    // Step 7: Main Benefit
    await page.locator('textarea').fill(answers.mainBenefit);
    await page.locator('button:has-text("Next")').click();

    // Step 8: Differentiator
    await page.locator('textarea').fill(answers.differentiator);
    await page.locator('button:has-text("Next")').click();

    // Step 9: Promised Result
    await page.locator('textarea').fill(answers.promisedResult);
    await page.locator('button:has-text("Next")').click();

    // Step 10: Ideal Customer
    await page.locator('textarea').fill(answers.idealCustomer);
    await page.locator('button:has-text("Next")').click();

    // Step 11: Customer Location
    await page.locator('textarea').fill(answers.customerLocation);
    await page.locator('button:has-text("Next")').click();

    // Step 12: Why Choose You
    await page.locator('textarea').fill(answers.whyChooseYou);
    await page.locator('button:has-text("Next")').click();

    // Step 13: Competitors
    await page.locator('textarea').fill(answers.mainCompetitors);
    await page.locator('button:has-text("Next")').click();

    // Step 14: Keywords (multiselect)
    for (const keyword of answers.associatedKeywords) {
      await page.locator(`button:has-text("${keyword}")`).click();
    }
    await page.locator('button:has-text("Next")').click();

    // Step 15: Brand Discovery
    await page.locator('textarea').fill(answers.brandDiscoveryPreference);
    await page.locator('button:has-text("Next")').click();

    // Step 16: Tagline
    await page.locator('textarea').fill(answers.tagline);
    await page.locator('button:has-text("Next")').click();

    // Step 17: Brand Guidelines
    await page.locator(`label:has-text("Yes")`).click();
    await page.locator('button:has-text("Next")').click();

    // Step 18: Client Acquisition
    await page.locator('textarea').fill(answers.currentClientAcquisition);
    await page.locator('button:has-text("Next")').click();

    // Step 19: Content Experience
    await page.locator('textarea').fill(answers.contentCreationExperience);
    await page.locator('button:has-text("Next")').click();

    // Step 20: Team Content Creator
    await page.locator(`label:has-text("Yes")`).click();
    await page.locator('button:has-text("Next")').click();

    // Step 21: Personal Brand
    await page.locator(`label:has-text("Yes")`).click();
    await page.locator('button:has-text("Next")').click();

    // Step 22: Main Priority
    await page.locator(`label:has-text("Getting clients")`).click();
    await page.locator('button:has-text("Next")').click();

    // Step 23: Marketing Budget
    await page.locator('textarea').fill(answers.marketingBudget);
    await page.locator('button:has-text("Next")').click();

    // Step 24: Upcoming Events
    await page.locator('textarea').fill(answers.upcomingEvents);
    await page.locator('button:has-text("Submit"), button:has-text("Finish")').click();

    // Should redirect to success/next step
    await expect(page).toHaveURL(/connect-accounts|app|test-selection/);
  });

  test('should allow skipping optional fields', async ({ page }) => {
    // Fill only required fields
    // ... test implementation
  });

  test('should persist answers when navigating back', async ({ page }) => {
    // Fill a field, go next, go back, verify field is still filled
    // ... test implementation
  });
});
```

---

## Comandos Disponibles

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar con UI visual (debug mode)
npm run test:e2e:ui

# Ejecutar con browser visible
npm run test:e2e:headed

# Ver reporte HTML
npm run test:e2e:report

# Ejecutar un test específico
npx playwright test e2e/flows/business-test.spec.js

# Ejecutar con filtro
npx playwright test --grep "business test"
```

---

## Flows a Implementar (Prioridad)

### Alta Prioridad
1. **Business Test completo** - Llenar todas las preguntas con FoodieBoost
2. **Brand Test completo** - Llenar todas las preguntas
3. **Login/Register flow** - Auth completo
4. **Chat básico** - Enviar mensaje y recibir respuesta

### Media Prioridad
5. **Calendar** - Crear/editar evento
6. **Dashboard** - Verificar carga de datos
7. **Scripts** - Guardar/editar scripts
8. **Profile Settings** - Cambiar configuración

### Baja Prioridad
9. **Integrations** - Mock de conexiones sociales
10. **Billing** - Verificar UI de planes

---

## Setup de Autenticación (Para tests que requieren login)

### Archivo: `e2e/fixtures/auth.setup.js`

```javascript
/**
 * Authentication Setup
 * Runs once before tests to create authenticated state
 */
const { test: setup } = require('@playwright/test');
const { TEST_USER } = require('./test-data');

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/auth');

  // Fill login form
  await page.locator('input[type="email"]').fill(TEST_USER.email);
  await page.locator('input[type="password"]').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();

  // Wait for redirect to app
  await page.waitForURL('/app**');

  // Save auth state
  await page.context().storageState({ path: authFile });
});
```

### Actualizar `playwright.config.js`:

```javascript
module.exports = defineConfig({
  // ... existing config

  projects: [
    // Setup project - runs first
    { name: 'setup', testMatch: /.*\.setup\.js/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use saved auth state
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

---

## Quick Reference - Respuestas para Copy/Paste Manual

Si necesitas llenar el test manualmente, copia estas respuestas:

| Pregunta | Respuesta |
|----------|-----------|
| Business description | We help restaurants and food businesses grow their online presence through social media marketing and local SEO |
| Website | https://foodieboost.com |
| Business stage | Already Selling |
| Business focus | B2B |
| Revenue generation | Monthly retainer subscriptions starting at $500/month, plus one-time setup fees for new clients |
| Services/Products | Social media management packages for restaurants including content creation, posting, community management, and monthly analytics reports |
| Main benefit | Increase restaurant bookings by 40% through consistent social media presence without owners spending time on marketing |
| Differentiator | We specialize exclusively in restaurants and food businesses, understanding the industry unique challenges like seasonal menus and local competition |
| Promised result | Double your Instagram followers and increase table reservations by 30% within 90 days |
| Ideal customer | Independent restaurant owners with 1-3 locations, annual revenue $500K-$2M, struggling to maintain consistent social media presence |
| Customer location | Local restaurant associations, Instagram food hashtags, Yelp business forums, local Chamber of Commerce events |
| Why choose you | We understand the restaurant industry deeply and deliver done-for-you content that actually converts followers into diners |
| Competitors | Local marketing agencies, Fiverr freelancers, in-house staff doing social media part-time |
| Keywords | Marketing, Social Media, B2B, Strategy, Content |
| Brand discovery | Google search for restaurant marketing, Instagram discovery, referrals from happy clients |
| Tagline | Your restaurant deserves to be famous |
| Brand guidelines | Yes |
| Client acquisition | Referrals from existing clients, cold outreach via Instagram DMs to restaurant accounts, local networking events |
| Content experience | 3 years creating content for food brands, experienced with Reels, TikTok, and food photography |
| Team content creator | Yes |
| Personal brand | Yes |
| Main priority | Getting clients |
| Marketing budget | $2,000/month for ads and tools |
| Upcoming events | Restaurant industry conference in September, launching new TikTok service package next month |

---

## Siguiente Paso

1. Crea el archivo `e2e/fixtures/test-data.js` con los datos
2. Crea el test `e2e/flows/business-test.spec.js`
3. Ejecuta: `npm run test:e2e:headed` para ver en acción

**Tiempo estimado de implementación:** 2-4 horas para tests básicos
