import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import marneeLogo from '../assets/marnee-logo.png';

const WAITLIST_URL = 'https://tally.so/r/D4NkGl';

/* ── SUB-COMPONENTS ──────────────────────────────────────── */

function LandingNav({ onLoginClick }) {
  return (
    <nav className="mn-nav">
      <div className="mn-nav-inner">
        <button className="mn-logo" onClick={onLoginClick} aria-label="Marnee home">
          <img src={marneeLogo} alt="Marnee" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
          Marnee
        </button>

        <div className="mn-nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#waitlist">Pricing</a>
        </div>

        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mn-nav-pill"
        >
          Join the waitlist
        </a>
      </div>
    </nav>
  );
}

function HeroSection({ titleRef }) {
  return (
    <section className="mn-hero">
      <div className="mn-hero-inner">

        <div className="mn-hero-tag mn-fade-up">
          <span className="mn-hero-tag-dot" />
          Your AI CMO, starting first as a social media strategist
        </div>

        {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
        <h1 className="mn-hero-title" ref={titleRef} id="hero-title" aria-label="Marketing intelligence for global growth." />

        <div className="mn-hero-stats mn-fade-up" style={{ transitionDelay: '.2s' }}>
          <div className="mn-stat-t">
            <div className="mn-stat-t-num">20x</div>
            <div className="mn-stat-t-label">faster than any agency<br />or manual strategy</div>
          </div>
          <div className="mn-stat-divider" />
          <div className="mn-stat-t">
            <div className="mn-stat-t-num">40x</div>
            <div className="mn-stat-t-label">cheaper than any CMO<br />or marketing agency</div>
          </div>
        </div>

        <p className="mn-hero-body mn-fade-up" style={{ transitionDelay: '.3s' }}>
          She builds your strategy, spots trends,<br />and guides every decision.
        </p>

        <div className="mn-hero-cta mn-fade-up" style={{ transitionDelay: '.4s' }}>
          <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="mn-btn-primary">
            Join the waitlist
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#how" className="mn-btn-ghost">See how it works</a>
        </div>

        <div className="mn-hero-proof mn-fade-up" style={{ transitionDelay: '.5s' }}>
          <div className="mn-proof-avs">
            <div className="mn-proof-av">A</div>
            <div className="mn-proof-av">S</div>
            <div className="mn-proof-av">J</div>
            <div className="mn-proof-av">M</div>
          </div>
          <span><strong>20+ founders</strong> already on the waitlist</span>
        </div>

      </div>
    </section>
  );
}

function Ticker() {
  const items = [
    'AI-Powered Strategy', 'Trend Detection', 'Brand Intelligence',
    'Content Calendar', '20x Faster', '40x Cheaper', 'Global Growth',
  ];
  // Duplicate for seamless loop
  const all = [...items, ...items];

  return (
    <div className="mn-ticker">
      <div className="mn-ticker-track">
        {all.map((item, i) => (
          <div className="mn-ticker-item" key={i}>{item}</div>
        ))}
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="mn-problem">
      <div className="mn-section-wrap">
        <div className="mn-problem-head mn-fade-up">
          <div className="mn-section-tag">The Problem</div>
          <h2 className="mn-section-title">
            Marketing shouldn't feel like<br />throwing darts in the dark
          </h2>
        </div>

        <div className="mn-grid-3" style={{ marginBottom: 1 }}>
          {[
            {
              n: '01',
              title: 'No clarity on what to post',
              body: "You're constantly guessing what content will resonate with your audience. It costs you time and engagement.",
            },
            {
              n: '02',
              title: 'Trends move too fast',
              body: "By the time you spot a trend, it's already old news. You're always one step behind your competitors.",
            },
            {
              n: '03',
              title: 'Strategy is expensive',
              body: "Building a content strategy from scratch takes time you don't have. Expertise that costs thousands per month.",
              delay: '.2s',
            },
          ].map(({ n, title, body, delay }, i) => (
            <div
              className="mn-pain-card mn-card-base mn-fade-up"
              key={n}
              style={delay ? { transitionDelay: delay } : { transitionDelay: `${i * 0.1}s` }}
            >
              <div className="mn-pain-num">{n}</div>
              <div className="mn-pain-title">{title}</div>
              <div className="mn-pain-body">{body}</div>
            </div>
          ))}
        </div>

        <div className="mn-stat-row">
          {[
            { num: '73%', txt: 'of founders struggle with content strategy', delay: '0s' },
            { num: '15h', txt: 'average weekly time spent on content planning', delay: '.1s' },
            { num: '60%', txt: 'of social posts underperform expectations', delay: '.2s' },
            { num: '₩3M', txt: 'average monthly cost of a marketing agency in Korea', delay: '.3s' },
          ].map(({ num, txt, delay }) => (
            <div className="mn-stat-box mn-card-base mn-fade-up" key={num} style={{ transitionDelay: delay }}>
              <div className="mn-stat-box-num">{num}</div>
              <div className="mn-stat-box-txt">{txt}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="mn-solution">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">The Solution</div>
          <h2 className="mn-section-title">Marnee gives you clarity,<br />not complexity</h2>
          <p className="mn-section-sub">
            She analyzes what's working in your niche and turns it into a personalized strategy you can actually execute.
          </p>
        </div>

        <div className="mn-grid-3" style={{ marginTop: 48 }}>
          {[
            {
              n: '01',
              title: 'AI-Powered Research',
              body: "Marnee scans thousands of posts in your niche to find what's actually working right now. No guessing.",
            },
            {
              n: '02',
              title: 'Brand-First Strategy',
              body: 'Every suggestion is tailored to your unique tone, audience, and positioning. No copy-paste templates, ever.',
              delay: '.1s',
            },
            {
              n: '03',
              title: 'Ready-to-Execute Plans',
              body: 'Get complete content briefs with hooks, angles, and visual direction. Ready for UGC, AI or talking head production.',
              delay: '.2s',
            },
          ].map(({ n, title, body, delay }) => (
            <div
              className="mn-sol-card mn-card-base mn-fade-up"
              key={n}
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className="mn-sol-num">{n}</div>
              <div className="mn-sol-title">{title}</div>
              <div className="mn-sol-body">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section className="mn-how" id="how">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">How it works</div>
          <h2 className="mn-section-title">Three steps to marketing clarity</h2>
          <p className="mn-section-sub">From brand definition to a complete content strategy, in minutes. Not months.</p>
        </div>

        <div className="mn-steps">
          <div className="mn-step mn-fade-up" data-n="01">
            <div className="mn-step-line" />
            <div className="mn-step-title">Define your brand</div>
            <div className="mn-step-body">
              Complete our branding questionnaire. Marnee matches your answers with real-time social research from your niche.
            </div>
          </div>
          <div className="mn-step mn-fade-up" data-n="02" style={{ transitionDelay: '.15s' }}>
            <div className="mn-step-line" />
            <div className="mn-step-title">Marnee builds your strategy</div>
            <div className="mn-step-body">
              She suggests angles, formats, hooks and explains why. You approve, tweak or discard. You stay in control.
            </div>
          </div>
          <div className="mn-step mn-fade-up" data-n="03" style={{ transitionDelay: '.3s' }}>
            <div className="mn-step-title">Execute from your dashboard</div>
            <div className="mn-step-body">
              All decisions in your dashboard. Calendar and kanban view. One clear overview. No chaos, no guesswork.
            </div>
          </div>
        </div>

        <div className="mn-grid-4">
          {[
            {
              tag: 'Step 1 — Brand Discovery',
              title: 'Brand Discovery',
              body: 'Start with a quick questionnaire. Marnee learns about your brand, goals, audience, and tone to create a personalized strategy tailored just for you.',
            },
            {
              tag: 'Step 2 — AI Strategy',
              title: 'Chat with Marnee',
              body: 'Marnee asks questions, understands your brand, and builds your complete campaign strategy, thinking, planning, and explaining every recommendation.',
              delay: '.1s',
            },
            {
              tag: 'Step 3 — Content Calendar',
              title: 'Content Calendar',
              body: 'Marnee generates a complete publication calendar with dates, content ideas, and detailed instructions for each post. See your entire month at a glance.',
              delay: '.15s',
            },
            {
              tag: 'Coming Soon',
              title: 'Campaign Dashboard',
              body: 'View all active campaigns, track your task list, and monitor progress from a single command center.',
              comingSoon: true,
              delay: '.2s',
            },
          ].map(({ tag, title, body, comingSoon, delay }) => (
            <div
              className="mn-detail-card mn-card-base mn-fade-up"
              key={tag}
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className={`mn-detail-tag${comingSoon ? ' mn-gray' : ''}`}>{tag}</div>
              <div className={`mn-detail-title${comingSoon ? ' mn-dim' : ''}`}>{title}</div>
              <div
                className="mn-detail-body"
                style={comingSoon ? { color: 'rgba(30,30,30,0.3)' } : undefined}
              >
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  return (
    <section className="mn-demo">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Product Demo</div>
          <h2 className="mn-section-title">See Marnee in action</h2>
        </div>

        <div className="mn-demo-frame mn-fade-up" style={{ transitionDelay: '.1s' }}>
          <div className="mn-demo-bar">
            <div className="mn-demo-dot r" />
            <div className="mn-demo-dot y" />
            <div className="mn-demo-dot g" />
            <div className="mn-demo-url">app.marnee.ai — Campaign Manager</div>
          </div>
          <div className="mn-demo-body">
            <button className="mn-play-btn" aria-label="Play demo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="mn-demo-label">Product demo coming soon</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FeatureIcons = {
  TrendDetection: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  BrandIntelligence: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  AIStrategy: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.4-4.5 6.5V17h-5v-1.5C6.8 14.4 5 12 5 9a7 7 0 0 1 7-7z" />
      <rect x="9" y="17" width="6" height="2" rx="1" />
      <rect x="10" y="19" width="4" height="2" rx="1" />
    </svg>
  ),
  Dashboard: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  ContentReady: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  SaveTime: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

function FeaturesSection() {
  const features = [
    { Icon: FeatureIcons.TrendDetection, title: 'Trend Detection', body: 'Identify what\'s working right now in your niche with real-time social analysis across Instagram, TikTok, and more.' },
    { Icon: FeatureIcons.BrandIntelligence, title: 'Brand Intelligence', body: 'Your strategy adapts to your unique tone, audience and market positioning. The more you use Marnee, the smarter she gets.', delay: '.1s' },
    { Icon: FeatureIcons.AIStrategy, title: 'AI Strategy Guidance', body: 'Marnee explains, suggests and helps you decide. Not just generate. Strategy with context. Decisions with confidence.', delay: '.2s' },
    { Icon: FeatureIcons.Dashboard, title: 'Strategy Dashboard', body: 'All decisions in one place. Calendar and kanban views to keep you organized and your team aligned.', delay: '.1s' },
    { Icon: FeatureIcons.ContentReady, title: 'Content-Ready Outputs', body: 'Hooks, copy and visual direction. Ready for UGC, AI or talking head production. No creative block.', delay: '.2s' },
    { Icon: FeatureIcons.SaveTime, title: 'Save Hours Weekly', body: 'Reduce content planning from 15+ hours to under 2 hours per week. More time building, less time guessing.', delay: '.3s' },
  ];

  return (
    <section className="mn-features" id="features">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Features</div>
          <h2 className="mn-section-title">Built for speed, clarity<br />and consistency</h2>
        </div>

        <div className="mn-grid-3" style={{ marginTop: 56 }}>
          {features.map(({ Icon, title, body, delay }) => (
            <div
              className="mn-feat-card mn-card-base mn-fade-up"
              key={title}
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className="mn-feat-icon"><Icon /></div>
              <div className="mn-feat-title">{title}</div>
              <div className="mn-feat-body">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarneeSection() {
  return (
    <section className="mn-marnee-section">
      <div className="mn-marnee-inner">

        <div className="mn-fade-up">
          <div className="mn-section-tag">Your AI Partner</div>
          <h2 className="mn-section-title">
            Meet<br /><em>Marnee.</em>
          </h2>
          <div className="mn-marnee-role">AI Marketing Partner</div>
          <p className="mn-marnee-desc">
            Marnee helps you think, not just post. She explains the reasoning behind every suggestion,
            so you understand what works and why. You stay in control.
          </p>
          <div className="mn-marnee-asks">
            <div className="mn-marnee-ask">
              <div className="mn-ask-dot" />
              "What content should we test next week?"
            </div>
            <div className="mn-marnee-ask">
              <div className="mn-ask-dot" />
              "Rewrite this in a confident but warm tone."
            </div>
            <div className="mn-marnee-ask">
              <div className="mn-ask-dot" />
              "Why is this format performing better?"
            </div>
          </div>
          <div className="mn-marnee-quote">
            "Strategy with context.<br />Decisions with confidence."
          </div>
        </div>

        <div className="mn-fade-up" style={{ transitionDelay: '.15s' }}>
          <div className="mn-chat-wrap">
            <div className="mn-chat-header">
              <div className="mn-chat-av">M</div>
              <div>
                <div className="mn-chat-name">Marnee</div>
                <div className="mn-chat-status">AI Marketing Partner · Online</div>
              </div>
              <div className="mn-chat-online" />
            </div>
            <div className="mn-chat-body">
              <div className="mn-msg-row">
                <div className="mn-msg-av">M</div>
                <div className="mn-bubble-ai">
                  Based on your brand positioning and what's trending in your niche,
                  I recommend testing short-form educational content this week. Here's why...
                </div>
              </div>
              <div className="mn-msg-row">
                <div className="mn-msg-av">M</div>
                <div className="mn-bubble-ai">
                  Your competitors are seeing <strong>40% higher engagement</strong> with
                  myth-busting hooks. Want me to generate 5 variations for your brand?
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="mn-bubble-user">Yes, let's try that approach!</div>
              </div>
              <div className="mn-typing-row">
                <div className="mn-msg-av">M</div>
                <div className="mn-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function WhoSection() {
  const cards = [
    { n: '01', title: 'Early-stage startups',      body: 'Get your marketing foundation right from day one' },
    { n: '02', title: 'Founders who need clarity', body: 'Stop second-guessing every content decision', delay: '.08s' },
    { n: '03', title: 'Social media managers',     body: 'Streamline your workflow with AI-powered insights', delay: '.16s' },
    { n: '04', title: 'Small teams',                body: 'No marketing department? No problem.', delay: '.08s' },
    { n: '05', title: 'Multi-brand businesses',    body: 'Manage multiple brand strategies in one place', delay: '.16s' },
    { n: '06', title: 'Agencies & consultants',    body: 'Deliver structured strategies at scale', delay: '.24s' },
  ];

  return (
    <section className="mn-who">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Who it's for</div>
          <h2 className="mn-section-title">
            Built for those who need clarity,<br />not complexity
          </h2>
        </div>

        <div className="mn-grid-3" style={{ marginTop: 56 }}>
          {cards.map(({ n, title, body, delay }) => (
            <div
              className="mn-who-card mn-card-base mn-fade-up"
              key={n}
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className="mn-who-num">{n}</div>
              <div className="mn-who-title">{title}</div>
              <div className="mn-who-body">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="mn-cta-section" id="waitlist">
      <div className="mn-cta-inner">
        <div className="mn-cta-tag mn-fade-up">Ready to start?</div>
        <h2 className="mn-cta-title mn-fade-up" style={{ transitionDelay: '.1s' }}>
          Build your marketing<br />strategy with <em>Marnee.</em>
        </h2>
        <p className="mn-cta-sub mn-fade-up" style={{ transitionDelay: '.2s' }}>
          From zero clarity to a structured marketing plan, guided by AI.
          Be among the first to experience Marnee.
        </p>
        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mn-cta-btn mn-fade-up"
          style={{ transitionDelay: '.3s' }}
        >
          Join the waitlist
        </a>
        <div className="mn-cta-note mn-fade-up" style={{ transitionDelay: '.4s' }}>
          No spam, ever. Unsubscribe anytime.
        </div>
      </div>
    </section>
  );
}

function LandingFooter({ onLoginClick }) {
  return (
    <footer className="mn-footer">
      <div className="mn-footer-inner">
        <div className="mn-footer-top">
          <div>
            <div className="mn-footer-brand">Marnee</div>
            <p className="mn-footer-desc">
              Your AI CMO. Turning social signals into marketing decisions
              tailored to your brand and goals.
            </p>
          </div>
          <div>
            <div className="mn-footer-col-title">Product</div>
            <div className="mn-footer-links">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <span>Roadmap</span>
            </div>
          </div>
          <div>
            <div className="mn-footer-col-title">Company</div>
            <div className="mn-footer-links">
              <span>About</span>
              <span>Blog</span>
              <span>Contact</span>
              <span onClick={onLoginClick} style={{ cursor: 'pointer' }}>Login</span>
            </div>
          </div>
        </div>
        <div className="mn-footer-bottom">
          <div className="mn-footer-copy">© 2026 Marnee. All rights reserved.</div>
          <div className="mn-footer-legal">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── TYPEWRITER HOOK ─────────────────────────────────────── */
function useTypewriter(titleRef) {
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    // Clear any leftover DOM from React Strict Mode double-invoke
    titleEl.innerHTML = '';

    let cancelled = false;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      cursor.textContent = '|';
      titleEl.appendChild(cursor);

      const lines = [
        ['Social media marketing', false, false],
        ['intelligence for ', false, false],
        ['global growth.', true, true],
      ];

      await delay(320);

      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;
        const [text, italic, noBreak] = lines[i];

        if (i > 0 && !noBreak) {
          const br = document.createElement('br');
          titleEl.insertBefore(br, cursor);
          await delay(180);
        }

        const el = document.createElement(italic ? 'em' : 'span');
        if (!italic) el.style.cssText = 'font-style:normal; color:inherit;';
        titleEl.insertBefore(el, cursor);

        for (const char of text) {
          if (cancelled) return;
          el.textContent += char;
          await delay(48 + Math.random() * 32);
        }

        if (i === 0) await delay(220);
      }

      if (cancelled) return;
      await delay(500);

      cursor.classList.remove('type-cursor');
      cursor.classList.add('cur-click');

      await delay(120);
      if (!cancelled) titleEl.classList.add('title-done');

      await delay(380);
      if (!cancelled) cursor.remove();
    })();

    return () => {
      cancelled = true;
      if (titleEl) titleEl.innerHTML = '';
    };
  }, [titleRef]);
}

/* ── FADE-UP OBSERVER HOOK ───────────────────────────────── */
function useFadeUpObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.mn-fade-up').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* ── PAGE ────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const titleRef = useRef(null);

  useTypewriter(titleRef);
  useFadeUpObserver();

  const handleLoginClick = () => navigate('/auth');

  return (
    <>
      <LandingNav onLoginClick={handleLoginClick} />
      <HeroSection titleRef={titleRef} />
      <Ticker />
      <ProblemSection />
      <SolutionSection />
      <HowSection />
      <DemoSection />
      <FeaturesSection />
      <MarneeSection />
      <WhoSection />
      <CtaSection />
      <LandingFooter onLoginClick={handleLoginClick} />
    </>
  );
}
