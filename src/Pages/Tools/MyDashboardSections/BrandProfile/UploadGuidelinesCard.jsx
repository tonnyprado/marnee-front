import React, { useState } from "react";

export default function UploadGuidelinesCard({ uploadedFile, onUpload, onDelete, disabled = true }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0 && onUpload) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (disabled) return;

    const files = e.target.files;
    if (files.length > 0 && onUpload) {
      onUpload(files[0]);
    }
  };

  return (
    <div className="bg-white border border-[rgba(30,30,30,0.1)] rounded p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[#ede0f8] flex items-center justify-center text-xs font-semibold text-[#40086d]">
          UG
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          Upload Brand Guidelines
        </h3>
        {disabled && (
          <span className="ml-auto px-2 py-1 rounded bg-yellow-50 text-yellow-600 text-xs">
            Coming Soon
          </span>
        )}
      </div>

      <div
        className={`mt-4 border-2 border-dashed rounded py-10 text-center transition ${
          disabled
            ? "border-[rgba(30,30,30,0.1)] bg-[#f6f6f6] opacity-60 cursor-not-allowed"
            : isDragging
            ? "border-[#40086d] bg-[#ede0f8]"
            : "border-[rgba(30,30,30,0.1)] bg-[#f6f6f6]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-white border border-[rgba(30,30,30,0.1)] flex items-center justify-center text-gray-400 text-xs font-semibold">
          UP
        </div>
        <p className="text-sm font-medium text-gray-700">
          {disabled ? "Brand guidelines upload" : "Drop your brand guidelines here"}
        </p>
        <p className="text-xs text-gray-400">
          {disabled ? "Will be available soon" : "PDF, DOC, or image files accepted"}
        </p>

        {!disabled && (
          <label className="inline-block mt-3 px-4 py-2 bg-[#40086d] text-white text-xs rounded cursor-pointer hover:bg-[#300651] transition">
            Choose File
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
            />
          </label>
        )}
      </div>

      {uploadedFile && (
        <div className="mt-4 border border-[rgba(30,30,30,0.1)] rounded px-4 py-3 flex items-center justify-between bg-white">
          <div>
            <p className="text-sm font-medium text-gray-700">{uploadedFile.name}</p>
            <p className="text-xs text-gray-400">
              {uploadedFile.size ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : '2.4 MB'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xs">
              OK
            </div>
            {onDelete && !disabled && (
              <button
                onClick={() => onDelete(uploadedFile.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
