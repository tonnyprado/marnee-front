import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Lightbulb } from "lucide-react";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import LoadingTransition from "../Component/LoadingTransition";

export default function TestSelectionPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [testTypes, setTestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
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
    setIsNavigating(true);
    setTimeout(() => {
      if (testType === "business") {
        navigate("/business-test/questions");
      } else if (testType === "personal") {
        navigate("/brand-test/questions");
      }
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ede0f8] border-t-[#40086d] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t("testSelection.loading")}</p>
        </div>
      </div>
    );
  }

  const sortedTests = [...testTypes].sort((a, b) => (a.priority || 0) - (b.priority || 0));

  return (
    <div className="min-h-screen bg-[#f6f6f6] relative">
      <LoadingTransition isLoading={isNavigating} message="Loading test..." />
      {/* Back Button */}
      <button
        onClick={() => navigate('/app')}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-[#40086d] transition-colors group z-10"
      >
        <lord-icon
          src="https://cdn.lordicon.com/zmkotitn.json"
          trigger="hover"
          colors="primary:#40086d,secondary:#ede0f8"
          style={{width:'32px',height:'32px'}}
        >
        </lord-icon>
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#40086d] via-[#6b21a8] to-[#9333ea] bg-clip-text text-transparent">
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
                className={`relative bg-white rounded border-2 transition-all duration-300 hover:shadow-sm ${
                  test.isMandatory
                    ? "border-[#dccaf4] shadow-sm shadow-[#ede0f8]"
                    : "border-[rgba(30,30,30,0.1)]"
                }`}
              >
                {/* Mandatory Badge */}
                {test.isMandatory && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-[#40086d] to-[#6b21a8] text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{t("testSelection.required")}</span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {test.testType === "business" ? (
                        <lord-icon
                          src="https://cdn.lordicon.com/abhwievu.json"
                          trigger="hover"
                          state="hover-conversation-alt"
                          colors="primary:#a39cf4,secondary:#f49cc8,tertiary:#4030e8,quaternary:#d4d1fa"
                          style={{width:'80px',height:'80px'}}
                        >
                        </lord-icon>
                      ) : (
                        <lord-icon
                          src="https://cdn.lordicon.com/kdduutaw.json"
                          trigger="hover"
                          state="hover-looking-around"
                          colors="primary:#1b1091,secondary:#a866ee"
                          style={{width:'80px',height:'80px'}}
                        >
                        </lord-icon>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {test.name}
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
                        ? "bg-[#ede0f8] text-[#40086d]"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {test.isMandatory ? t("testSelection.mandatory") : t("testSelection.optional")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t("testSelection.priority")} {test.priority}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSelectTest(test.testType)}
                    className={`w-full py-3 px-6 rounded font-semibold text-sm transition-all duration-300 ${
                      test.isMandatory
                        ? "bg-[#1e1e1e] text-white hover:bg-[#dccaf4] hover:text-[#1a0530] shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
          <div className="inline-flex items-center gap-2 bg-[#ede0f8] px-6 py-3 rounded-full border border-[#dccaf4]">
            <Lightbulb className="w-5 h-5 text-[#40086d]" />
            <p className="text-sm text-[#40086d]">
              {t("testSelection.footer")}
            </p>
          </div>
        </div>

        {/* Lordicon Credits */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <a href="https://lordicon.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#40086d] transition-colors">
            Icons by Lordicon.com
          </a>
        </div>
      </div>
    </div>
  );
}
