import { MetadataRoute } from 'next';
import { generateSitemapUrl } from './lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsandniche.com';
  
  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/products',
    '/about',
    '/contact',
    '/auth/signin',
    '/auth/signup',
  ];

  // Get all published posts from API
  let posts: any[] = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/posts?status=published&limit=1000`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      posts = data.posts || [];
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Generate sitemap entries for static pages
  const staticEntries: MetadataRoute.Sitemap = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1.0 : 0.8,
  }));

  // Generate sitemap entries for blog posts
  const postEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Generate sitemap entries for categories
  const categories = ['technology', 'lifestyle', 'fashion', 'health', 'travel', 'food', 'entertainment'];
  const categoryEntries: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Generate sitemap entries for tags
  const commonTags = ['blogging', 'technology', 'seo', 'affiliate', 'marketing', 'social-media', 'income', 'content'];
  const tagEntries: MetadataRoute.Sitemap = commonTags.map(tag => ({
    url: `${baseUrl}/blog/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
  ];
} 