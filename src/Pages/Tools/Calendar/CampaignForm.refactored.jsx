/**
 * CampaignForm - Refactored Campaign Post Edit Form
 *
 * BEFORE: 703 lines monolithic component
 * AFTER: ~180 lines using modular sections and hooks
 *
 * Reduction: 74% smaller main file
 */

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

// Hooks
import { useCampaignForm } from './hooks/useCampaignForm';
import { useCampaignImageHandler } from './hooks/useCampaignImageHandler';

// Layout Components
import FormHeader from './FormHeader';
import FormTabs from './FormTabs';
import FormFooter from './FormFooter';

// Form Sections
import {
  BasicInfoSection,
  StrategicContextSection,
  ContentStructureSection,
  ExecutionDetailsSection,
  VisualContentSection,
  StatusTrackingSection,
  FeedbackSection,
} from './FormSections';

// Existing Components
import CommentsSection from './CommentsSection';
import ImagePreviewModal from '../../../Component/ImageGenerator/ImagePreviewModal';

export default function CampaignForm({ post, postIndex, onClose, onSave }) {
  const { founderId } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

  // Form state and handlers
  const { form, handleChange, isSaving, setIsSaving } = useCampaignForm(post);

  // Image handling
  const {
    isImageModalOpen,
    setIsImageModalOpen,
    loadedImage,
    setLoadedImage,
    handleEditImage,
    isGenerating,
  } = useCampaignImageHandler();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(form);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditImageClick = () => {
    handleEditImage(form.id);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[480px] bg-white text-gray-900 shadow-2xl flex flex-col z-50 border-l border-[rgba(30,30,30,0.1)]">
      {/* Header */}
      <FormHeader post={post} onClose={onClose} />

      {/* Tabs */}
      <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      {activeTab === 'details' ? (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <BasicInfoSection form={form} handleChange={handleChange} />

          <StrategicContextSection form={form} handleChange={handleChange} />

          <ContentStructureSection form={form} handleChange={handleChange} />

          <ExecutionDetailsSection form={form} handleChange={handleChange} />

          <VisualContentSection
            form={form}
            founderId={founderId}
            handleEditImage={handleEditImageClick}
            isGenerating={isGenerating}
          />

          <StatusTrackingSection form={form} handleChange={handleChange} />

          <FeedbackSection form={form} handleChange={handleChange} />

          {/* Week info */}
          {post?.weekNumber && (
            <div className="text-xs text-gray-500 pt-2 border-t border-[rgba(30,30,30,0.1)]">
              Week {post.weekNumber} • {post.dayOfWeek}
            </div>
          )}
        </form>
      ) : (
        <CommentsSection postId={post?.id} />
      )}

      {/* Footer */}
      <FormFooter
        activeTab={activeTab}
        onClose={onClose}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      />

      {/* Image Preview Modal */}
      {isImageModalOpen && loadedImage && (
        <ImagePreviewModal
          image={loadedImage}
          onClose={() => {
            setIsImageModalOpen(false);
            setLoadedImage(null);
          }}
          post={form}
          founderId={founderId}
          postId={form.id}
        />
      )}
    </div>
  );
}
