import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function TestSelectionPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [testTypes, setTestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessTestProgress, setBusinessTestProgress] = useState(0);
  const [personalTestProgress, setPersonalTestProgress] = useState(0);

  const loadTestTypes = React.useCallback(async () => {
    try {
      const types = await api.getTestTypes();
      setTestTypes(types);
    } catch (error) {
      console.error("Error loading test types:", error);
      // Set default test types if API fails
      setTestTypes([
        {
          testType: "business",
          name: t("testSelection.defaultBusinessName"),
          description: t("testSelection.defaultBusinessDescription"),
          isMandatory: true,
          priority: 1
        },
        {
          testType: "personal",
          name: t("testSelection.defaultPersonalName"),
          description: t("testSelection.defaultPersonalDescription"),
          isMandatory: false,
          priority: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadProgress = React.useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadTestTypes();
    loadProgress();
  }, [loadTestTypes, loadProgress]);

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
          <div className="w-16 h-16 border-4 border-[#dccaf4] border-t-[#40086d] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("testSelection.loading")}</p>
        </div>
      </div>
    );
  }

  const sortedTests = [...testTypes].sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-[#1e1e1e]" style={{ fontFamily: "var(--font-display)" }}>
            {t("testSelection.title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("testSelection.subtitle")}
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
                className={`relative bg-white rounded border transition-all duration-300 hover:shadow-md ${
                  test.isMandatory
                    ? "border-[#dccaf4] shadow-sm"
                    : "border-[rgba(30,30,30,0.1)]"
                }`}
              >
                {/* Mandatory Badge */}
                {test.isMandatory && (
                  <div className="absolute -top-3 -right-3 bg-[#40086d] text-[#dccaf4] px-4 py-1 rounded text-xs font-semibold shadow flex items-center gap-1">
                    <span>⭐</span>
                    <span>{t("testSelection.required")}</span>
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
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      test.isMandatory
                        ? "bg-[#ede0f8] text-[#40086d]"
                        : "bg-[#f6f6f6] text-gray-600"
                    }`}>
                      {test.isMandatory ? t("testSelection.mandatory") : t("testSelection.optional")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t("testSelection.priority")} {test.priority}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {isStarted && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">{t("testSelection.progress")}</span>
                        <span className="text-xs font-semibold text-gray-700">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#40086d] transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectTest(test.testType)}
                    className={`w-full py-3 px-6 rounded font-medium text-sm transition ${
                      test.isMandatory
                        ? "bg-[#1e1e1e] text-white hover:bg-[#dccaf4] hover:text-[#1a0530]"
                        : "bg-[#f6f6f6] text-gray-700 border border-[rgba(30,30,30,0.1)] hover:bg-[#ede0f8]"
                    }`}
                  >
                    {isStarted ? (
                      <>
                        {progress >= 100 ? t("testSelection.reviewTest") : t("testSelection.continueTest")}
                      </>
                    ) : (
                      t("testSelection.startTest")
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ede0f8] px-6 py-3 rounded border border-[#dccaf4]">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-[#40086d]">
              {t("testSelection.footer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
