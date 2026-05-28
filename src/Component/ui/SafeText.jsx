import React from 'react';

/**
 * SafeText - Security component to render text with line breaks safely
 *
 * REPLACES: dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
 *
 * This component prevents XSS attacks by avoiding dangerouslySetInnerHTML
 * and instead using React elements to handle line breaks and highlights.
 *
 * @example
 * // Instead of:
 * <div dangerouslySetInnerHTML={{ __html: t('key').replace(/\n/g, '<br />') }} />
 *
 * // Use:
 * <SafeText text={t('key')} />
 *
 * @example
 * // With highlight:
 * <SafeText text="Join 20+ founders" highlight="20+" />
 */

/**
 * Render text with \n converted to <br /> safely
 */
export function SafeText({ text, className, highlight, as: Component = 'span' }) {
  if (typeof text !== 'string') {
    return null;
  }

  // Split by newlines
  const lines = text.split('\n');

  // Build React elements
  const elements = lines.reduce((acc, line, index) => {
    // If we need to highlight something in the line
    if (highlight && line.includes(highlight)) {
      const parts = line.split(highlight);
      const highlightedLine = parts.reduce((lineAcc, part, partIndex) => {
        lineAcc.push(<React.Fragment key={`part-${index}-${partIndex}`}>{part}</React.Fragment>);
        if (partIndex < parts.length - 1) {
          lineAcc.push(<strong key={`hl-${index}-${partIndex}`}>{highlight}</strong>);
        }
        return lineAcc;
      }, []);
      acc.push(<React.Fragment key={`line-${index}`}>{highlightedLine}</React.Fragment>);
    } else {
      acc.push(<React.Fragment key={`line-${index}`}>{line}</React.Fragment>);
    }

    // Add <br /> between lines (not after the last one)
    if (index < lines.length - 1) {
      acc.push(<br key={`br-${index}`} />);
    }

    return acc;
  }, []);

  return <Component className={className}>{elements}</Component>;
}

/**
 * SafeDiv - Wrapper that uses div as the container
 */
export function SafeDiv({ text, className, highlight }) {
  return <SafeText text={text} className={className} highlight={highlight} as="div" />;
}

/**
 * SafeP - Wrapper that uses p as the container
 */
export function SafeP({ text, className, highlight }) {
  return <SafeText text={text} className={className} highlight={highlight} as="p" />;
}

/**
 * SafeH2 - Wrapper that uses h2 as the container
 */
export function SafeH2({ text, className, highlight }) {
  return <SafeText text={text} className={className} highlight={highlight} as="h2" />;
}

export default SafeText;
