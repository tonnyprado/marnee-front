import React, { useCallback, useState, useMemo } from "react";
import { api } from "../services/api";
import { useMarnee } from "../context/MarneeContext";
import InteractiveTest from "../Component/InteractiveTest/InteractiveTest";
import RoleSelector from "../components/BusinessTest/RoleSelector";
import { getQuestionsForRole, getFormTitleForRole } from "../config/businessTestQuestions";

// Helper function to convert businessTestQuestions format to InteractiveTest STEPS format
const convertQuestionsToSteps = (questions, selectedRole) => {
  return questions.map((q, index) => {
    const stepId = index + 1;

    // Determine section based on question position
    let section = "Business Information";

    // First 3 questions are always "Business Context"
    if (stepId <= 3) {
      section = "Business Context";
    }
    // Role-specific questions get their own section
    else if (stepId > 3 && stepId <= questions.length - 2) {
      const roleLabels = {
        'MARKETING_AGENCY': 'Agency Details',
        'COMMUNITY_MANAGER': 'Community Manager Profile',
        'INFLUENCER': 'Influencer Profile',
        'SMALL_BUSINESS': 'Business Details'
      };
      section = roleLabels[selectedRole] || 'Role-Specific Information';
    }
    // Last 2 questions are always "Core Offer"
    else {
      section = "Core Offer";
    }

    // Map question types
    let mappedType = q.type;
    if (q.type === 'multiselect') {
      mappedType = 'multiSelect';
    } else if (q.type === 'boolean') {
      mappedType = 'radio';
    } else if (q.type === 'select' && q.options) {
      mappedType = 'radio';
    }

    // Build step object
    const step = {
      id: stepId,
      section: section,
      field: q.key,
      title: q.question.split('?')[0], // Use first part of question as title
      question: q.question,
      subtitle: "",
      type: mappedType,
      placeholder: q.placeholder || "",
      required: q.required !== undefined ? q.required : false,
    };

    // Add options if they exist
    if (q.options) {
      if (q.type === 'multiselect') {
        // For multiSelect, options are just an array of strings
        step.options = q.options.map(opt =>
          typeof opt === 'string' ? opt : opt.label
        );
      } else if (q.type === 'boolean') {
        // Convert boolean to radio options
        step.options = [
          { value: true, label: "Sí" },
          { value: false, label: "No" }
        ];
      } else {
        // For radio/select, options are objects with value and label
        step.options = q.options.map(opt => ({
          value: opt.value,
          label: opt.label
        }));
      }
    }

    return step;
  });
};

