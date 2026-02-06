import React from "react";

function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function PillarCard({ title, description, percent }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
          CP
        </div>
        <span className="text-xs font-semibold text-gray-500">{percent}%</span>
      </div>
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

export default function BrandProfileSection() {
  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Brand Profile</h1>
        <p className="text-sm text-gray-500">
          AI-powered brand analysis and guidelines based on your brand assessment
        </p>
      </div>

      {/* Assessment */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="h-24 w-24 rounded-full bg-[conic-gradient(#7c3aed_0deg,_#4f46e5_120deg,_#06b6d4_210deg,_#e5e7eb_0deg)] p-2">
            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">87</p>
                <p className="text-xs text-gray-500">Brand Score</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Brand Assessment Complete
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Your brand shows strong potential with clear positioning and authentic
              voice. AI recommendations generated based on your responses.
            </p>
            <div className="mt-4 space-y-3">
              <ProgressBar label="Purpose Clarity" value={92} />
              <ProgressBar label="Voice Consistency" value={85} />
              <ProgressBar label="Visual Identity" value={78} />
            </div>
          </div>
        </div>
      </div>

      {/* Purpose + Personality */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
                BP
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Brand Purpose &amp; Position
              </h3>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-600">
              AI GENERATED
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-600">Purpose Statement</p>
            <p className="text-sm text-gray-600 mt-2 italic">
              "To empower creative professionals with innovative tools that transform
              ideas into impactful digital experiences, fostering authentic
              connections in an increasingly digital world."
            </p>
            <p className="text-xs font-semibold text-gray-600 mt-4">Market Position</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {["Premium Creative Tools", "Innovation Leader", "Community-Focused"].map(
                (item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
                BV
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Personality &amp; Brand Voice
              </h3>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-600">
              AI GENERATED
            </span>
          </div>
          <div className="mt-4 grid grid-cols-[140px_1fr] gap-4 items-center">
            <svg viewBox="0 0 120 120" className="w-32 h-32">
              <polygon
                points="60,10 100,35 100,85 60,110 20,85 20,35"
                fill="#f5f3ff"
                stroke="#c4b5fd"
                strokeWidth="1"
              />
              <polygon
                points="60,25 88,42 88,78 60,95 32,78 32,42"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
              />
              <line x1="60" y1="10" x2="60" y2="110" stroke="#e5e7eb" />
              <line x1="20" y1="35" x2="100" y2="85" stroke="#e5e7eb" />
              <line x1="20" y1="85" x2="100" y2="35" stroke="#e5e7eb" />
            </svg>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex gap-2">
                <span className="text-violet-600 font-semibold">Tone:</span>
                <span>Confident yet approachable</span>
              </div>
              <div className="flex gap-2">
                <span className="text-violet-600 font-semibold">Style:</span>
                <span>Clear, inspiring, solution-focused</span>
              </div>
              <div className="flex gap-2">
                <span className="text-violet-600 font-semibold">Personality:</span>
                <span>Innovative mentor and creative catalyst</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Story */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
              BS
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Brand Story</h3>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-600">
            AI GENERATED
          </span>
        </div>
        <div className="mt-4 grid grid-cols-[20px_1fr] gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-violet-400" />
            <div className="flex-1 w-px bg-violet-200" />
            <div className="h-3 w-3 rounded-full bg-violet-400" />
            <div className="flex-1 w-px bg-violet-200" />
            <div className="h-3 w-3 rounded-full bg-violet-400" />
          </div>
          <div className="space-y-6 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-800 mb-1">The Beginning</p>
              <p>
                Born from the frustration of creative professionals struggling with
                disconnected tools and complex workflows. We saw a world where
                creativity was being stifled by technology instead of empowered by it.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">The Mission</p>
              <p>
                We set out to bridge the gap between creative vision and digital
                execution, building tools that feel intuitive and inspire rather than
                intimidate. Every feature is designed with the creator's journey in
                mind.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">The Future</p>
              <p>
                Today, we are not just a platform, we are a creative partner. We are
                building a community where ideas flourish, connections are authentic,
                and every creator has the tools to bring their vision to life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Pillars + Upload */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
                CP
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Content Pillars</h3>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-600">
              AI GENERATED
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <PillarCard
              title="Innovation Showcase"
              description="Latest features, creative techniques, and cutting-edge design trends"
              percent={30}
            />
            <PillarCard
              title="Community Stories"
              description="User success stories, behind-the-scenes content, and creator spotlights"
              percent={25}
            />
            <PillarCard
              title="Educational Content"
              description="Tutorials, tips, best practices, and creative inspiration"
              percent={25}
            />
            <PillarCard
              title="Industry Insights"
              description="Market trends, industry analysis, and thought leadership"
              percent={20}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
              UG
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              Upload Brand Guidelines
            </h3>
          </div>
          <div className="mt-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 py-10 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-semibold">
              UP
            </div>
            <p className="text-sm font-medium text-gray-700">
              Drop your brand guidelines here
            </p>
            <p className="text-xs text-gray-400">PDF, DOC, or image files accepted</p>
          </div>
          <div className="mt-4 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between bg-white">
            <div>
              <p className="text-sm font-medium text-gray-700">Brand_Guidelines_v2.pdf</p>
              <p className="text-xs text-gray-400">2.4 MB</p>
            </div>
            <div className="h-6 w-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs">
              OK
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-xs font-semibold text-violet-600">
              BR
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              Brand Guidelines Recommendations
            </h3>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-violet-50 text-violet-600">
            AI GENERATED
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Color Palette</p>
            <p className="text-xs text-gray-500 mb-2">Primary</p>
            <div className="flex gap-2 mb-3">
              {["#9AA7FF", "#D6B4FF", "#FF4DB8"].map((c) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-md border border-gray-200"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mb-2">Secondary</p>
            <div className="flex gap-2">
              {["#FFFFFF", "#E5E7EB", "#111827"].map((c) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-md border border-gray-200"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Typography</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <p className="text-xs text-violet-600 font-semibold">SORA BOLD</p>
                <p>Headlines &amp; Titles</p>
              </div>
              <div>
                <p className="text-xs text-violet-600 font-semibold">INTER REGULAR</p>
                <p>Body text and descriptions</p>
              </div>
              <div>
                <p className="text-xs text-violet-600 font-semibold">INTER SEMIBOLD</p>
                <p>Buttons and CTAs</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-2">Visual Style</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="text-violet-600 font-semibold">Border Radius:</span>{" "}
                8px - 12px (Modern, friendly)
              </p>
              <p>
                <span className="text-violet-600 font-semibold">Shadows:</span> Subtle,
                soft shadows for depth
              </p>
              <p>
                <span className="text-violet-600 font-semibold">Gradients:</span> Linear
                gradients with brand colors
              </p>
              <p>
                <span className="text-violet-600 font-semibold">Icons:</span> Outlined
                style, consistent stroke width
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Logo Design Suggestions
          </p>
          <div className="flex gap-3">
            {["A", "B", "C"].map((key, index) => (
              <div
                key={key}
                className={`h-14 w-14 rounded-xl flex items-center justify-center border ${
                  index === 2
                    ? "bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 text-white border-transparent"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                DN
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
