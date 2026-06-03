import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVoiceRecognition } from "../../Pages/Tools/Chat/useVoiceRecognition";
import WelcomeScreen from "./WelcomeScreen";
import QuestionView from "./QuestionView";
import ProgressBar from "./ProgressBar";
import CompletionScreen from "./CompletionScreen";
import LoadingTransition from "../LoadingTransition";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

const pageTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

export default function InteractiveTest({
  steps,
  title,
  onSubmit,
  onLoadData,
  loadingMessage = "Saving...",
  backPath = "/test-selection",
}) {
  const [phase, setPhase] = useState("welcome"); // welcome, questions, completed
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({}); // For file uploads
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Filter visible steps based on showIf conditions
  const visibleSteps = steps.filter((step) => {
    if (!step.showIf) return true;
    return answers[step.showIf.field] === step.showIf.value;
  });

  const currentQuestion = visibleSteps[currentStep];
  const totalQuestions = visibleSteps.length;

  // Voice recognition
  const { isVoiceMode, toggleVoiceMode } = useVoiceRecognition({
    onTranscriptChange: (transcript) => {
      if (currentQuestion && (currentQuestion.type === "textarea" || currentQuestion.type === "url")) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.field]: transcript,
        }));
      }
    },
    playSound: () => {},
  });

  // Load existing data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (onLoadData) {
          const existingAnswers = await onLoadData();
          if (existingAnswers) {
            setAnswers(existingAnswers);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [onLoadData]);

  // Handle answer change
  const handleAnswerChange = useCallback((field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle file change for conditional uploads
  const handleFileChange = useCallback((field, file) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  }, []);

  // Navigate to specific question
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < visibleSteps.length) {
      setDirection(index > currentStep ? 1 : -1);
      setCurrentStep(index);
    }
  }, [currentStep, visibleSteps.length]);

  // Handle next
  const handleNext = useCallback(async () => {
    if (currentStep === visibleSteps.length - 1) {
      // Last question - submit
      setIsSubmitting(true);
      setError(null);
      try {
        await onSubmit(answers, uploadedFiles);
        setPhase("completed");
      } catch (err) {
        setError(err.message || "Failed to submit");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, visibleSteps.length, answers, uploadedFiles, onSubmit]);

  // Handle previous
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Check if current question is answered (for required fields)
  const isCurrentAnswered = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    const answer = answers[currentQuestion.field];
    if (Array.isArray(answer)) return answer.length > 0;
    return answer !== undefined && answer !== null && answer !== "";
  };

  // Start the test
  const handleStart = () => {
    setPhase("questions");
  };

  // Check which questions are completed
  const getCompletedQuestions = () => {
    return visibleSteps.map((step) => {
      const answer = answers[step.field];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== null && answer !== "";
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <LoadingTransition isLoading={isSubmitting} message={loadingMessage} />

      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen"
          >
            <WelcomeScreen
              title={title}
              onStart={handleStart}
              onBack={backPath}
            />
          </motion.div>
        )}

        {phase === "questions" && currentQuestion && (
          <motion.div
            key="questions"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen flex flex-col"
          >
            {/* Main content area */}
            <div className="flex-1 flex items-center justify-center relative px-4 md:px-20 py-8">
              {/* Previous arrow */}
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full transition-all duration-300 ${
                  currentStep === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-100 hover:scale-110 active:scale-95"
                }`}
              >
                <ChevronLeft className="w-10 h-10 md:w-12 md:h-12 text-gray-600" />
              </button>

              {/* Question content */}
              <div className="max-w-2xl w-full mx-auto">
                <QuestionView
                  question={currentQuestion}
                  answer={answers[currentQuestion.field]}
                  onAnswerChange={(value) => handleAnswerChange(currentQuestion.field, value)}
                  direction={direction}
                  isVoiceMode={isVoiceMode}
                  toggleVoiceMode={toggleVoiceMode}
                  onNext={handleNext}
                  isAnswered={isCurrentAnswered()}
                  isSubmitting={isSubmitting}
                  isLastQuestion={currentStep === visibleSteps.length - 1}
                  uploadedFile={currentQuestion.conditionalUpload ? uploadedFiles[currentQuestion.conditionalUpload.field] : null}
                  onFileChange={handleFileChange}
                />

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Next arrow */}
              <button
                onClick={handleNext}
                disabled={!isCurrentAnswered() || isSubmitting}
                className={`fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full transition-all duration-300 ${
                  !isCurrentAnswered() || isSubmitting
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-100 hover:scale-110 active:scale-95"
                }`}
              >
                <ChevronRight className="w-10 h-10 md:w-12 md:h-12 text-gray-600" />
              </button>
            </div>

            {/* Progress bar at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 py-4 px-4">
              <ProgressBar
                total={totalQuestions}
                current={currentStep}
                completed={getCompletedQuestions()}
                questions={visibleSteps}
                onNavigate={goToQuestion}
              />
            </div>
          </motion.div>
        )}

        {phase === "completed" && (
          <motion.div
            key="completed"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen"
          >
            <CompletionScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
