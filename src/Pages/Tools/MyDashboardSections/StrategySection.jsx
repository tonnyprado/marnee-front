import React from "react";
import { useStrategy } from "../../../hooks/useStrategy";

function StatCard({ icon, title, description }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function ProgressCard({ icon, title, subtitle, value }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" style={{ width: value }} />
      </div>
    </div>
  );
}

function PillarCard({ title, purpose, items, benefit }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-gray-500 mt-2">
        <span className="font-semibold text-gray-600">Purpose:</span> {purpose}
      </p>
      <p className="text-xs text-gray-500 mt-2 font-semibold">Content Types:</p>
      <ul className="text-xs text-gray-500 mt-2 space-y-1">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
      <p className="text-xs text-[#40086d] mt-3 font-semibold">{benefit}</p>
    </div>
  );
}

function IdeaCard({ number, title, objective, description, tag, type }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#40086d]">0{number}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{type}</span>
      </div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500 mt-2">
        <span className="font-semibold text-gray-600">Objective:</span> {objective}
      </p>
      <p className="text-xs text-gray-500 mt-2">{description}</p>
      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#ede0f8] text-[#40086d] mt-3">
        {tag}
      </span>
    </div>
  );
}

function StrategyList({ title, goal, items, tone }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-xs text-[#40086d] mt-2 font-semibold">Primary Goal: {goal}</p>
      <p className="text-xs text-gray-500 mt-3 font-semibold">Recommended Content:</p>
      <ul className="text-xs text-gray-500 mt-2 space-y-1">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
      <p className="text-xs text-[#40086d] mt-3">Tone: {tone}</p>
    </div>
  );
}