export default function BusinessTestPage() {
  const { founderId: contextFounderId, setFounderId: setContextFounderId } = useMarnee();

  // Role selection state
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRoleSelector, setShowRoleSelector] = useState(true);

  // Generate dynamic steps based on selected role
  const STEPS = useMemo(() => {
    if (!selectedRole) return [];
    const questions = getQuestionsForRole(selectedRole);
    return convertQuestionsToSteps(questions, selectedRole);
  }, [selectedRole]);

  // Handle role selection
  const handleRoleSelect = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  const handleRoleContinue = useCallback(() => {
    if (selectedRole) {
      setShowRoleSelector(false);
    }
  }, [selectedRole]);

  // Load existing data
  const handleLoadData = useCallback(async () => {
    try {
      // Try to get founder ID first
      let founder = null;
      try {
        founder = await api.getMeFounder();
      } catch (error) {
        if (error.status === 404) {
          // No founder profile exists yet - this is OK!
          // Return empty answers, no error
          console.log("No founder profile found - will create one during business test submission");
          return {};
        }
        throw error;
      }

      if (founder?.id) {
        setContextFounderId(founder.id);
      }

      // Try to load existing business test
      try {
        const existingTest = await api.getBusinessTestMe();
        if (existingTest) {
          // Load businessRole first
          if (existingTest.businessRole) {
            setSelectedRole(existingTest.businessRole);
            setShowRoleSelector(false); // Skip role selector if already selected
          }

          const prefilledAnswers = {};

          // Only process fields if we have a role (and thus STEPS)
          if (existingTest.businessRole) {
            const questions = getQuestionsForRole(existingTest.businessRole);
            const steps = convertQuestionsToSteps(questions, existingTest.businessRole);

            steps.forEach((step) => {
              const value = existingTest[step.field];
              if (value !== undefined && value !== null && value !== '') {
                // Convert boolean values back to appropriate format
                if (step.type === 'radio' && typeof value === 'boolean') {
                  prefilledAnswers[step.field] = value;
                } else {
                  prefilledAnswers[step.field] = value;
                }
              }
            });
          }

          return prefilledAnswers;
        }
      } catch (error) {
        if (error.status === 404) {
          // No existing business test - this is OK, return empty answers
          console.log("No existing business test found, starting fresh");
          return {};
        }
        throw error;
      }

      return {};
    } catch (error) {
      console.error("Error loading data:", error);
      // Only throw for real errors, not for missing data
      if (error.status && error.status >= 500) {
        throw error;
      }
      return {};
    }
  }, [setContextFounderId]);

  // Submit the test
  const handleSubmit = useCallback(async (answers, uploadedFiles = {}) => {
    // Ensure founder profile exists
    // First, try to get the founder from the backend (to ensure we have the correct one for this user)
    let currentFounderId = null;

    try {
      console.log("Checking for existing founder profile...");
      const myFounder = await api.getMeFounder();
      if (myFounder?.id) {
        currentFounderId = myFounder.id;
        console.log("Found existing founder profile:", currentFounderId);
        // Update context if different
        if (currentFounderId !== contextFounderId) {
          setContextFounderId(currentFounderId);
        }
      }
    } catch (error) {
      // 404 means no founder exists yet - this is OK
      if (error.statusCode === 404) {
        console.log("No existing founder profile found");
      } else {
        console.error("Error checking founder profile:", error);
        // Continue anyway - we'll try to create one
      }
    }

    // If no founder found, create one
    if (!currentFounderId) {
      console.log("Creating empty founder profile for business test...");
      try {
        const response = await api.submitQuestionnaire({
          teamDescriptionWords: [],
          personalValues: [],
          publicSpeakingComfort: 5,
        });
        if (response?.founderId) {
          currentFounderId = response.founderId;
          setContextFounderId(currentFounderId);
        }
      } catch (error) {
        console.error("Error creating founder profile:", error);
        throw new Error("Failed to create founder profile. Please try again.");
      }
    }

    // Process brand guidelines file if provided
    let brandGuidelinesContent = null;
    if (uploadedFiles.brandGuidelinesFile) {
      try {
        console.log("Processing brand guidelines file with AI...");
        const processResult = await api.processBrandGuidelines(uploadedFiles.brandGuidelinesFile);
        brandGuidelinesContent = processResult.content;
        console.log("Brand guidelines processed successfully");
      } catch (error) {
        console.error("Error processing brand guidelines:", error);
        // Don't fail the whole submission, just log the error
        // The user can continue without processed guidelines
      }
    }

    // Build payload
    const payload = {
      founderId: currentFounderId,
      businessRole: selectedRole // Include selected role
    };

    STEPS.forEach((step) => {
      const value = answers[step.field];
      if (value !== undefined && value !== null && value !== '') {
        payload[step.field] = value;
      }
    });

    // Add processed brand guidelines content
    if (brandGuidelinesContent) {
      payload.brandGuidelinesContent = brandGuidelinesContent;
    }

    // Submit
    await api.submitBusinessTest(payload);

    // Update localStorage
    localStorage.setItem('hasBusinessTest', 'true');

    // Navigation will be handled by CompletionScreen
  }, [contextFounderId, setContextFounderId, selectedRole, STEPS]);

  // Show role selector first
  if (showRoleSelector) {
    return (
      <RoleSelector
        onSelectRole={handleRoleSelect}
        onContinue={handleRoleContinue}
        selectedRole={selectedRole}
      />
    );
  }

  // Then show the business test with dynamic questions
  return (
    <InteractiveTest
      steps={STEPS}
      title={getFormTitleForRole(selectedRole)}
      onSubmit={handleSubmit}
      onLoadData={handleLoadData}
      loadingMessage="Saving your business profile..."
      backPath="/test-selection"
    />
  );
}
