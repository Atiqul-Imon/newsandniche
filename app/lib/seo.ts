import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  readingTime?: number;
  wordCount?: number;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    readingTime,
    wordCount
  } = config;

  const siteName = 'News&Niche';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const defaultImage = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'db5yniogx'}/image/upload/v1/default-og-image.jpg`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'News&Niche Team' }],
    creator: 'News&Niche',
    publisher: 'News&Niche',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://newsandniche.com'),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image || defaultImage],
      creator: '@newsandniche',
      site: '@newsandniche',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  };

  // Add article-specific metadata
  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: author ? [author] : undefined,
      section,
      tags,
    };
  }

  return metadata;
}

export function generateStructuredData(config: SEOConfig) {
  const {
    title,
    description,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
    readingTime,
    wordCount
  } = config;

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebPage',
    headline: title,
    description,
    image: image,
    url: url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: author ? {
      '@type': 'Person',
      name: author,
    } : {
      '@type': 'Organization',
      name: 'News&Niche',
    },
    publisher: {
      '@type': 'Organization',
      name: 'News&Niche',
      logo: {
        '@type': 'ImageObject',
        url: 'https://newsandniche.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  if (type === 'article') {
    return {
      ...baseStructuredData,
      '@type': 'Article',
      articleSection: section,
      keywords: tags?.join(', '),
      wordCount,
      timeRequired: readingTime ? `PT${readingTime}M` : undefined,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
    };
  }

  return baseStructuredData;
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'News&Niche',
    url: 'https://newsandniche.com',
    logo: 'https://newsandniche.com/logo.png',
    description: 'Your source for news, stories, and niche content in both English and Bangla.',
    sameAs: [
      'https://twitter.com/newsandniche',
      'https://facebook.com/newsandniche',
      'https://linkedin.com/company/newsandniche',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1712-345678',
      contactType: 'customer service',
      email: 'info@newsandniche.com',
    },
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'News&Niche',
    url: 'https://newsandniche.com',
    description: 'Your source for news, stories, and niche content in both English and Bangla.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://newsandniche.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// SEO helper functions
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  return truncateText(plainText, maxLength);
}

export function generateSitemapUrl(url: string, lastmod?: string, changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly', priority: number = 0.5) {
  return {
    loc: url,
    lastmod: lastmod || new Date().toISOString(),
    changefreq,
    priority,
  };
} 