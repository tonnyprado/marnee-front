import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import marneeLogo from '../assets/marnee-logo.png';
import demoVideo from '../assets/videos/0207.mp4';
import LanguageSwitcher from '../Component/LanguageSwitcher';
import LoadingTransition from '../Component/LoadingTransition';
import { useLanguage } from '../context/LanguageContext';

const WAITLIST_URL = 'https://tally.so/r/D4NkGl';

/* ── SUB-COMPONENTS ──────────────────────────────────────── */

function LandingNav({ onLoginClick }) {
  const { t } = useLanguage();

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

        <div className="mn-nav-actions">
          <LanguageSwitcher className="border-[rgba(30,30,30,0.1)] bg-white/90 backdrop-blur shadow-sm" />

          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#40086d] transition-colors"
          >
            Sign In
          </button>

          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mn-nav-pill"
          >
            Join Waitlist
          </a>
        </div>
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
          For Content Creators
        </div>

        {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
        <h1 className="mn-hero-title" ref={titleRef} id="hero-title" aria-label="Turn your creative vision into consistent content strategy" />

        <div className="mn-hero-stats mn-fade-up" style={{ transitionDelay: '.2s' }}>
          <div className="mn-stat-t">
            <div className="mn-stat-t-num">10x</div>
            <div className="mn-stat-t-label">Faster content<br />planning</div>
          </div>
          <div className="mn-stat-divider" />
          <div className="mn-stat-t">
            <div className="mn-stat-t-num">90%</div>
            <div className="mn-stat-t-label">Less creative<br />burnout</div>
          </div>
        </div>

        <p className="mn-hero-body mn-fade-up" style={{ transitionDelay: '.3s' }}>
          Stop spending hours planning content. Marnee analyzes your niche, understands your<br />
          unique voice, and creates a complete content strategy tailored to your audience.
        </p>

        <div className="mn-hero-cta mn-fade-up" style={{ transitionDelay: '.4s' }}>
          <a href={WAITLIST_URL} target="_blank" rel="noopener noreferrer" className="mn-btn-primary">
            Start Creating Smarter
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#how" className="mn-btn-ghost">See How It Works</a>
        </div>

        <div className="mn-hero-proof mn-fade-up" style={{ transitionDelay: '.5s' }}>
          <div className="mn-proof-avs">
            <div className="mn-proof-av">A</div>
            <div className="mn-proof-av">S</div>
            <div className="mn-proof-av">J</div>
            <div className="mn-proof-av">M</div>
          </div>
          <span>Join <strong>20+</strong> creators already using Marnee</span>
        </div>

      </div>
    </section>
  );
}

