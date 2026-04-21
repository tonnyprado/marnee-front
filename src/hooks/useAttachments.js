import { useState, useCallback } from 'react';

const ALLOWED_TYPES = {
  image: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

/**
 * Custom hook for managing file attachments for image regeneration.
 * Validates file types, sizes, and provides preview generation for images.
 */
export function useAttachments() {
  const [attachments, setAttachments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  const validateFile = useCallback((file) => {
    const errors = [];

    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File size exceeds 10MB limit`);
    }

    const allAllowedTypes = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document];
    if (!allAllowedTypes.includes(file.type)) {
      errors.push(`${file.name}: File type not supported`);
    }

    return errors;
  }, []);

  const addFiles = useCallback(
    (files) => {
      const newErrors = [];
      const validFiles = [];

      // Check max files limit
      if (attachments.length + files.length > MAX_FILES) {
        newErrors.push(`Maximum ${MAX_FILES} files allowed`);
      }

      Array.from(files).forEach((file) => {
        const fileErrors = validateFile(file);
        if (fileErrors.length > 0) {
          newErrors.push(...fileErrors);
        } else if (validFiles.length + attachments.length < MAX_FILES) {
          validFiles.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            name: file.name,
            type: file.type,
            size: file.size,
            preview: ALLOWED_TYPES.image.includes(file.type)
              ? URL.createObjectURL(file)
              : null,
            status: 'pending',
          });
        }
      });

      setErrors(newErrors);
      setAttachments((prev) => [...prev, ...validFiles]);

      return validFiles;
    },
    [attachments, validateFile]
  );

  const removeFile = useCallback((id) => {
    setAttachments((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    attachments.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setAttachments([]);
    setErrors([]);
  }, [attachments]);

  const getFormData = useCallback(() => {
    const formData = new FormData();
    attachments.forEach((attachment, index) => {
      formData.append(`attachment_${index}`, attachment.file);
    });
    return formData;
  }, [attachments]);

  return {
    attachments,
    addFiles,
    removeFile,
    clearAll,
    getFormData,
    errors,
    uploadProgress,
    setUploadProgress,
    maxFiles: MAX_FILES,
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES,
  };
}
