import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Upload, FileText, X, CheckCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";

// Animation variants for question transitions
const questionVariants = {
  enter: (direction) => ({
    opacity: 0,
    scale: 0.9,
    x: direction > 0 ? 100 : -100,
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    scale: 1.1,
    x: direction > 0 ? -100 : 100,
  }),
};

const questionTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

export default function QuestionView({
  question,
  answer,
  onAnswerChange,
  direction,
  isVoiceMode,
  toggleVoiceMode,
  onNext,
  isAnswered,
  isSubmitting,
  isLastQuestion,
  uploadedFile,
  onFileChange,
}) {
  const [uploadError, setUploadError] = useState(null);

  if (!question) return null;

  const renderInput = () => {
    switch (question.type) {
      case "radio":
        const { conditionalUpload } = question;
        const showUpload = conditionalUpload && answer === conditionalUpload.showWhen;

        const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
          setUploadError(null);
          if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            if (error.code === 'file-too-large') {
              setUploadError('File is too large. Maximum size is 10MB.');
            } else if (error.code === 'file-invalid-type') {
              setUploadError('Invalid file type. Please upload PDF, PNG, or JPG.');
            } else {
              setUploadError(error.message);
            }
            return;
          }
          if (acceptedFiles.length > 0 && onFileChange && conditionalUpload) {
            const file = acceptedFiles[0];
            onFileChange(conditionalUpload.field, file);
          }
        }, [onFileChange, conditionalUpload]);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          accept: conditionalUpload?.accept || {},
          maxSize: conditionalUpload?.maxSize || 10 * 1024 * 1024,
          maxFiles: 1,
          disabled: !showUpload,
        });

        const removeFile = () => {
          if (onFileChange && conditionalUpload) {
            onFileChange(conditionalUpload.field, null);
          }
          setUploadError(null);
        };

        return (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, index) => {
                const isSelected = answer === option.value;
                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onAnswerChange(option.value)}
                    className={`text-left border-2 rounded-xl px-6 py-5 transition-all duration-200 ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-100"
                        : "border-gray-200 hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-violet-500 bg-violet-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2.5 h-2.5 bg-white rounded-full"
                          />
                        )}
                      </span>
                      <span
                        className={`text-base font-medium ${
                          isSelected ? "text-violet-900" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Conditional File Upload */}
            <AnimatePresence>
              {showUpload && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {conditionalUpload.label}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {conditionalUpload.description}
                    </p>

                    {!uploadedFile ? (
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                          isDragActive
                            ? "border-violet-500 bg-violet-50"
                            : "border-gray-300 hover:border-violet-400 hover:bg-white"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        {isDragActive ? (
                          <p className="text-sm text-violet-600 font-medium">
                            Drop your file here...
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600">
                              <span className="text-violet-600 font-medium">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PDF, PNG, JPG (max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-between bg-white border-2 border-green-200 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Error Message */}
                    <AnimatePresence>
                      {uploadError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-xs text-red-600 mt-2"
                        >
                          {uploadError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case "multiSelect":
        const selectedItems = answer || [];
        return (
          <div className="mt-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {question.options.map((option, index) => {
                const isSelected = selectedItems.includes(option);
                const canSelect = !isSelected && selectedItems.length < (question.maxSelect || 99);
                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: canSelect || isSelected ? 1.05 : 1 }}
                    whileTap={{ scale: canSelect || isSelected ? 0.95 : 1 }}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        onAnswerChange(selectedItems.filter((o) => o !== option));
                      } else if (canSelect) {
                        onAnswerChange([...selectedItems, option]);
                      }
                    }}
                    disabled={!canSelect && !isSelected}
                    className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-200"
                        : canSelect
                        ? "border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50"
                        : "border-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>
            {question.maxSelect && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Selected: {selectedItems.length}/{question.maxSelect}
              </p>
            )}
            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              type="button"
              onClick={onNext}
              disabled={!isAnswered || isSubmitting}
              className={`mt-6 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isAnswered && !isSubmitting
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLastQuestion ? "Finish" : "Continue"}
            </motion.button>
          </div>
        );

      case "textarea":
      case "url":
        const handleKeyDown = (e) => {
          if (e.key === "Enter" && !e.shiftKey && isAnswered && onNext) {
            e.preventDefault();
            onNext();
          }
        };
        return (
          <div className="mt-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <textarea
                value={answer || ""}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isVoiceMode ? "Listening... Speak now" : question.placeholder
                }
                rows={question.type === "url" ? 1 : 4}
                className={`w-full bg-gray-50 border-2 ${
                  isVoiceMode
                    ? "border-red-400 ring-4 ring-red-100"
                    : "border-gray-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                } rounded-xl px-5 py-4 pr-14 text-base text-gray-900 placeholder-gray-400 focus:outline-none transition-all resize-none`}
              />
              {/* Voice button */}
              <button
                type="button"
                onClick={toggleVoiceMode}
                className={`absolute right-4 top-4 p-2 rounded-lg transition-all ${
                  isVoiceMode
                    ? "bg-red-500 text-white shadow-lg shadow-red-200"
                    : "hover:bg-gray-200 text-gray-500"
                }`}
                title={isVoiceMode ? "Stop recording" : "Start voice input"}
              >
                {isVoiceMode ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </motion.div>
            {/* Voice mode indicator */}
            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-center gap-2 text-sm text-red-600"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Recording... Click the microphone to stop
              </motion.div>
            )}
            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              type="button"
              onClick={onNext}
              disabled={!isAnswered || isSubmitting}
              className={`mt-6 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isAnswered && !isSubmitting
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLastQuestion ? "Finish" : "Continue"}
            </motion.button>
          </div>
        );

      case "slider":
        const sliderValue = answer || question.min || 1;
        return (
          <div className="mt-8 max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Current value display */}
              <div className="text-center">
                <span className="text-6xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {sliderValue}
                </span>
              </div>
              {/* Slider */}
              <input
                type="range"
                min={question.min || 1}
                max={question.max || 10}
                value={sliderValue}
                onChange={(e) => onAnswerChange(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-violet-600"
                style={{
                  background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${
                    ((sliderValue - (question.min || 1)) /
                      ((question.max || 10) - (question.min || 1))) *
                    100
                  }%, #e5e7eb ${
                    ((sliderValue - (question.min || 1)) /
                      ((question.max || 10) - (question.min || 1))) *
                    100
                  }%, #e5e7eb 100%)`,
                }}
              />
              {/* Min/Max labels */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{question.min || 1}</span>
                <span>{question.max || 10}</span>
              </div>
            </motion.div>
            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              type="button"
              onClick={onNext}
              disabled={!isAnswered || isSubmitting}
              className={`mt-6 w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                isAnswered && !isSubmitting
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 hover:shadow-xl"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLastQuestion ? "Finish" : "Continue"}
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={questionVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={questionTransition}
        className="text-center"
      >
        {/* Subtitle / Section */}
        {question.section && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm font-medium mb-3"
          >
            {question.section}
          </motion.p>
        )}

        {/* Main question */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
        >
          {question.question}
        </motion.h2>

        {/* Subtitle */}
        {question.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base"
          >
            {question.subtitle}
          </motion.p>
        )}

        {/* Required indicator */}
        {question.required && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="inline-block mt-2 text-xs text-red-500 font-medium"
          >
            * Required
          </motion.span>
        )}

        {/* Input area */}
        {renderInput()}
      </motion.div>
    </AnimatePresence>
  );
}
