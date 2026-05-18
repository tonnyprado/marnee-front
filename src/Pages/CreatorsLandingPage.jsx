import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marneeLogo from '../assets/marnee-logo.png';
import LoadingTransition from '../Component/LoadingTransition';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Replace with your Formspree form ID (formspree.io) or your own backend endpoint
// e.g. 'https://formspree.io/f/YOUR_FORM_ID'  or  '/api/waitlist'
const WAITLIST_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
// ──────────────────────────────────────────────────────────────────────────────

/* ── WAITLIST FORM ────────────────────────────────────────── */
function WaitlistForm({ size = 'hero' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const isHero = size === 'hero';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setStatus('loading');
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={`mn-waitlist-success ${isHero ? 'mn-waitlist-success--hero' : ''}`}>
        <div className="mn-waitlist-success-icon">✓</div>
        <div>
          <div className="mn-waitlist-success-title">You're on the list!</div>
          <div className="mn-waitlist-success-sub">We'll email you as soon as Marnee for creators is ready.</div>
        </div>
      </div>
    );
  }

  return (
    <form
      className={`mn-waitlist-form ${isHero ? 'mn-waitlist-form--hero' : ''}`}
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="mn-waitlist-input"
        required
        disabled={status === 'loading'}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="mn-waitlist-btn"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className="mn-waitlist-spinner" />
        ) : (
          'Join the waitlist'
        )}
      </button>
      {status === 'error' && (
        <p className="mn-waitlist-error">Something went wrong. Try again.</p>
      )}
    </form>
  );
}

