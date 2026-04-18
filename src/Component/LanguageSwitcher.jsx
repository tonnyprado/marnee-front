import { useState, useRef, useEffect } from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all hover:bg-gray-50 group ${className}`}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Languages className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-12' : ''} group-hover:scale-110`} />
        <span className="font-medium hidden sm:inline">{currentLanguage?.code.toUpperCase()}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[160px] bg-white border border-[rgba(30,30,30,0.1)] rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2.5 text-left text-sm transition-all hover:bg-[#f6f6f6] flex items-center gap-3 ${
                language === lang.code
                  ? "bg-[#ede0f8] text-[#40086d] font-medium"
                  : "text-gray-700"
              }`}
            >
              <span className="text-lg leading-none">{lang.flag}</span>
              <span className="flex-1">{lang.label}</span>
              {language === lang.code && (
                <svg className="w-4 h-4 text-[#40086d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
