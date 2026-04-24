/**
 * useCampaignForm Hook
 *
 * Manages campaign form state and logic
 * Extracted from CampaignForm.jsx for better reusability and testability
 */

import { useState, useEffect, useCallback } from 'react';
import { INITIAL_FORM_STATE } from '../../../../constants/campaignFormConstants';

export function useCampaignForm(post) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [isSaving, setIsSaving] = useState(false);

  // Load form data from post
  const loadFormData = useCallback((postData) => {
    if (postData) {
      setForm({
        // ID
        id: postData.id || null,

        // Basic Information
        title: postData.title || "",
        taskType: postData.taskType || "content",
        platform: postData.platform || "",
        assetType: postData.assetType || "",
        contentType: postData.contentType || "",
        effortLevel: postData.effortLevel || "",

        // Strategic Context
        goal: postData.goal || "",
        reason: postData.reason || "",
        basedOn: postData.basedOn || "",
        pillar: postData.pillar || "",

        // Content Structure
        hook: postData.hook || "",
        body: postData.body || "",
        angle: postData.angle || "",
        cta: postData.cta || "",

        // Execution Details
        format: postData.format || "",
        assets: postData.assets || [],

        // Status & Tracking
        status: postData.status || "todo",

        // Feedback
        feedbackType: postData.feedbackType || "",
        notes: postData.notes || "",

        // Generated Image
        generatedImageSvg: postData.generatedImageSvg || null,
        hasGeneratedImage: Boolean(postData.generatedImageSvg),
      });
    }
  }, []);

  // Initialize form when post changes
  useEffect(() => {
    loadFormData(post);
  }, [post, loadFormData]);

  // Handle field changes
  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
  }, []);

  return {
    form,
    setForm,
    isSaving,
    setIsSaving,
    handleChange,
    loadFormData,
    resetForm,
  };
}
