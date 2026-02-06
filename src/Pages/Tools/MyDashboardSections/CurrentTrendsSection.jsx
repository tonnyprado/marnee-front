import React from "react";

function StatPill({ label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function KeywordCard({ rank, title, searches, competition, growth }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold flex items-center justify-center">
          #{rank}
        </span>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span>{searches} searches</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {competition} competition
        </span>
      </div>
      <p className="text-xs text-green-500 mt-2">{growth}</p>
    </div>
  );
}

function ViralCard({ title, mentions, engagement, relevance, sources, score }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <span className="text-xs text-orange-500 font-semibold">{score}</span>
      </div>
      <div className="mt-2 flex gap-3 text-xs text-gray-500">
        <span>{mentions} mentions</span>
        <span>{engagement} engagement</span>
      </div>
      <div className="mt-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
          {relevance} niche relevance
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {sources.map((s) => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function TrendCard({ title, category, score, description, stats, tags, actions }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-purple-500 font-semibold">{category}</p>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold flex items-center justify-center">
          {score}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-sm font-semibold text-gray-800">{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        {actions.map((a) => (
          <button
            key={a}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CurrentTrendsSection() {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Current Trends</h1>
        <p className="text-sm text-gray-500">
          AI-detected trends and opportunities tailored to your brand profile
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
            YOUR BRAND NICHE
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              AI-Powered Creative Tools &amp; Design Automation
            </p>
            <p className="text-xs text-gray-500">
              Targeting creative professionals, designers, and content creators seeking innovative workflow solutions
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">SEO Keywords Performance</h2>
        <p className="text-xs text-gray-500">Top performing keywords in your niche this week</p>
        <div className="grid grid-cols-4 gap-3 mt-3">
          <KeywordCard rank="1" title="AI design tools" searches="45K" competition="Low" growth="+234%" />
          <KeywordCard rank="2" title="automated creative workflow" searches="32K" competition="Medium" growth="+189%" />
          <KeywordCard rank="3" title="no-code design platform" searches="28K" competition="Low" growth="+156%" />
          <KeywordCard rank="4" title="creative automation software" searches="21K" competition="High" growth="+98%" />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">Viral Topics in Your Niche</h2>
        <p className="text-xs text-gray-500">Topics gaining massive traction and relevance</p>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <ViralCard
            title="AI replacing designers debate"
            mentions="1.2M"
            engagement="89%"
            relevance="95%"
            score="98"
            sources={["Twitter", "LinkedIn", "Reddit"]}
          />
          <ViralCard
            title="Midjourney vs human creativity"
            mentions="890K"
            engagement="76%"
            relevance="92%"
            score="94"
            sources={["Instagram", "TikTok", "YouTube"]}
          />
          <ViralCard
            title="No-code revolution impact"
            mentions="654K"
            engagement="82%"
            relevance="88%"
            score="91"
            sources={["LinkedIn", "Medium", "Hacker News"]}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatPill label="Trending Topics" value="126" />
        <StatPill label="AI Relevance Score" value="88%" />
        <StatPill label="Opportunities" value="34" />
        <StatPill label="Total Mentions" value="0.0M" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {["All Trends", "AI & Technology", "Marketing", "Creative Tools", "Industry Insights"].map((t) => (
            <button
              key={t}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Time Range:</span>
          <button className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 font-semibold">
            This Week
          </button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600">
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          <TrendCard
            title="Leverage AI Automation Trend"
            category="CONTENT STRATEGY"
            score="94"
            description="Based on your brand's innovative positioning, create content showcasing how AI automation enhances creativity rather than replacing it."
            stats={[
              { label: "Match Score", value: "85%" },
              { label: "Potential Reach", value: "2.3M" },
              { label: "Priority", value: "High" },
              { label: "Days Active", value: "23" },
            ]}
            tags={["AI Automation", "Creative Tools", "Workflow", "Productivity"]}
            actions={["Create Campaign", "Learn More"]}
          />
          <TrendCard
            title="Community-Driven Brand Building"
            category="MARKETING"
            score="91"
            description="Brands are shifting towards community-first approaches, with 78% higher engagement rates."
            stats={[
              { label: "Higher Engagement", value: "78%" },
              { label: "Discussions", value: "890K" },
              { label: "Brand Trust", value: "92%" },
              { label: "Days Trending", value: "15" },
            ]}
            tags={["Community Building", "Brand Loyalty", "UGC", "Authenticity"]}
            actions={["Explore Strategy", "Track Trend"]}
          />
          <TrendCard
            title="No-Code Creative Platforms"
            category="CREATIVE TOOLS"
            score="88"
            description="No-code solutions are democratizing creative work, with 250% growth in adoption."
            stats={[
              { label: "Adoption Growth", value: "250%" },
              { label: "New Users", value: "654K" },
              { label: "Satisfaction", value: "85%" },
              { label: "Days Active", value: "19" },
            ]}
            tags={["No-Code", "Accessibility", "Democratization", "Ease of Use"]}
            actions={["Analyze Impact", "Monitor"]}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Trending Keywords</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "#AICreativity",
                "#NoCodeDesign",
                "#CommunityFirst",
                "#CreativeAutomation",
                "#DigitalTransformation",
                "#UserExperience",
                "#BrandAuthenticity",
                "#CreativeTools",
                "#Innovation",
                "#DesignThinking",
              ].map((k) => (
                <span key={k} className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {k}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Market Insights</h3>
            <div className="mt-3 space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-gray-800">Creative Software Market</p>
                <p className="text-xs text-green-600">$8.2B projected growth</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">AI Tools Adoption</p>
                <p className="text-xs text-green-600">73% of creatives using AI</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Remote Creative Work</p>
                <p className="text-xs text-green-600">+45% permanent shift</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Quick Trends</h3>
            <div className="mt-3 space-y-3 text-sm text-gray-700">
              {[
                "AI Content Generation",
                "Mobile-First Design",
                "Interactive Storytelling",
                "Cross-Platform Integration",
              ].map((t) => (
                <div key={t} className="flex items-center justify-between">
                  <span>{t}</span>
                  <span className="text-xs text-green-600">+120%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
