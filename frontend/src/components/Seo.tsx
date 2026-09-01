import { absoluteUrl, buildTitle, SITE_NAME } from '@/lib/seo';

interface SeoProps {
  /** Page title without the site suffix; omit on the home page. */
  title?: string;
  description: string;
  /** Path or absolute URL for the canonical link + og:url. */
  path: string;
  /** Absolute or app-relative image URL for social cards. */
  image?: string;
  /** `website` for content pages, `article`/`product`-like for listings. */
  type?: 'website' | 'article';
  noindex?: boolean;
  /** JSON-LD object rendered as a script tag. */
  jsonLd?: Record<string, unknown>;
}

/**
 * Document metadata. React 19 hoists `<title>`, `<meta>` and `<link>` rendered
 * anywhere in the tree into `<head>` — no helmet library needed (ADR-011).
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = buildTitle(title);
  const url = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : absoluteUrl('/assets/branding/kpearl-icon-512.png');

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
    </>
  );
}
