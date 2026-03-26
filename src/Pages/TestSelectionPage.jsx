import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function TestSelectionPage() {
  const navigate = useNavigate();
  const [testTypes, setTestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessTestProgress, setBusinessTestProgress] = useState(0);
  const [personalTestProgress, setPersonalTestProgress] = useState(0);

  useEffect(() => {
    loadTestTypes();
    loadProgress();
  }, []);

  const loadTestTypes = async () => {
    try {
      const types = await api.getTestTypes();
      setTestTypes(types);
    } catch (error) {
      console.error("Error loading test types:", error);
      // Set default test types if API fails
      setTestTypes([
        {
          testType: "business",
          name: "Business Test",
          description: "Essential assessment to determine your personalized marketing campaign strategy. This test covers your business model, target audience, positioning, and growth priorities.",
          isMandatory: true,
          priority: 1
        },
        {
          testType: "personal",
          name: "Personal Test",
          description: "Optional deeper assessment about your leadership style, values, and personal brand. Helps Marnee create more personalized content recommendations.",
          isMandatory: false,
          priority: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      // Check Business Test progress
      try {
        const businessTest = await api.getBusinessTestMe();
        if (businessTest) {
          const filledFields = Object.values(businessTest).filter(v =>
            v !== null && v !== undefined && v !== '' &&
            (!Array.isArray(v) || v.length > 0)
          ).length;
          const totalFields = 28; // Approximate number of fields
          setBusinessTestProgress(Math.round((filledFields / totalFields) * 100));
        }
      } catch (error) {
        if (error.status === 404) {
          setBusinessTestProgress(0);
        } else {
          throw error;
        }
      }

      // Check Personal Test progress (founder data)
      try {
        const founder = await api.getMeFounder();
        if (founder) {
          // Count filled questionnaire fields
          const questionnaireFields = [
            founder.teamDescriptionWords,
            founder.personalValues,
            founder.decisionStyle,
            founder.focusType,
            founder.leadershipStyle,
            founder.toughDecisionApproach,
            founder.socialMediaComfort,
            founder.publicSpeakingComfort,
            founder.fearOfJudgment,
            founder.firstImpression,
            founder.whyFoundedBusiness,
            founder.personalStoryInfluence,
            founder.businessStoryAndDifferentiator,
            founder.futurePerception,
            founder.desiredLegacy,
            founder.topicsConfidentTeaching,
            founder.topicsPeopleAskAbout,
            founder.contentExperience,
            founder.mainSocialPlatforms,
            founder.signatureStyle,
            founder.otherPassions
          ];
          const filledFields = questionnaireFields.filter(v =>
            v !== null && v !== undefined && v !== '' &&
            (!Array.isArray(v) || v.length > 0)
          ).length;
          setPersonalTestProgress(Math.round((filledFields / 21) * 100));
        }
      } catch (error) {
        // No personal test yet
        setPersonalTestProgress(0);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleSelectTest = (testType) => {
    if (testType === "business") {
      navigate("/business-test/questions");
    } else if (testType === "personal") {
      navigate("/brand-test/questions");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  const sortedTests = [...testTypes].sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Choose Your Test
          </h1>
          <p className="text-lg text-gray-600">
            Complete these assessments to unlock your personalized marketing strategy
          </p>
        </div>

        {/* Test Cards */}
        <div className="space-y-6">
          {sortedTests.map((test) => {
            const progress = test.testType === "business" ? businessTestProgress : personalTestProgress;
            const isStarted = progress > 0;

            return (
              <div
                key={test.testType}
                className={`relative bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  test.isMandatory
                    ? "border-violet-300 shadow-lg shadow-violet-100"
                    : "border-gray-200"
                }`}
              >
                {/* Mandatory Badge */}
                {test.isMandatory && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                    <span>⭐</span>
                    <span>REQUIRED</span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {test.testType === "business" ? "🎯" : "👤"} {test.name}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {test.description}
                      </p>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.isMandatory
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {test.isMandatory ? "Mandatory" : "Optional"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Priority {test.priority}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {isStarted && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-semibold text-gray-700">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectTest(test.testType)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      test.isMandatory
                        ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 shadow-lg shadow-violet-500/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isStarted ? (
                      <>
                        {progress >= 100 ? "Review Test" : "Continue Test"}
                      </>
                    ) : (
                      "Start Test"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 px-6 py-3 rounded-full border border-violet-200">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-violet-700">
              Start with the <strong>Business Test</strong> to unlock your marketing campaign
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