function WorkflowStep({ step, title, leftTitle, leftItems, rightTitle, rightItems, time }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full bg-[#ede0f8] text-[#40086d] text-xs font-semibold flex items-center justify-center">
            {step}
          </span>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {time}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
        <div>
          <p className="font-semibold text-gray-700 mb-2">{leftTitle}</p>
          <ul className="space-y-1">
            {leftItems.map((i) => (
              <li key={i}>• {i}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-2">{rightTitle}</p>
          <ul className="space-y-1">
            {rightItems.map((i) => (
              <li key={i}>• {i}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CalendarRow({ day, items }) {
  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-900">{day}</h4>
      <div className="mt-3 space-y-2">
        {items.map((i) => (
          <div key={i.title} className="flex items-center justify-between text-xs text-gray-600">
            <div>
              <p className="font-semibold text-gray-800">{i.title}</p>
              <p className="text-gray-400">{i.time}</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {i.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KPIBar({ label, value, note }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>{label}</span>
        <span className="font-semibold text-gray-700">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" style={{ width: value }} />
      </div>
      {note && <p className="text-[10px] text-green-600 mt-1">{note}</p>}
    </div>
  );
}

export default function StrategySection({ founderId, sessionId }) {
  const {
    strategy,
    loading,
    error,
    generating,
    regeneratingSection,
    generateStrategy,
    regenerateSection,
  } = useStrategy(founderId, sessionId);

  const handleGenerateStrategy = async () => {
    try {
      await generateStrategy();
    } catch (err) {
      console.error("Failed to generate strategy:", err);
    }
  };

  const handleRegenerateSection = async (section) => {
    try {
      await regenerateSection(section);
    } catch (err) {
      console.error(`Failed to regenerate ${section}:`, err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading strategy...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  // Empty state
  if (!strategy) {
    return (
      <div className="text-center py-12 bg-white border border-[rgba(30,30,30,0.1)] rounded">
        <div className="mb-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-[#ede0f8] flex items-center justify-center text-2xl text-[#40086d]">
            📊
          </div>
        </div>
        <p className="text-gray-700 font-semibold mb-2">No Strategy Yet</p>
        <p className="text-gray-500 mb-4">
          Generate your content strategy using AI based on your brand profile and data.
        </p>
        {founderId && (
          <button
            onClick={handleGenerateStrategy}
            disabled={generating}
            className="px-4 py-2 rounded-lg bg-[#40086d] text-white text-sm font-medium hover:bg-[#300651] transition disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Strategy with AI"}
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Your Brand &amp; Social Media Strategy</h1>
        <p className="text-sm text-gray-500 mt-1">
          {strategy.overview?.mission || "A comprehensive content strategy designed for your brand"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon="🎯"
          title="Mission"
          description={strategy.overview?.mission || "Define your brand mission"}
        />
        <StatCard
          icon="👥"
          title="Target Audience"
          description={strategy.overview?.targetAudience || "Define your target audience"}
        />
        <StatCard
          icon="📈"
          title="Main Goal"
          description={strategy.overview?.mainGoal || "Define your main goal"}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-center">SMART Goals &amp; KPIs</h2>
            <p className="text-xs text-center text-gray-500">
              Measurable objectives for community building and engagement
            </p>
          </div>
          <button
            onClick={() => handleRegenerateSection('goals')}
            disabled={regeneratingSection === 'goals'}
            className="px-4 py-2 rounded-lg bg-[#ede0f8] text-[#40086d] text-xs font-semibold hover:bg-[#dcc9ed] transition disabled:opacity-50"
          >
            {regeneratingSection === 'goals' ? 'Regenerating...' : 'Redo Goals with AI'}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {strategy.smartGoals && strategy.smartGoals.length > 0 ? (
            strategy.smartGoals.map((goal, index) => (
              <ProgressCard
                key={index}
                icon={goal.icon}
                title={goal.title}
                subtitle={goal.subtitle}
                value={goal.value}
              />
            ))
          ) : (
            <>
              <ProgressCard icon="🤝" title="Community Building" subtitle="2,000 followers by Q2 2025" value="55%" />
              <ProgressCard icon="💬" title="Direct Engagement" subtitle="20+ meaningful DMs per month" value="60%" />
              <ProgressCard icon="📊" title="Content Performance" subtitle="Maintain 5% average engagement rate" value="70%" />
              <ProgressCard icon="🎯" title="Lead Generation" subtitle="15 qualified leads monthly" value="50%" />
              <ProgressCard icon="📈" title="Reach Growth" subtitle="Increase monthly reach by 25%" value="62%" />
              <ProgressCard icon="💡" title="Brand Awareness" subtitle="50+ brand mentions monthly" value="45%" />
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Content Pillars</h2>
            <p className="text-xs text-gray-500">Three core themes that guide all content creation</p>
          </div>
          <button
            onClick={() => handleRegenerateSection('pillars')}
            disabled={regeneratingSection === 'pillars'}
            className="px-4 py-2 rounded-lg bg-[#ede0f8] text-[#40086d] text-xs font-semibold hover:bg-[#dcc9ed] transition disabled:opacity-50"
          >
            {regeneratingSection === 'pillars' ? 'Regenerating...' : 'Redo Content Pillars with AI'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {strategy.contentPillars && strategy.contentPillars.length > 0 ? (
            strategy.contentPillars.map((pillar, index) => (
              <PillarCard
                key={index}
                title={pillar.title}
                purpose={pillar.purpose}
                items={pillar.items}
                benefit={pillar.benefit}
              />
            ))
          ) : (
            <>
              <PillarCard
                title="Wellness Education"
                purpose="Educate audience on holistic health practices"
                items={["How-to tutorials", "Myth-busting posts", "Scientific explanations", "Expert interviews"]}
                benefit="Brand Benefit: Establishes authority and trust"
              />
              <PillarCard
                title="Lifestyle Inspiration"
                purpose="Inspire sustainable wellness lifestyle choices"
                items={["Morning routines", "Transformation stories", "Seasonal wellness tips", "Mindfulness practices"]}
                benefit="Brand Benefit: Builds emotional connection and aspiration"
              />
              <PillarCard
                title="Community Connection"
                purpose="Foster authentic community engagement"
                items={["User-generated content", "Q&A sessions", "Behind-the-scenes", "Community challenges"]}
                benefit="Brand Benefit: Builds loyalty and advocacy"
              />
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">10 Custom Video Ideas</h2>
            <p className="text-xs text-gray-500">
              Ready-to-create content ideas tailored to your brand pillars
            </p>
          </div>
          <button
            onClick={() => handleRegenerateSection('video_ideas')}
            disabled={regeneratingSection === 'video_ideas'}
            className="px-4 py-2 rounded-lg bg-[#ede0f8] text-[#40086d] text-xs font-semibold hover:bg-[#dcc9ed] transition disabled:opacity-50"
          >
            {regeneratingSection === 'video_ideas' ? 'Regenerating...' : 'Make More Custom Ideas with AI'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {strategy.videoIdeas && strategy.videoIdeas.length > 0 ? (
            strategy.videoIdeas.map((idea, index) => (
              <IdeaCard
                key={index}
                number={idea.number || index + 1}
                type={idea.type}
                title={idea.title}
                objective={idea.objective}
                description={idea.description}
                tag={idea.tag}
              />
            ))
          ) : (
            <>
              <IdeaCard
                number="1"
                type="Reel"
                title="5-Minute Morning Wellness Ritual"
                objective="Showcase simple daily practices"
                description="Quick-cut montage of morning routine including meditation, stretching, and herbal tea preparation."
                tag="Wellness Education"
              />
              <IdeaCard
                number="2"
                type="Tutorial"
                title="DIY Stress-Relief Aromatherapy Blend"
                objective="Educate on natural stress management"
                description="Step-by-step guide to creating custom essential oil blends for different stress levels."
                tag="Wellness Education"
              />
              <IdeaCard
                number="3"
                type="Story Series"
                title="Seasonal Wellness Transitions"
                objective="Inspire seasonal lifestyle adaptation"
                description="Multi-part series showing how to adjust wellness routines for each season."
                tag="Lifestyle Inspiration"
              />
              <IdeaCard
                number="4"
                type="Live Q&A"
                title="Wellness Wednesday: Your Questions Answered"
                objective="Build community engagement"
                description="Weekly live session addressing community wellness questions and concerns."
                tag="Community Connection"
              />
              <IdeaCard
                number="5"
                type="Carousel"
                title="Myth vs. Reality: Wellness Edition"
                objective="Educate and debunk misconceptions"
                description="Visual breakdown of common wellness myths with scientific explanations."
                tag="Wellness Education"
              />
              <IdeaCard
                number="6"
                type="Behind-the-Scenes"
                title="A Day in My Wellness Journey"
                objective="Build authentic connection"
                description="Raw, unfiltered look at daily wellness practices and challenges."
                tag="Community Connection"
              />
              <IdeaCard
                number="7"
                type="Tutorial"
                title="3-Ingredient Energy Balls Recipe"
                objective="Provide practical value"
                description="Simple, healthy snack recipe with ingredient benefits explanation."
                tag="Lifestyle Inspiration"
              />
              <IdeaCard
                number="8"
                type="Reel"
                title="Before & After: Mindful Moments"
                objective="Show transformation power"
                description="Split-screen showing stressed vs. calm states with quick mindfulness tips."
                tag="Wellness Education"
              />
              <IdeaCard
                number="9"
                type="User Spotlight"
                title="Community Transformation Stories"
                objective="Showcase community success"
                description="Feature follower's wellness journey with their permission and story."
                tag="Community Connection"
              />
              <IdeaCard
                number="10"
                type="Educational Series"
                title="Wellness on a Budget: Week 1"
                objective="Make wellness accessible"
                description="Multi-part series showing affordable wellness practices and products."
                tag="Lifestyle Inspiration"
              />
            </>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 rounded-lg border border-violet-200 text-[#40086d] text-xs font-semibold">
            View All {strategy.videoIdeas?.length || 10} Video Ideas
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-center">Platform Strategy</h2>
        <p className="text-xs text-center text-gray-500">
          Tailored approaches for Instagram and LinkedIn success
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {strategy.platformStrategies && strategy.platformStrategies.length > 0 ? (
            strategy.platformStrategies.map((platform, index) => (
              <StrategyList
                key={index}
                title={`${platform.platform} Strategy`}
                goal={platform.goal}
                items={platform.items}
                tone={platform.tone}
              />
            ))
          ) : (
            <>
              <StrategyList
                title="Instagram Strategy"
                goal="Build visual brand identity and community engagement"
                items={[
                  "Aesthetic wellness flat lays",
                  "Behind-the-scenes stories",
                  "User-generated content reposts",
                  "Quick tutorial reels",
                  "Inspirational quote graphics",
                ]}
                tone="Visual, inspirational, community-focused"
              />
              <StrategyList
                title="LinkedIn Strategy"
                goal="Establish thought leadership and B2B partnerships"
                items={[
                  "Industry insights and trends",
                  "Professional wellness tips",
                  "Business case studies",
                  "Expert opinion pieces",
                  "Workplace wellness content",
                ]}
                tone="Professional, authoritative, educational"
              />
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-center">Content Creation Workflow</h2>
        <p className="text-xs text-center text-gray-500">
          Streamlined 4-step process from ideation to publication
        </p>
        <div className="space-y-4 mt-4">
          {strategy.workflow && strategy.workflow.length > 0 ? (
            strategy.workflow.map((step, index) => (
              <WorkflowStep
                key={index}
                step={step.step}
                title={step.title}
                time={step.time}
                leftTitle={step.leftTitle}
                leftItems={step.leftItems}
                rightTitle={step.rightTitle}
                rightItems={step.rightItems}
              />
            ))
          ) : (
            <>
              <WorkflowStep
                step="01"
                title="Pre-Production Planning"
                time="Mondays | 2-3 hours"
                leftTitle="Content Strategy"
                leftItems={["Weekly content brainstorming", "Trend research & analysis", "Content pillar alignment"]}
                rightTitle="Production Prep"
                rightItems={["Script writing & storyboards", "Props & location setup", "Batch filming schedule"]}
              />
              <WorkflowStep
                step="02"
                title="Content Production"
                time="Tue & Thu | 3-4 hours each"
                leftTitle="Filming Sessions"
                leftItems={["Batch filming (10am-2pm optimal)", "Multiple angles & variations", "B-roll footage collection"]}
                rightTitle="Quality Control"
                rightItems={["Audio quality checks", "Lighting consistency", "Raw footage organization"]}
              />
              <WorkflowStep
                step="03"
                title="Post-Production & Design"
                time="Wednesdays | 4-5 hours"
                leftTitle="Video Editing"
                leftItems={["Cut & sequence footage", "Add transitions & effects", "Color correction & audio"]}
                rightTitle="Content Finalization"
                rightItems={["Graphic design for carousels", "Caption writing & hashtags", "Final quality review"]}
              />
              <WorkflowStep
                step="04"
                title="Publishing & Community Management"
                time="Daily | 30 min morning & evening"
                leftTitle="Content Distribution"
                leftItems={[
                  "Scheduled posting automation",
                  "Cross-platform optimization",
                  "Story highlights curation",
                ]}
                rightTitle="Engagement & Analytics"
                rightItems={[
                  "Real-time community management",
                  "DM responses & interactions",
                  "Performance tracking & insights",
                ]}
              />
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-center">Smart Content Repurposing Strategy</h2>
        <p className="text-xs text-center text-gray-500">
          Maximize content value by transforming one piece into multiple formats
        </p>
        <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm mt-4 space-y-4">
          {(strategy.repurposingStrategies && strategy.repurposingStrategies.length > 0
            ? strategy.repurposingStrategies
            : [
                {
                  base: "1 Long-form Video",
                  description: "Tutorial or educational content",
                  outputs: ["3 Short Reels", "1 Carousel Post", "5 Story Highlights", "1 LinkedIn Article", "Email Newsletter"],
                },
                {
                  base: "1 Tutorial Session",
                  description: "Step-by-step guide",
                  outputs: ["Step Carousel", "Quick Tips Reel", "FAQ Stories", "Blog Post"],
                },
                {
                  base: "1 Live Q&A Session",
                  description: "Community interaction",
                  outputs: ["Highlight Clips", "Q&A Carousel", "Quote Graphics", "Podcast Episode"],
                },
              ]
          ).map((r, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
              <div className="min-w-[200px]">
                <p className="font-semibold text-gray-800">{r.base}</p>
                <p className="text-gray-500">{r.description}</p>
              </div>
              <span className="text-gray-400">transforms into</span>
              <div className="flex flex-wrap gap-2">
                {r.outputs.map((o, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {o}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Weekly Publishing Calendar</h2>
            <p className="text-xs text-gray-500">
              Strategic content schedule optimized for maximum engagement
            </p>
          </div>
          <button
            onClick={() => handleRegenerateSection('calendar')}
            disabled={regeneratingSection === 'calendar'}
            className="px-4 py-2 rounded-lg bg-[#ede0f8] text-[#40086d] text-xs font-semibold hover:bg-[#dcc9ed] transition disabled:opacity-50"
          >
            {regeneratingSection === 'calendar' ? 'Regenerating...' : 'Redo Content Calendar with AI'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          <StatCard
            icon="📊"
            title={strategy.publishingCalendar?.postsPerWeek?.toString() || "7"}
            description="Posts per Week"
          />
          <StatCard
            icon="📱"
            title={strategy.publishingCalendar?.reelsPerWeek?.toString() || "3"}
            description="Reels per Week"
          />
          <StatCard
            icon="📚"
            title={strategy.publishingCalendar?.storiesDaily?.toString() || "5"}
            description="Stories Daily"
          />
          <StatCard
            icon="💼"
            title={strategy.publishingCalendar?.linkedinPosts?.toString() || "3"}
            description="LinkedIn Posts"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {strategy.publishingCalendar?.weekSchedule && strategy.publishingCalendar.weekSchedule.length > 0 ? (
            strategy.publishingCalendar.weekSchedule.map((daySchedule, index) => (
              <CalendarRow key={index} day={daySchedule.day} items={daySchedule.items} />
            ))
          ) : (
            <>
              <CalendarRow
                day="Monday"
                items={[
                  { title: "Educational Carousel", time: "9:00 AM", tag: "Wellness Education" },
                  { title: "Industry Insights", time: "11:00 AM", tag: "Wellness Education" },
                ]}
              />
              <CalendarRow
                day="Tuesday"
                items={[{ title: "How-to Reel", time: "2:00 PM", tag: "Lifestyle Inspiration" }]}
              />
              <CalendarRow
                day="Wednesday"
                items={[
                  { title: "Live Q&A Session", time: "7:00 PM", tag: "Community Connection" },
                  { title: "Workplace Wellness", time: "10:00 AM", tag: "Wellness Education" },
                ]}
              />
              <CalendarRow
                day="Thursday"
                items={[{ title: "Before/After Reel", time: "1:00 PM", tag: "Lifestyle Inspiration" }]}
              />
              <CalendarRow
                day="Friday"
                items={[
                  { title: "Community Spotlight", time: "4:00 PM", tag: "Community Connection" },
                  { title: "Weekly Reflection", time: "3:00 PM", tag: "Lifestyle Inspiration" },
                ]}
              />
              <CalendarRow
                day="Weekend"
                items={[{ title: "Stories & BTS", time: "Flexible timing", tag: "Community Connection" }]}
              />
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">Optimal Posting Times</h3>
        <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-gray-600">
          <div className="bg-[#f6f6f6] rounded-lg p-3">
            <p className="font-semibold text-gray-800">Instagram Feed</p>
            <p>{strategy.publishingCalendar?.optimalTiming?.instagramFeed || "9-11 AM, 1-3 PM, 7-9 PM"}</p>
          </div>
          <div className="bg-[#f6f6f6] rounded-lg p-3">
            <p className="font-semibold text-gray-800">Instagram Reels</p>
            <p>{strategy.publishingCalendar?.optimalTiming?.instagramReels || "12-3 PM, 7-9 PM"}</p>
          </div>
          <div className="bg-[#f6f6f6] rounded-lg p-3">
            <p className="font-semibold text-gray-800">LinkedIn</p>
            <p>{strategy.publishingCalendar?.optimalTiming?.linkedin || "8-10 AM, 12-2 PM, 5-6 PM"}</p>
          </div>
          <div className="bg-[#f6f6f6] rounded-lg p-3">
            <p className="font-semibold text-gray-800">Stories</p>
            <p>{strategy.publishingCalendar?.optimalTiming?.stories || "Throughout the day (8 AM - 10 PM)"}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-center">Monthly KPI Tracking Dashboard</h2>
        <p className="text-xs text-center text-gray-500">
          Comprehensive metrics to measure success and optimize performance
        </p>
        <div className="grid grid-cols-4 gap-4 mt-4">
          <StatCard
            icon="📈"
            title={strategy.monthlyStats?.growth || "+24%"}
            description="Monthly Growth"
          />
          <StatCard
            icon="💬"
            title={strategy.monthlyStats?.engagement || "6.8%"}
            description="Avg Engagement"
          />
          <StatCard
            icon="👥"
            title={strategy.monthlyStats?.reach || "12.5K"}
            description="Monthly Reach"
          />
          <StatCard
            icon="🎯"
            title={strategy.monthlyStats?.leads || "18"}
            description="Qualified Leads"
          />
        </div>
        {strategy.kpiTracking && strategy.kpiTracking.length > 0 ? (
          strategy.kpiTracking.map((kpiSection, index) => (
            <div key={index} className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-gray-900">{kpiSection.title}</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {kpiSection.metrics.map((metric, metricIndex) => (
                  <KPIBar key={metricIndex} label={metric.label} value={metric.value} note={metric.note} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-gray-900">Instagram Performance</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <KPIBar label="Follower Growth" value="70%" note="+12%" />
                <KPIBar label="Engagement Rate" value="68%" note="+0.8%" />
                <KPIBar label="Story Completion" value="72%" note="+5%" />
                <KPIBar label="DM Response Rate" value="94%" note="+2%" />
              </div>
            </div>
            <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-gray-900">LinkedIn Performance</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <KPIBar label="Connection Growth" value="65%" note="+15%" />
                <KPIBar label="Post Engagement" value="42%" note="+0.5%" />
                <KPIBar label="Profile Views" value="55%" note="+22%" />
                <KPIBar label="Lead Generation" value="48%" note="+3" />
              </div>
            </div>
            <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-gray-900">Business Impact</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <KPIBar label="Website Traffic" value="62%" note="+28%" />
                <KPIBar label="Email Sign-ups" value="67%" note="+19" />
                <KPIBar label="Consultation Bookings" value="40%" note="+3" />
                <KPIBar label="Brand Mentions" value="52%" note="+12" />
              </div>
            </div>
            <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm mt-4">
              <h3 className="text-sm font-semibold text-gray-900">Monthly Goals Progress</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <KPIBar label="Community Growth" value="78%" note="156/200 new followers this month" />
                <KPIBar label="Engagement Target" value="100%" note="6.8% achieved (5% target)" />
                <KPIBar label="Lead Generation" value="100%" note="18/15 qualified leads" />
                <KPIBar label="Content Consistency" value="95%" note="29/30 planned posts published" />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
