import React from "react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-sm text-gray-700 shadow-lg shadow-gray-200/40 backdrop-blur ${className}`}
    >
      <label htmlFor="language-switcher" className="font-medium text-gray-600">
        {t("language.label")}
      </label>
      <select
        id="language-switcher"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        aria-label={t("language.ariaLabel")}
        className="bg-transparent font-medium text-gray-900 outline-none"
      >
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