function Ticker() {
  const items = [
    'Content Strategy',
    'Trend Analysis',
    'Brand Voice',
    'Audience Insights',
    'Content Calendar',
    'Hook Generation',
    'Performance Tracking',
    'Creative Ideas',
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

function ProblemSection() {
  return (
    <section className="mn-problem">
      <div className="mn-section-wrap">
        <div className="mn-problem-head mn-fade-up">
          <div className="mn-section-tag">The Creator Struggle</div>
          <h2 className="mn-section-title">
            You create amazing content.<br />
            But planning it? That's the hard part.
          </h2>
        </div>

        <div className="mn-grid-3" style={{ marginBottom: 1 }}>
          {[
            {
              n: '01',
              title: 'Content Burnout',
              body: 'Constantly creating without a clear strategy drains your creativity and leads to inconsistent posting.',
            },
            {
              n: '02',
              title: 'Trend Overload',
              body: 'Too many trends to track. By the time you hop on one, it\'s already over. You\'re always one step behind.',
            },
            {
              n: '03',
              title: 'Audience Disconnect',
              body: 'You\'re creating content, but is it what your audience actually wants? Guesswork isn\'t a strategy.',
            },
          ].map(({ n, title, body }, i) => (
            <div
              className="mn-pain-card mn-card-base mn-fade-up"
              key={n}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="mn-pain-num">{n}</div>
              <div className="mn-pain-title">{title}</div>
              <div className="mn-pain-body">{body}</div>
            </div>
          ))}
        </div>

        <div className="mn-stat-row">
          {[
            { num: '15+hrs', txt: 'Weekly content planning', delay: '0s' },
            { num: '68%', txt: 'Creators feel burned out', delay: '.1s' },
            { num: '3-5', txt: 'Platforms to manage', delay: '.2s' },
            { num: '24/7', txt: 'Always-on pressure', delay: '.3s' },
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
          <h2 className="mn-section-title">
            Your AI content partner that<br />
            gets your creative vision
          </h2>
          <p className="mn-section-sub">Marnee learns your voice, analyzes your audience, and creates content strategies that actually work.</p>
        </div>

        <div className="mn-grid-3" style={{ marginTop: 48 }}>
          {[
            {
              n: '01',
              title: 'Know Your Audience',
              body: 'Marnee analyzes real-time data from your niche to understand what your audience truly wants.',
            },
            {
              n: '02',
              title: 'Stay Ahead of Trends',
              body: 'Get trend alerts before they peak. Marnee helps you ride the wave, not chase it.',
              delay: '.1s',
            },
            {
              n: '03',
              title: 'Consistent Content Flow',
              body: 'Generate weeks of content ideas in minutes. Never stare at a blank screen again.',
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
          <h2 className="mn-section-title">From chaos to clarity in three steps</h2>
          <p className="mn-section-sub">Set up your creator profile, get insights, and start creating with confidence.</p>
        </div>

        <div className="mn-steps">
          <div className="mn-step mn-fade-up" data-n="01">
            <div className="mn-step-line" />
            <div className="mn-step-title">Tell Marnee about your content</div>
            <div className="mn-step-body">
              Share your niche, audience, and creative style. Marnee learns what makes your content unique.
            </div>
          </div>
          <div className="mn-step mn-fade-up" data-n="02" style={{ transitionDelay: '.15s' }}>
            <div className="mn-step-line" />
            <div className="mn-step-title">Get data-driven insights</div>
            <div className="mn-step-body">
              Marnee analyzes trends in your space and shows you what's working—and why—so you can make informed decisions.
            </div>
          </div>
          <div className="mn-step mn-fade-up" data-n="03" style={{ transitionDelay: '.3s' }}>
            <div className="mn-step-title">Create with confidence</div>
            <div className="mn-step-body">
              Generate content ideas, hooks, and full strategies. Everything organized in your dashboard. No more guesswork.
            </div>
          </div>
        </div>

        <div className="mn-grid-4">
          {[
            {
              tag: 'Step 1 — Setup',
              title: 'Creator Profile',
              body: 'Tell Marnee about your brand, your audience, and your goals. The more she knows, the better your strategy.',
            },
            {
              tag: 'Step 2 — Analysis',
              title: 'Niche Research',
              body: 'Marnee dives into your niche, analyzing top-performing content and emerging trends so you don\'t have to.',
              delay: '.1s',
            },
            {
              tag: 'Step 3 — Strategy',
              title: 'Content Calendar',
              body: 'Get a complete content calendar with ideas, hooks, and posting schedules tailored to your audience.',
              delay: '.15s',
            },
            {
              tag: 'Step 4 — Execute',
              title: 'Dashboard & Analytics',
              body: 'Track performance, refine your strategy, and keep your content pipeline full—all from one place.',
              delay: '.2s',
            },
          ].map(({ tag, title, body, delay }) => (
            <div
              className="mn-detail-card mn-card-base mn-fade-up"
              key={tag}
              style={delay ? { transitionDelay: delay } : undefined}
            >
              <div className="mn-detail-tag">{tag}</div>
              <div className="mn-detail-title">{title}</div>
              <div className="mn-detail-body">{body}</div>
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
          <div className="mn-section-tag">See It In Action</div>
          <h2 className="mn-section-title">Watch Marnee work her magic</h2>
        </div>

        <div className="mn-demo-frame mn-fade-up" style={{ transitionDelay: '.1s' }}>
          <div className="mn-demo-bar">
            <div className="mn-demo-dot r" />
            <div className="mn-demo-dot y" />
            <div className="mn-demo-dot g" />
            <div className="mn-demo-url">app.marnee.ai/creators</div>
          </div>
          <div className="mn-demo-body" style={{ position: 'relative', padding: 0, height: '500px' }}>
            <video
              src={demoVideo}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0 0 12px 12px'
              }}
            />
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
  ContentIdeas: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.4-4.5 6.5V17h-5v-1.5C6.8 14.4 5 12 5 9a7 7 0 0 1 7-7z" />
      <rect x="9" y="17" width="6" height="2" rx="1" />
      <rect x="10" y="19" width="4" height="2" rx="1" />
    </svg>
  ),
  VoiceMatch: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  Calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Hooks: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  Analytics: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
};

function FeaturesSection() {
  const features = [
    { Icon: FeatureIcons.TrendDetection, title: 'Real-Time Trend Tracking', body: 'Stay ahead with insights on what\'s trending in your niche across Instagram, TikTok, YouTube, and more.' },
    { Icon: FeatureIcons.ContentIdeas, title: 'Endless Content Ideas', body: 'Never run out of ideas. Marnee generates content concepts based on what\'s working in your space.', delay: '.1s' },
    { Icon: FeatureIcons.VoiceMatch, title: 'Your Voice, Amplified', body: 'Marnee learns your unique style and tone so every suggestion feels authentically you.', delay: '.2s' },
    { Icon: FeatureIcons.Calendar, title: 'Smart Content Calendar', body: 'Organize your content pipeline with an intuitive calendar view. Plan weeks ahead in minutes.', delay: '.1s' },
    { Icon: FeatureIcons.Hooks, title: 'Hook & Caption Generator', body: 'Generate attention-grabbing hooks and captions tailored to your audience and platform.', delay: '.2s' },
    { Icon: FeatureIcons.Analytics, title: 'Performance Insights', body: 'Track what\'s working and refine your strategy based on real data, not guesswork.', delay: '.3s' },
  ];

  return (
    <section className="mn-features" id="features">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Features</div>
          <h2 className="mn-section-title">Everything creators need<br />in one platform</h2>
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
          <div className="mn-section-tag">Your AI Creative Partner</div>
          <h2 className="mn-section-title">
            Meet<br /><em>Marnee.</em>
          </h2>
          <div className="mn-marnee-role">AI Content Strategist for Creators</div>
          <p className="mn-marnee-desc">
            Marnee doesn't just generate content—she understands your creative vision and helps you
            turn it into a sustainable strategy. She's like having a content strategist and creative
            director in your pocket.
          </p>
          <div className="mn-marnee-asks">
            <div className="mn-marnee-ask">
              <div className="mn-ask-dot" />
              "What should I post this week to grow my audience?"
            </div>
            <div className="mn-marnee-ask">
              <div className="mn-ask-dot" />
              "Give me 10 hooks for my next video series"
            </div>
            <div className="mn-marnee-ask">
              <div className="mn-ask-dot" />
              "What trends should I jump on right now?"
            </div>
          </div>
          <div className="mn-marnee-quote">
            "Create smarter,<br />not harder."
          </div>
        </div>

        <div className="mn-fade-up" style={{ transitionDelay: '.15s' }}>
          <div className="mn-chat-wrap">
            <div className="mn-chat-header">
              <div className="mn-chat-av">M</div>
              <div>
                <div className="mn-chat-name">Marnee</div>
                <div className="mn-chat-status">AI Content Partner · Online</div>
              </div>
              <div className="mn-chat-online" />
            </div>
            <div className="mn-chat-body">
              <div className="mn-msg-row">
                <div className="mn-msg-av">M</div>
                <div className="mn-bubble-ai">
                  I've analyzed your niche and found 3 emerging trends that align perfectly
                  with your brand. Here's what's gaining traction...
                </div>
              </div>
              <div className="mn-msg-row">
                <div className="mn-msg-av">M</div>
                <div className="mn-bubble-ai">
                  Based on your audience data, <strong>"How-to" style content</strong> gets
                  <strong> 65% more engagement</strong> for your niche. Want me to generate some ideas?
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className="mn-bubble-user">Yes! Give me 5 ideas for this week</div>
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
    { n: '01', title: 'Solo Creators', body: 'Perfect for YouTubers, TikTokers, and Instagram creators building their audience' },
    { n: '02', title: 'Influencers', body: 'Manage multiple brand partnerships and keep your content strategy on point', delay: '.08s' },
    { n: '03', title: 'Content Teams', body: 'Coordinate content across team members with shared calendars and strategies', delay: '.16s' },
    { n: '04', title: 'Multi-Platform Creators', body: 'Create once, adapt for everywhere. Marnee helps you repurpose smartly', delay: '.08s' },
    { n: '05', title: 'Niche Experts', body: 'Position yourself as the go-to voice in your space with consistent, strategic content', delay: '.16s' },
    { n: '06', title: 'Growing Creators', body: 'Break through the noise and grow your audience with data-backed strategies', delay: '.24s' },
  ];

  return (
    <section className="mn-who">
      <div className="mn-section-wrap">
        <div className="mn-fade-up">
          <div className="mn-section-tag">Who it's for</div>
          <h2 className="mn-section-title">
            Built for creators who want to<br />
            grow without the burnout
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
        <div className="mn-cta-tag mn-fade-up">Ready to level up?</div>
        <h2 className="mn-cta-title mn-fade-up" style={{ transitionDelay: '.1s' }}>
          Start creating with<br /><em>Marnee.</em>
        </h2>
        <p className="mn-cta-sub mn-fade-up" style={{ transitionDelay: '.2s' }}>
          Join the waitlist and be among the first creators to experience
          AI-powered content strategy that actually gets you.
        </p>
        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mn-cta-btn mn-fade-up"
          style={{ transitionDelay: '.3s' }}
        >
          Join the Creators Waitlist
        </a>
        <div className="mn-cta-note mn-fade-up" style={{ transitionDelay: '.4s' }}>
          Early access for creators. Limited spots available.
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
              Your AI content partner. Turning creative vision into strategic,
              data-driven content that grows your audience.
            </p>
          </div>
          <div>
            <div className="mn-footer-col-title">Product</div>
            <div className="mn-footer-links">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <span>Pricing</span>
            </div>
          </div>
          <div>
            <div className="mn-footer-col-title">Resources</div>
            <div className="mn-footer-links">
              <span>Creator Stories</span>
              <span>Blog</span>
              <span>Help Center</span>
              <span onClick={onLoginClick} style={{ cursor: 'pointer' }}>Login</span>
            </div>
          </div>
        </div>
        <div className="mn-footer-bottom">
          <div className="mn-footer-copy">
            © 2026 Marnee. All rights reserved. · <a href="https://lordicon.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Icons by Lordicon.com</a>
          </div>
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
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    document.querySelectorAll('.mn-fade-up').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* ── PAGE ────────────────────────────────────────────────── */
export default function CreatorsLandingPage() {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const typewriterLines = [
    ['Turn your creative vision', false, false],
    ['into consistent content', false, false],
    ['strategy.', true, true],
  ];

  useTypewriter(titleRef, typewriterLines);
  useFadeUpObserver();

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/auth');
    }, 800);
  };

  return (
    <>
      <LoadingTransition isLoading={isLoading} message="Redirecting..." />
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
