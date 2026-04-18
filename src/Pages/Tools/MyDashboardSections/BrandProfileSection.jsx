import React from "react";
import { useBrandProfile } from "../../../hooks/useBrandProfile";
import BrandAssessmentCard from "./BrandProfile/BrandAssessmentCard";
import BrandPurposeCard from "./BrandProfile/BrandPurposeCard";
import BrandVoiceCard from "./BrandProfile/BrandVoiceCard";
import BrandStoryCard from "./BrandProfile/BrandStoryCard";
import ContentPillarsCard from "./BrandProfile/ContentPillarsCard";
import UploadGuidelinesCard from "./BrandProfile/UploadGuidelinesCard";
import BrandRecommendationsCard from "./BrandProfile/BrandRecommendationsCard";

export default function BrandProfileSection({ founderId, sessionId }) {
  const {
    brandProfile,
    loading,
    error,
    generating,
    regeneratingSection,
    generateBrandProfile,
    regenerateSection,
    uploadGuidelines,
    deleteGuidelines,
  } = useBrandProfile(founderId, sessionId);

  const handleGenerateProfile = async () => {
    try {
      await generateBrandProfile();
    } catch (err) {
      console.error("Failed to generate brand profile:", err);
    }
  };

  const handleRegenerateSection = async (section) => {
    try {
      await regenerateSection(section);
    } catch (err) {
      console.error(`Failed to regenerate ${section}:`, err);
    }
  };

  const handleUploadGuidelines = async (file) => {
    try {
      await uploadGuidelines(file);
    } catch (err) {
      console.error("Failed to upload guidelines:", err);
    }
  };

  const handleDeleteGuidelines = async (guidelineId) => {
    try {
      await deleteGuidelines(guidelineId);
    } catch (err) {
      console.error("Failed to delete guidelines:", err);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Brand Profile</h1>
          <p className="text-sm text-gray-500">
            AI-powered brand analysis and guidelines based on your brand assessment
          </p>
        </div>
        {!loading && !brandProfile && (
          <button
            onClick={handleGenerateProfile}
            disabled={generating || !founderId}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading brand profile...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !brandProfile && (
        <div className="text-center py-12 bg-white border border-[rgba(30,30,30,0.1)] rounded">
          <div className="mb-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#ede0f8] flex items-center justify-center text-2xl text-[#40086d]">
              BP
            </div>
          </div>
          <p className="text-gray-700 font-semibold mb-2">No Brand Profile Yet</p>
          <p className="text-gray-500 mb-4">
            Generate your brand profile using AI based on your tests, conversations, and data.
          </p>
          {founderId && (
            <button
              onClick={handleGenerateProfile}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-[#40086d] text-white text-sm font-medium hover:bg-[#300651] transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Brand Profile with AI"}
            </button>
          )}
        </div>
      )}

      {/* Brand Profile Content */}
      {!loading && !error && brandProfile && (
        <>
          {/* Assessment */}
          <BrandAssessmentCard
            score={brandProfile.assessment?.score || 87}
            metrics={brandProfile.assessment?.metrics}
            message={brandProfile.assessment?.message}
          />

          {/* Purpose + Personality */}
          <div className="grid grid-cols-2 gap-4">
            <BrandPurposeCard
              purposeStatement={brandProfile.purpose?.statement}
              marketPosition={brandProfile.purpose?.marketPosition}
              onRegenerate={
                regeneratingSection === "purpose" ? null : handleRegenerateSection
              }
            />

            <BrandVoiceCard
              tone={brandProfile.voice?.tone}
              style={brandProfile.voice?.style}
              personality={brandProfile.voice?.personality}
              onRegenerate={
                regeneratingSection === "voice" ? null : handleRegenerateSection
              }
            />
          </div>

          {/* Brand Story */}
          <BrandStoryCard
            story={brandProfile.story}
            onRegenerate={
              regeneratingSection === "story" ? null : handleRegenerateSection
            }
          />

          {/* Content Pillars + Upload */}
          <div className="grid grid-cols-2 gap-4">
            <ContentPillarsCard
              pillars={brandProfile.pillars}
              onRegenerate={
                regeneratingSection === "pillars" ? null : handleRegenerateSection
              }
            />

            <UploadGuidelinesCard
              uploadedFile={brandProfile.uploadedGuidelines}
              onUpload={handleUploadGuidelines}
              onDelete={handleDeleteGuidelines}
              disabled={true} // Coming soon
            />
          </div>

          {/* Recommendations */}
          <BrandRecommendationsCard
            recommendations={brandProfile.guidelinesRecommendations}
            onRegenerate={
              regeneratingSection === "guidelines" ? null : handleRegenerateSection
            }
          />
        </>
      )}

      {/* Regenerating Overlay */}
      {regeneratingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-6 w-6 border-2 border-[#40086d] border-t-transparent rounded-full"></div>
              <p className="text-gray-700">
                Regenerating {regeneratingSection}...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
