/**
 * LanguageContext - Refactored to use StorageService
 *
 * BEFORE: Direct localStorage usage (lines 9, 34)
 * AFTER: Uses StorageService from core (React Native ready)
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, translations } from "../i18n/translations";
import storage from '../core/services/StorageService';

const STORAGE_KEY = "marnee_language";

const LanguageContext = createContext(null);

function getStoredLanguage() {
  const stored = storage.getItem(STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.some((language) => language.code === stored)) {
    return stored;
  }
  return DEFAULT_LANGUAGE;
}

function getValueByPath(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

function interpolate(template, params) {
  if (typeof template !== "string" || !params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] ?? `{${key}}`;
  });
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage);

  useEffect(() => {
    storage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];

    const t = (path, params) => {
      const translatedValue =
        getValueByPath(dictionary, path) ??
        getValueByPath(translations[DEFAULT_LANGUAGE], path) ??
        path;

      return interpolate(translatedValue, params);
    };

    return {
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
