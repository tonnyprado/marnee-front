# Marnee Frontend

AI-powered marketing assistant platform that helps businesses create content, plan strategies, and manage campaigns.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Features](#features)
- [Testing](#testing)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)

## Overview

Marnee is an intelligent marketing assistant that combines AI-powered content generation with social media management tools. The platform helps founders and marketers:

- Generate marketing content with AI assistance
- Plan and schedule social media posts
- Analyze performance metrics
- Connect multiple social platforms
- Manage brand identity and strategy

## Tech Stack

### Core
- **React** 19.x - UI framework
- **React Router** 7.x - Client-side routing
- **Context API** - State management

### UI & Styling
- **Material-UI (MUI)** 9.x - Component library
- **Tailwind CSS** 3.x - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Features
- **Chart.js** - Data visualization
- **Fabric.js** - Canvas/image editing
- **React Force Graph** - Knowledge graph visualization
- **jsPDF** - PDF generation
- **React Markdown** - Markdown rendering

### Testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **Jest** - Test runner

## Project Structure

```
src/
├── admin/                    # Admin panel (13 pages)
│   ├── components/          # Admin-specific components
│   └── pages/               # Admin pages (users, security, analytics)
│
├── Component/               # Main application components
│   ├── Calendar/           # Content calendar
│   ├── Chat/               # AI chat interface
│   ├── Dashboard/          # Analytics dashboard
│   ├── ImageGenerator/     # Image creation/editing
│   ├── InteractiveTest/    # Onboarding tests
│   ├── Navbar/             # Navigation
│   └── ui/                 # Reusable UI components
│
├── Pages/                   # Application pages
│   ├── Tools/              # Main features (Chat, Calendar, etc.)
│   └── Legal/              # Terms & Privacy pages
│
├── context/                 # React Context providers
│   ├── AuthContext.jsx     # Authentication state
│   ├── MarneeContext.jsx   # Application state
│   ├── LanguageContext.jsx # i18n
│   └── ChatThemeContext.jsx
│
├── hooks/                   # Custom React hooks (14 total)
│   ├── useChat.js          # Chat functionality
│   ├── useBrandProfile.js  # Brand profile management
│   ├── useImageGenerator.js
│   └── ... (11 more)
│
├── core/                    # Core utilities
│   ├── services/
│   │   ├── ApiClient.js    # HTTP client
│   │   ├── StorageService.js # Local storage abstraction
│   │   ├── ErrorHandler.js
│   │   └── RateLimiter.js
│   └── utils/
│       ├── auth.js         # Auth utilities
│       ├── logger.js       # Logging
│       └── transformers.js
│
├── services/                # API services (18 files)
│   ├── api.js              # Main API (chat, messages)
│   ├── adminApi.js         # Admin endpoints
│   ├── instagramApi.js     # Instagram integration
│   ├── metaAdsApi.js       # Meta Ads
│   └── ... (14 more)
│
├── guards/                  # Route protection
├── i18n/                    # Internationalization
├── constants/               # App constants
├── assets/                  # Images, videos
└── __tests__/              # Test files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd marnee-front

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:3000`

### Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
```

## Architecture

### State Management (3 Layers)

```
┌─────────────────────────────────────────────────────────┐
│                    Context Layer                         │
│  AuthContext │ MarneeContext │ LanguageContext │ Theme  │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    Hooks Layer                           │
│  useChat │ useBrandProfile │ useImageGenerator │ ...    │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                   Services Layer                         │
│  ApiClient │ api.js │ instagramApi │ metaAdsApi │ ...   │
└─────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.js
├── LanguageProvider
│   └── ChatThemeProvider
│       └── AuthProvider
│           └── MarneeProvider
│               ├── Public Routes
│               │   ├── PresentationPage
│               │   ├── AuthPage
│               │   └── TestPages
│               │
│               ├── Protected Routes (/app)
│               │   ├── ChatPage
│               │   ├── CalendarPage
│               │   ├── DashboardPage
│               │   ├── BrainstormingPage
│               │   └── ScriptsPage
│               │
│               └── Admin Routes (/admin)
│                   ├── AdminDashboard
│                   ├── UserManagement
│                   └── SecurityDashboard
```

### Data Flow

1. **User Action** → Component triggers hook method
2. **Hook** → Calls service API
3. **Service** → HTTP request via ApiClient
4. **Response** → Updates Context state
5. **Context** → Re-renders subscribed components

## Features

### Core Features

| Feature | Description |
|---------|-------------|
| **AI Chat** | Multi-conversation AI assistant for content creation |
| **Content Calendar** | Visual calendar for planning and scheduling posts |
| **Image Generator** | AI image generation + Fabric.js editor |
| **Brainstorming** | Idea storage and organization |
| **Scripts** | Content script management |
| **Dashboard** | Analytics with knowledge graph visualization |

### Social Integrations

- **Google Analytics** - Traffic and conversion tracking
- **Instagram Business** - Posting and analytics
- **Meta Ads** - Ad campaign management
- **TikTok** - Content distribution

### Admin Panel

- User management (CRUD, roles)
- Subscription plans
- Security dashboard (audit logs, sessions, alerts)
- AI prompt management
- RAG (Retrieval Augmented Generation) management
- SEO management

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- --testPathPattern="ApiClient"

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui
```

### Test Structure

```
src/__tests__/
├── core/
│   ├── services/       # ApiClient, ErrorHandler, RateLimiter
│   └── utils/          # auth, logger, transformers
├── hooks/              # Custom hook tests
├── components/         # Component tests
│   └── ui/            # UI component tests
└── context/           # Context tests
```

### Coverage Goals

- Current: ~10% line coverage
- Target: 30%+ line coverage

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | E2E tests with Playwright UI |
| `npm run test:e2e:headed` | E2E tests in headed mode |
| `npm run analyze` | Analyze bundle size |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | Yes |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | For Google integration |
| `REACT_APP_FACEBOOK_APP_ID` | Facebook App ID | For Meta integrations |
| `REACT_APP_INSTAGRAM_CLIENT_ID` | Instagram client ID | For Instagram integration |

## Performance Optimizations

- **Code Splitting**: Lazy loading for non-critical pages
- **Memoization**: useMemo in contexts for expensive computations
- **Image Optimization**: Fabric.js for client-side image processing
- **Rate Limiting**: Client-side request throttling
- **Storage Abstraction**: React Native-ready StorageService

## Security Features

- JWT token management with expiration handling
- Session storage encryption
- Rate limiting (client + server)
- XSS prevention with SafeText component
- Input sanitization in StorageService
- Admin role verification (RequireAdmin guard)
- Audit logging

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Submit a pull request

## License

Proprietary - All rights reserved

---

Built with React by the Marnee Team
