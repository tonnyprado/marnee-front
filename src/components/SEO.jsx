import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for managing meta tags dynamically per page
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} [props.keywords] - Page keywords (optional)
 * @param {string} [props.image] - OG image URL (optional, defaults to /og-image.png)
 * @param {string} [props.url] - Canonical URL (optional)
 * @param {string} [props.type] - OG type (optional, defaults to 'website')
 * @param {Object} [props.schema] - Schema.org structured data (optional)
 */
export default function SEO({
  title,
  description,
  keywords,
  image = '/og-image.png',
  url = 'https://www.dn-hub.com/',
  type = 'website',
  schema
}) {
  const fullTitle = title ? `${title} | Marnee` : 'Marnee - AI-Powered Marketing Strategy Platform';
  const imageUrl = image.startsWith('http') ? image : `https://www.dn-hub.com${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Schema.org structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