/* ── NAV ──────────────────────────────────────────────────── */
function CreatorsNav({ onLoginClick }) {
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
          <a href="#waitlist">Join waitlist</a>
        </div>

        <div className="mn-nav-actions">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#40086d] transition-colors"
          >
            Sign In
          </button>
          <a href="#waitlist" className="mn-nav-pill">
            Get early access
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ── HERO ─────────────────────────────────────────────────── */
function HeroSection({ titleRef }) {
  return (
    <section className="mn-hero mn-hero--creators">
      <div className="mn-hero-inner">

        <div className="mn-hero-tag mn-hero-anim" style={{ fontSize: 11, animationDelay: '0s' }}>
          <span className="mn-hero-tag-dot" />
          Built for content creators
        </div>

        <h1 className="mn-hero-title" ref={titleRef} id="hero-title" aria-label="Save your time and get direct recommendations tailored to your niche & data." style={{ fontSize: 'clamp(28px, 3.2vw, 50px)' }} />

        <p className="mn-hero-body mn-hero-anim" style={{ animationDelay: '.3s', maxWidth: 680 }}>
          Marnee is your AI content strategist. Tell her your niche and goals, and she builds your full content strategy in minutes with no guessing.
        </p>

        <div className="mn-hero-stats mn-hero-anim" style={{ animationDelay: '.35s' }}>
          <div className="mn-hero-stat mn-hero-stat--hoverable">
            <div className="mn-hero-stat-num">10x</div>
            <div className="mn-hero-stat-label">EASIER THAN SETTING ANY AI GENERAL TOOL</div>
          </div>
          <div className="mn-hero-stat mn-hero-stat--hoverable">
            <div className="mn-hero-stat-num">2x</div>
            <div className="mn-hero-stat-label">CHEAPER THAN OTHER LLM'S + TAILORED TO YOU</div>
          </div>
        </div>

        <div className="mn-hero-anim" style={{ animationDelay: '.4s' }}>
          <p className="mn-hero-founder-note">
            Early access is limited. Founder price: <strong>₩15,000 KRW / $11</strong> <span>(regular price ₩25,000)</span>
          </p>
          <WaitlistForm size="hero" />
        </div>

        <div className="mn-hero-proof mn-hero-anim" style={{ animationDelay: '.5s', marginTop: 16 }}>
          <div className="mn-proof-avs">
            <div className="mn-proof-av">A</div>
            <div className="mn-proof-av">S</div>
            <div className="mn-proof-av">J</div>
            <div className="mn-proof-av">M</div>
          </div>
          <span><strong>100+ creators</strong> already on the waitlist</span>
        </div>

      </div>

      <div className="mn-hero-ticker-anchor">
        <Ticker />
      </div>
    </section>
  );
}

/* ── TICKER ───────────────────────────────────────────────── */
function Ticker() {
  const items = [
    'Global Growth', 'Trend Detection', 'Idea Generation', 'Script Generation',
    'Content Calendar', 'Brand Intelligence', 'Personal Branding', 'Niche Research',
    'Hook Writing', 'Audience Insights', 'AI-Powered Strategy', '40X Cheaper',
  ];
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

/* ── PROBLEM ──────────────────────────────────────────────── */
function ProblemSection() {
  return (
    <section className="mn-problem">
      <div className="mn-section-wrap">
        <div className="mn-problem-head mn-fade-up">
          <div className="mn-section-tag">The creator struggle is real</div>
          <h2 className="mn-section-title">
            You create every day.<br />But growth still feels random.
          </h2>
        </div>

        <div className="mn-grid-3" style={{ marginBottom: 1 }}>
          {[
            {
              n: '01',
              title: 'You don\'t know what to post',
              body: 'You spend hours brainstorming and still end up posting something average. Content block is killing your momentum.',
            },
            {
              n: '02',
              title: 'The algorithm keeps changing',
              body: 'What worked last month tanks today. You\'re always reactive, never ahead of the curve.',
              delay: '.1s',
            },
            {
              n: '03',
              title: 'No strategy, just vibes',
              body: 'You post consistently but without a real plan. Growth is slow, inconsistent, and impossible to scale.',
              delay: '.2s',
            },
          ].map(({ n, title, body, delay }) => (
            <div
              className="mn-pain-card mn-card-base mn-fade-up"
              key={n}
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className="mn-pain-num">{n}</div>
              <div className="mn-pain-title">{title}</div>
              <div className="mn-pain-body">{body}</div>
            </div>
          ))}
        </div>

        <div className="mn-stat-row">
          {[
            { num: '15h+', txt: 'spent on content planning every week', delay: '0s' },
            { num: '73%', txt: 'of creators feel burned out regularly', delay: '.1s' },
            { num: '3x', txt: 'more growth with a consistent strategy', delay: '.2s' },
            { num: '2h', txt: 'is all you need with Marnee', delay: '.3s' },
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

/* ── HOW IT WORKS ─────────────────────────────────────────── */
function HowSection() {
  return (
    <section className="mn-how" id="how">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">How it works</div>
          <h2 className="mn-section-title">From "what do I post?" to a full strategy — in minutes</h2>
          <p className="mn-section-sub">Tell Marnee about yourself. She does the rest.</p>
        </div>

        <div className="mn-steps">
          <div className="mn-step mn-fade-up" data-n="01">
            <div className="mn-step-line" />
            <div className="mn-step-title">Tell Marnee about your niche</div>
            <div className="mn-step-body">
              Answer a few quick questions about your content style, audience, and goals.
              No agency. No consultant. Just you and your AI strategist.
            </div>
          </div>
          <div className="mn-step mn-fade-up" data-n="02" style={{ transitionDelay: '.15s' }}>
            <div className="mn-step-line" />
            <div className="mn-step-title">Marnee builds your strategy</div>
            <div className="mn-step-body">
              She scans what's trending in your niche, generates content angles, hooks,
              formats and a full posting calendar. Tailored to you.
            </div>
          </div>
          <div className="mn-step mn-fade-up" data-n="03" style={{ transitionDelay: '.3s' }}>
            <div className="mn-step-title">Execute with confidence</div>
            <div className="mn-step-body">
              Your content calendar is ready. Post with intention. Track what works.
              Grow consistently — without burning out.
            </div>
          </div>
        </div>

        <div className="mn-grid-4">
          {[
            {
              tag: 'Step 1 — Niche Setup',
              title: 'Your creator profile',
              body: 'Marnee learns your niche, your audience, your tone, and your goals. It takes 3 minutes and unlocks everything.',
            },
            {
              tag: 'Step 2 — Trend Analysis',
              title: 'Real-time niche research',
              body: 'Marnee scans Instagram, TikTok, and YouTube Shorts to find what\'s getting views and engagement in your space right now.',
              delay: '.1s',
            },
            {
              tag: 'Step 3 — Content Plan',
              title: 'Your full content calendar',
              body: 'A month of content ideas, hooks, formats, and posting times — tailored to your niche and ready to execute.',
              delay: '.15s',
            },
            {
              tag: 'Coming soon',
              title: 'Performance tracking',
              body: 'See which content is hitting and let Marnee adjust your strategy automatically based on your results.',
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

/* ── FEATURES ─────────────────────────────────────────────── */
const Icons = {
  Trends: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Ideas: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.4-4.5 6.5V17h-5v-1.5C6.8 14.4 5 12 5 9a7 7 0 0 1 7-7z" />
      <rect x="9" y="17" width="6" height="2" rx="1" />
      <rect x="10" y="19" width="4" height="2" rx="1" />
    </svg>
  ),
  Calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Hook: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Time: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Growth: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

function FeaturesSection() {
  const features = [
    { Icon: Icons.Trends, title: 'Niche Trend Detection', body: 'See what\'s trending in your exact niche right now — before your competitors do. Never run out of relevant, timely ideas.' },
    { Icon: Icons.Ideas, title: 'Unlimited Content Ideas', body: 'Marnee generates hooks, angles, formats, and content briefs tailored to your brand voice and audience.', delay: '.1s' },
    { Icon: Icons.Calendar, title: 'Full Content Calendar', body: 'A complete month of content, organized by date, format, and platform. No more last-minute posting.', delay: '.2s' },
    { Icon: Icons.Hook, title: 'Hook & Copy Generator', body: 'Scroll-stopping hooks and captions written for your niche. Built for short-form: Reels, TikTok, Shorts.', delay: '.1s' },
    { Icon: Icons.Time, title: 'Save 10+ Hours a Week', body: 'Cut content planning from a full week\'s headache to under 2 hours. More time creating, less time overthinking.', delay: '.2s' },
    { Icon: Icons.Growth, title: 'Strategy That Compounds', body: 'Marnee learns what works for your audience and keeps improving your strategy over time. Growth that stacks.', delay: '.3s' },
  ];

  return (
    <section className="mn-features" id="features">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Features</div>
          <h2 className="mn-section-title">Everything you need to grow,<br />nothing you don't</h2>
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

/* ── WHO IT'S FOR ─────────────────────────────────────────── */
function WhoSection() {
  const cards = [
    { n: '01', title: 'UGC Creators', body: 'Build a strategy that attracts brand deals and helps you charge what you\'re worth.' },
    { n: '02', title: 'Beauty & Skincare', body: 'Stay on top of beauty trends and turn your passion into a consistent, growing channel.', delay: '.08s' },
    { n: '03', title: 'Lifestyle Creators', body: 'Turn your everyday life into a content engine with a strategy that feels authentic.', delay: '.16s' },
    { n: '04', title: 'Travel Creators', body: 'Plan your content ahead of every trip. Never leave a location without using it to grow.', delay: '.08s' },
    { n: '05', title: 'Fitness & Wellness', body: 'Build authority in your niche with educational content that converts followers into clients.', delay: '.16s' },
    { n: '06', title: 'Aspiring Influencers', body: 'Start with a real strategy from day one. No more random posting hoping something sticks.', delay: '.24s' },
  ];

  return (
    <section className="mn-who">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Who it's for</div>
          <h2 className="mn-section-title">
            Whatever you create,<br />Marnee makes it strategic
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

/* ── FINAL CTA ────────────────────────────────────────────── */
function CtaSection() {
  return (
    <section className="mn-cta-section" id="waitlist">
      <div className="mn-cta-inner">
        <div className="mn-cta-tag mn-fade-up">Early access</div>
        <h2 className="mn-cta-title mn-fade-up" style={{ transitionDelay: '.1s' }}>
          Be the first creator<br />to get <em>Marnee.</em>
        </h2>
        <p className="mn-cta-sub mn-fade-up" style={{ transitionDelay: '.2s' }}>
          We're building Marnee for creators like you. Join the waitlist and get
          early access, exclusive beta features, and a say in what we build next.
        </p>
        <div className="mn-fade-up" style={{ transitionDelay: '.3s' }}>
          <WaitlistForm size="cta" />
        </div>
        <div className="mn-cta-note mn-fade-up" style={{ transitionDelay: '.4s' }}>
          No spam, ever. Unsubscribe anytime.
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ───────────────────────────────────────────────── */
function CreatorsFooter({ onLoginClick }) {
  return (
    <footer className="mn-footer">
      <div className="mn-footer-inner">
        <div className="mn-footer-top">
          <div>
            <div className="mn-footer-brand">Marnee</div>
            <p className="mn-footer-desc">
              Your AI content strategist. Built for creators who want to grow
              with intention, not luck.
            </p>
          </div>
          <div>
            <div className="mn-footer-col-title">Product</div>
            <div className="mn-footer-links">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#waitlist">Join waitlist</a>
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
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── TYPEWRITER ───────────────────────────────────────────── */
function useTypewriter(titleRef, lines) {
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl || !lines || lines.length === 0) return;

    titleEl.innerHTML = '';
    let cancelled = false;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      cursor.textContent = '|';
      titleEl.appendChild(cursor);

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
  }, [titleRef, lines]);
}

/* ── FADE-UP OBSERVER ─────────────────────────────────────── */
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
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.mn-fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── PAGE ─────────────────────────────────────────────────── */
export default function CreatorsLandingPage() {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const typewriterLines = [
    ['Save your time and get direct', false, false],
    ['recommendations ', false, false],
    ['tailored to your niche & data.', true, true],
  ];

  useTypewriter(titleRef, typewriterLines);
  useFadeUpObserver();

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => navigate('/auth'), 800);
  };

  return (
    <>
      <LoadingTransition isLoading={isLoading} message="Redirecting..." />
      <CreatorsNav onLoginClick={handleLoginClick} />
      <HeroSection titleRef={titleRef} />
      <ProblemSection />
      <HowSection />
      <FeaturesSection />
      <WhoSection />
      <CtaSection />
      <CreatorsFooter onLoginClick={handleLoginClick} />
    </>
  );
}
