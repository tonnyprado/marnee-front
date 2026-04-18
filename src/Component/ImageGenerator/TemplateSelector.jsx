import React from 'react';

/**
 * Selector for image templates.
 * Allows user to switch between different design templates.
 */
export default function TemplateSelector({ selected, onChange, platform }) {
  const templates = [
    {
      id: 'quote-minimal',
      name: 'Minimal Quote',
      description: 'Clean, minimal design',
      icon: '✨',
    },
    {
      id: 'quote-bold',
      name: 'Bold Quote',
      description: 'Bold typography with gradient',
      icon: '🔥',
    },
    {
      id: 'tip-card',
      name: 'Tip Card',
      description: 'Card-style for educational tips',
      icon: '💡',
    },
    {
      id: 'story-cta',
      name: 'Story CTA',
      description: 'Vertical story format',
      icon: '📱',
      platforms: ['Story', 'Instagram Stories'],
    },
  ];

  // Filter templates by platform if needed
  const filteredTemplates = platform
    ? templates.filter(
        (t) =>
          !t.platforms ||
          t.platforms.some((p) => p.toLowerCase().includes(platform.toLowerCase()))
      )
    : templates;

  return (
    <div className="space-y-2">
      {filteredTemplates.map((template) => (
        <button
          key={template.id}
          onClick={() => onChange(template.id)}
          className={`w-full text-left px-3 py-2.5 rounded-lg border transition ${
            selected === template.id
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">{template.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{template.description}</div>
            </div>
            {selected === template.id && (
              <svg
                className="w-4 h-4 text-violet-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
