/**
 * ChatMarkdownComponents
 *
 * Custom markdown renderers for chat messages.
 * Provides styled components for AI and user messages.
 */

// Markdown components for AI messages (formatted text on white background)
export const aiMarkdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-2 text-gray-900" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-1.5 mt-2 text-gray-900" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1.5 mt-2 text-gray-900" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-1 mt-1.5 text-gray-800" {...props} />,
  p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed text-sm" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-1 text-sm" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-1 text-sm" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-sm" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic" {...props} />,
  a: ({ node, ...props }) => <a className="text-[#40086d] hover:text-[#40086d] underline font-medium" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-800" {...props} />
    ) : (
      <code className="block bg-gray-100 p-2 rounded-lg text-xs font-mono overflow-x-auto mb-1 text-gray-800" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-violet-300 pl-3 italic my-1.5 text-gray-700 text-sm" {...props} />
  ),
};

// Markdown components for user messages (white text on gradient background)
export const userMarkdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 mt-2 text-white" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-1.5 mt-2 text-white" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-1.5 mt-2 text-white" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-sm font-semibold mb-1 mt-1.5 text-white" {...props} />,
  p: ({ node, ...props }) => <p className="mb-1 last:mb-0 leading-relaxed text-white text-sm" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-1 space-y-0.5 ml-1 text-white text-sm" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-1 space-y-0.5 ml-1 text-white text-sm" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed text-white text-sm" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-white" {...props} />,
  a: ({ node, ...props }) => <a className="text-white underline hover:text-gray-100 font-medium" {...props} />,
  code: ({ node, inline, ...props }) =>
    inline ? (
      <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono text-white" {...props} />
    ) : (
      <code className="block bg-white/20 p-2 rounded-lg text-xs font-mono overflow-x-auto mb-1 text-white" {...props} />
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-white/50 pl-3 italic my-1.5 text-white text-sm" {...props} />
  ),
};
